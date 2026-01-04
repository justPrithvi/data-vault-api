import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../entities/user.entity';
import { Tags } from '../entities/tags.entities';

@Entity({ name: 'documents' })
export class Documents {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fileName: string;

  @Column()
  fileType: string;

  @Column({ nullable: true })
  s3Key: string; // path in S3 bucket (nullable for local storage)

  @Column({ nullable: true })
  s3Url: string; // final URL to access file (nullable for local storage)

  @Column({ nullable: true })
  localPath: string; // local file path when not using S3

  @Column()
  user_id: number; // foreign key column

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;

  @Column()
  size: number;

  @ManyToMany(() => Tags, { eager: false })
  @JoinTable({
    name: 'document_tags',
    joinColumn: { name: 'document_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tag_id', referencedColumnName: 'id' },
  })
  tags: Tags[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
