export class UserDto {
  id: number;       // or string if UUID
  email: string;
  name: string;

  constructor(partial: Partial<UserDto>) {
    Object.assign(this, partial);
  }
}

export class DocumentDto {
  fileName: string;        // File name
  fileType: string;        // MIME type
  size: number;        // File size in bytes
  tags: number[];      // Selected tags
  s3Url?: string;     // Public URL of the file (optional for local storage)
  s3Key?: string;       // Key in S3 bucket (optional for local storage)
  localPath?: string;   // Local file path (for server-side storage)
  user: UserDto;       // User who uploaded/owns the doc

  constructor(partial: Partial<DocumentDto>) {
    Object.assign(this, partial);
  }
}
