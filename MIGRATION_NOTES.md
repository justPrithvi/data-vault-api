# Authentication & File Upload Migration

## Changes Made

This backend has been migrated from AWS Cognito + S3 to JWT + Local Storage.

### Authentication
- **Removed:** AWS Cognito authentication
- **Added:** JWT-based authentication with bcrypt password hashing
- **Endpoints:** `/auth/signup` and `/auth/signin` now return JWT tokens

### File Upload
- **Removed:** S3 presigned URL generation
- **Added:** Direct file upload using Multer
- **Storage:** Files saved in `./uploads` directory
- **Endpoint:** `POST /documents/upload` accepts multipart/form-data

## Setup Requirements

### Environment Variables (.env)
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=datavault

# JWT
JWT_SECRET=your-secret-key-change-in-production

# Server
APP_PORT=5001
```

### Database Schema Updates

**User table - Added:**
```sql
ALTER TABLE "user" ADD COLUMN "password" VARCHAR NOT NULL;
```

**Documents table - Modified:**
```sql
ALTER TABLE "documents" ALTER COLUMN "s3Key" DROP NOT NULL;
ALTER TABLE "documents" ALTER COLUMN "s3Url" DROP NOT NULL;
ALTER TABLE "documents" ADD COLUMN "localPath" VARCHAR;
```

Note: With `synchronize: true`, TypeORM will handle this automatically in development.

### First Run

```bash
# Install dependencies
npm install

# Create uploads directory
mkdir -p uploads

# Start server
npm run start:dev
```

## API Changes

### Authentication Endpoints

**POST /auth/signup**
```json
Request: { "userName": "John", "email": "john@example.com", "password": "Pass123!" }
Response: { "accessToken": "jwt...", "user": {...}, "message": "..." }
```

**POST /auth/signin**
```json
Request: { "email": "john@example.com", "password": "Pass123!" }
Response: { "accessToken": "jwt...", "user": {...} }
```

### Document Endpoints (Protected with JWT)

**POST /documents/upload**
- Content-Type: multipart/form-data
- Body: `file` (binary), `tags` (JSON string)
- Returns: Document metadata

**GET /documents/:email**
- Returns: Array of user's documents

**GET /documents/download/:id**
- Returns: File download

## Security

- Passwords hashed with bcrypt (10 rounds)
- JWT tokens expire in 7 days
- All document routes protected with JwtAuthGuard
- User data isolated by user ID

## Files Modified

### Core Changes
- `src/auth/auth.service.ts` - JWT authentication logic
- `src/auth/jwt.strategy.ts` - NEW: JWT validation strategy
- `src/auth/jwt-auth.guard.ts` - NEW: Simplified JWT guard
- `src/auth/auth.module.ts` - Added JWT/Passport modules
- `src/document/document.service.ts` - Multer file handling
- `src/document/document.controller.ts` - File upload endpoint
- `src/entities/user.entity.ts` - Added password field
- `src/entities/documents.entity.ts` - Added localPath field

### Dependencies Added
- `bcrypt` - Password hashing
- `@nestjs/jwt` - JWT token handling
- `@nestjs/passport` - Authentication framework
- `passport-jwt` - JWT strategy
- `multer` - File upload handling

## Notes for Deployment

- Change JWT_SECRET to a strong random string
- Set up proper file storage (consider cloud storage for production)
- Enable HTTPS
- Implement rate limiting
- Add file type/size validation
- Configure CORS for your frontend domain
- Consider adding refresh token mechanism

