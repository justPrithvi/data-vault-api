# Provider configuration
provider "aws" {
  region = "us-east-1"
}

# Security group for EC2 instances
resource "aws_security_group" "web_sg" {
  name        = "web-sg"
  description = "Allow HTTP and SSH traffic"

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # SSH open to all (for example)
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # HTTP open to all
  }
}

# Launch new EC2 instances (Green)
resource "aws_instance" "green" {
  count         = 2  # number of instances in Green environment
  ami           = "ami-0abcdef1234567890" # replace with your Ubuntu AMI
  instance_type = "t2.micro"
  key_name      = "my-key" # EC2 key pair
  security_groups = [aws_security_group.web_sg.name]

  tags = {
    Name = "GreenServer-${count.index}"
    Env  = "Green"
  }
}

# Application Load Balancer (single ALB)
resource "aws_lb" "app_lb" {
  name               = "app-lb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.web_sg.id]
  subnets            = ["subnet-xxxx", "subnet-yyyy"] # replace with your subnets
}

# Target group for Green environment
resource "aws_lb_target_group" "green_tg" {
  name     = "green-tg"
  port     = 80
  protocol = "HTTP"
  vpc_id   = "vpc-xxxx" # replace with your VPC
  health_check {
    path                = "/"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 2
    matcher             = "200-399"
  }
}

# Register Green instances to the target group
resource "aws_lb_target_group_attachment" "green_attach" {
  count            = length(aws_instance.green.*.id)
  target_group_arn = aws_lb_target_group.green_tg.arn
  target_id        = aws_instance.green[count.index].id
  port             = 80
}

# ALB Listener (initially points to old Blue TG, outputs will be switched in pipeline)
resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.app_lb.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = var.current_tg_arn # pass Blue TG ARN as variable initially
  }
}

# Outputs
output "green_target_group_arn" {
  value = aws_lb_target_group.green_tg.arn
}

output "green_instance_ips" {
  value = aws_instance.green.*.public_ip
}
