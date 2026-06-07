# DataVault Backend (`data-vault-api`)

A NestJS web server that provides user authentication via JWT tokens, database storage mapping with TypeORM, and file persistence on local storage.

---

## 🏗️ Codebase Structure

```bash
data-vault-api/
├── dist/                    # Compiled JavaScript files (built output)
├── uploads/                 # Storage directory where uploaded documents are stored
├── test/                    # End-to-end (e2e) tests folder
│
├── src/
│   ├── main.ts              # Entry point setting up CORS, prefixing paths, and starting NestJS
│   ├── app.module.ts        # Roots modules: Database configuration, Auth routing, Document modules
│   ├── app.controller.ts    # Base health-check controllers
│   ├── app.service.ts       # Base business logic helpers
│   │
│   ├── auth/                # 🔐 Authentication Module
│   │   ├── auth.module.ts   # Passport, JwtModule, and User dependency registrations
│   │   ├── auth.controller.ts # Signup, Signin, and Token Validation routes
│   │   ├── auth.service.ts  # Logic for bcrypt password hashing, login, and signing JWTs
│   │   ├── jwt.strategy.ts  # passport-jwt strategy for validating signature and user profile
│   │   ├── jwt-auth.guard.ts # Guard that protects controllers via request authorization headers
│   │   └── admin.guard.ts   # Check if user has administrative rights
│   │
│   ├── document/            # 📁 Document Upload & Retrieval Module
│   │   ├── document.module.ts # Document controller, service, and DB repositories
│   │   ├── document.controller.ts # File upload handling (Multer) & download routes
│   │   ├── document.service.ts # Upload validation, size parsing, and DB commits
│   │   └── dto/             # Data Transfer Objects for validation
│   │
│   ├── entities/            # 🗄️ Database Models (TypeORM Schemas)
│   │   ├── user.entity.ts   # User profile schema (email, name, hashed password, isAdmin)
│   │   ├── documents.entity.ts # Document catalog schema (fileName, size, localPath, user_id)
│   │   └── tags.entities.ts # Categories/Tags schema (many-to-many relationship with documents)
│   │
│   ├── repository/          # Custom DB Access Layer (Abstraction on TypeORM)
│   │   ├── user.repository.ts # Custom user queries (findByEmail, findById)
│   │   ├── document.repository.ts # Pagination, text search query building
│   │   └── tags.repository.ts # Fetch all, delete, or create categorizations
│   │
│   ├── database/            # Database config
│   │   └── database.module.ts # Dynamic TypeORM Postgres setup
│   │
│   ├── aws/                 # Preserved AWS interfaces (Cognito / S3 integrations)
│   └── common/              # Global decorators, exceptions, and filters
│
├── package.json             # Core dependencies and launch scripts
├── tsconfig.json            # TypeScript settings
└── ecosystem.config.js      # Production deployment config for PM2 process manager
```

---

## 🛠️ REST API Endpoints

### 🔐 Authentication (`/auth`)
* **`POST /auth/signup`**: Registers a new user. Hashes the password with `bcrypt` (10 rounds), saves the user profile to Postgres, and returns a JWT access token.
* **`POST /auth/signin`**: Validates credentials against user passwords in the DB. Returns a signed JWT access token on success.
* **`GET /auth/validate`** *(Protected by JWT)*: Loops back validation requests. Used by the Python microservice to verify client headers. Returns the validated user profile (`{ id, email, name, isAdmin }`).

### 📁 Documents (`/documents`)
* **`POST /documents/upload`** *(Protected by JWT)*: Processes a single file upload using a Multer disk storage engine interceptor, placing files into `./uploads`. Registers the document metadata and tag mappings in the database.
* **`GET /documents/:email`** *(Protected by JWT)*: Fetches catalog records for a specific user. Supports pagination (`?page=1&limit=10`) and textual search query filtering.
* **`GET /documents/download/:id`** *(Protected by JWT)*: Direct download stream endpoint that returns the requested file located in the `./uploads` directory.

---

## ⚙️ Configuration & Environment Variables

Define a `.env` file in the root of the `data-vault-api/` directory:

```env
# Server Configuration
APP_PORT=5001

# Security Cryptography Secrets
JWT_SECRET=your_secret_key
JWT_REFRESH_SECRET=your_refresh_secret

# Database Settings
DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_postgres_username
DB_PASSWORD=your_postgres_password
DB_DATABASE=data_vault
```

---

## 🚀 Getting Started

1. **Prerequisite:** PostgreSQL must be running, and you need a database named `data_vault`:
   ```sql
   CREATE DATABASE data_vault;
   ```
2. Navigate to the API folder and install dependencies:
   ```bash
   cd data-vault-api
   npm install
   ```
3. Initialize the destination upload directory:
   ```bash
   mkdir -p uploads
   ```
4. Run the NestJS server in watch mode:
   ```bash
   npm run start:dev
   ```
5. The API will be available at `http://localhost:5001`.
