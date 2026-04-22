# ⛪ ቦሌ ደብረ ሳሌም መድኃኔዓለም ካቴድራል ፈለገ ዮርዳኖስ ሰንበት ትምህርት ቤት
<!-- Bole Debre Salem MedhaneAlam Cathedral Felege Yordanos Sunday School -->

A comprehensive, full-stack web application for managing the Sunday School operations, built with modern technologies and microservices architecture.

## 📋 Overview

ቦሌ ደብረ ሳሌም መድኃኔዓለም ካቴድራል ፈለገ ዮርዳኖስ ሰንበት ትምህርት ቤት Manager is a digital management system designed specifically for Sunday School administration. It provides tools for letter management, meeting minutes, document security, approval workflows, news management, gallery management, and user administration with role-based access control.

## 🏗️ Architecture

### System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js       │    │   Gateway       │    │   Microservices │
│   Frontend      │◄──►│   Service       │◄──►│   (Auth, News,  │
│   (React)       │    │   (Go/Gin)      │    │    Letters, etc.)│
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   PostgreSQL    │    │   MongoDB       │    │   MinIO         │
│   (Auth & Users)│    │   (Content)     │    │   (File Storage)│
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Backend Architecture (Microservices)

- **Gateway Service**: API Gateway that routes requests to appropriate services and handles authentication
- **Auth Service**: User authentication, authorization, and user management
- **News Service**: News article management and publishing
- **Letter Service**: Letter creation, management, and approval workflows
- **Meeting Service**: Meeting minutes and scheduling

### Database Design

- **PostgreSQL**: User authentication, roles, and relational data
- **MongoDB**: Content storage (news, letters, meetings)
- **MinIO**: File storage for documents, images, and attachments

## 🚀 Features

### Core Features
- **🔐 Authentication & Authorization**: JWT-based auth with role-based access control (Admin/User)
- **📧 Letter Management**: Create, edit, approve, and track letters with workflow
- **📰 News Management**: Publish and manage news articles
- **📅 Meeting Management**: Schedule meetings and record minutes
- **🖼️ Gallery Management**: Upload and organize images
- **📊 Dashboard**: Real-time statistics and quick actions
- **👥 User Management**: Admin panel for user administration
- **🔍 Audit Logs**: Track all system activities
- **🌍 Internationalization**: Multi-language support (Amharic, English)
- **🎨 Modern UI**: Responsive design with dark/light theme

### Security Features
- Rate limiting and CORS protection
- JWT token-based authentication
- Role-based permissions
- Secure file upload and storage
- Data ownership and privacy controls

## 🛠️ Tech Stack

### Backend
- **Language**: Go 1.24.4
- **Framework**: Gin Gonic
- **Database**: PostgreSQL (pgx driver), MongoDB
- **File Storage**: MinIO
- **Authentication**: JWT
- **Rate Limiting**: Tollbooth
- **Containerization**: Docker & Docker Compose

## 🗺 Project Roadmap

### Phase 1: Core Infrastructure ✅
- [x] Basic microservices setup (Auth, Letters, News)
- [x] API Gateway implementation with JWT verification
- [x] Shared Identity headers across services

### Phase 2: Document Management 🚀 (Current)
- [x] MinIO Storage integration
- [x] Document metadata management with MongoDB
- [x] Professional Document Library UI
- [x] **Full CRUD**: View, Edit, Delete, and Secure Upload
- [ ] Document search & advanced filtering (In Progress)

### Phase 3: Advanced Features ⏳
- [ ] Real-time notifications for document assignments
- [ ] Meeting management & scheduling
- [ ] Integrated Church Registry

## 📝 Development Log (Daily Commits)

### 2026-04-22
- **Document System**: Finalized professional document library with MinIO integration.
- **Gateway**: Enhanced dynamic proxy to support `/api/documents` and relaxed department checks for public archives.
- **UI**: Implemented Edit/Delete modals and premium card-based layout.
- **Security**: Hardened JWT verification and implemented `.env` safety patterns.

### 2026-04-20
- **Letters**: Implemented PDF proxying for secure document viewing.
- **Infrastructure**: Initialized MinIO buckets and configured storage gateway.

---
*Stay tuned for more updates as we build the future of church digital administration.*

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI (shadcn/ui)
- **State Management**: React Context + Custom Hooks
- **Internationalization**: i18next
- **Forms**: React Hook Form + Zod validation
- **Notifications**: Sonner
- **PDF Generation**: html2pdf.js

### DevOps
- **Containerization**: Docker & Docker Compose
- **Environment**: .env configuration
- **Development**: Hot reload, Turbo mode

## 📁 Project Structure

```
church-management-system/
├── README.md
├── backend/
│   ├── docker-compose.yml
│   ├── go.mod
│   ├── internal/
│   │   ├── handlers/
│   │   │   ├── handlers.go
│   │   │   ├── stats.go
│   │   │   └── user.go
│   │   ├── middleware/
│   │   │   ├── constants.go
│   │   │   └── limiter.go
│   │   └── services/
│   └── services/
│       ├── auth-service/
│       │   ├── cmd/
│       │   ├── internal/
│       │   ├── Dockerfile
│       │   └── go.mod
│       ├── gateway-service/
│       │   ├── cmd/
│       │   ├── middleware/
│       │   ├── proxy/
│       │   ├── Dockerfile
│       │   └── go.mod
│       ├── letter-service/
│       │   ├── cmd/
│       │   ├── internal/
│       │   ├── tmp/
│       │   ├── Dockerfile
│       │   └── go.mod
│       ├── meeting-service/
│       │   ├── cmd/
│       │   ├── internal/
│       │   └── go.mod
│       └── news-service/
│           ├── cmd/
│           ├── internal/
│           ├── Dockerfile
│           └── go.mod
├── frontend/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── signin/
│   │   │   └── signup/
│   │   ├── (dashboard)/
│   │   │   ├── audit/
│   │   │   ├── dashboard/
│   │   │   ├── documents/
│   │   │   ├── gallery-management/
│   │   │   ├── letters/
│   │   │   ├── meetings/
│   │   │   ├── news-management/
│   │   │   ├── security/
│   │   │   ├── settings/
│   │   │   └── users/
│   │   ├── about/
│   │   ├── classes/
│   │   ├── contact/
│   │   ├── gallery/
│   │   ├── home/
│   │   ├── news/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ui/
│   │   ├── audit/
│   │   ├── dashboard/
│   │   ├── documents/
│   │   ├── landing/
│   │   ├── letters/
│   │   ├── meetings/
│   │   ├── users/
│   │   ├── app-sidebar.tsx
│   │   ├── language-toggle.tsx
│   │   ├── theme-provider.tsx
│   │   ├── theme-toggle.tsx
│   │   └── top-nav.tsx
│   ├── hooks/
│   ├── lib/
│   ├── public/
│   ├── scripts/
│   ├── styles/
│   ├── components.json
│   ├── next.config.mjs
│   ├── package.json
│   ├── pnpm-lock.yaml
│   ├── postcss.config.mjs
│   ├── tailwind.config.ts
│   └── tsconfig.json
└── tmp/
```

## 🚦 Getting Started

### Prerequisites

- Docker & Docker Compose
- Node.js 18+ (for frontend development)
- Go 1.24+ (for backend development)
- pnpm (recommended for frontend)

### 1. Environment Setup

Create a `.env` file in the `backend/` directory:

```env
# Database Configuration
DB_USER=postgres
DB_PASSWORD=mypassword123
DB_HOST=localhost
DB_PORT=5432
DB_NAME=church_management_db

# JWT Configuration
JWT_SECRET=your_super_secret_key_here

# MinIO Configuration
MINIO_ROOT_USER=minioadmin
MINIO_ROOT_PASSWORD=minioadmin123

# Service Ports
PORT=8080
NEWS_PORT=8081
LETTERS_PORT=8082
MEETINGS_PORT=8083

# Gin Mode
GIN_MODE=debug
```

### 2. Start the Backend Services

```bash
cd backend
docker-compose up -d
```

This will start:
- PostgreSQL on port 5432
- MongoDB on port 27017
- MinIO on ports 9000 (API) and 9001 (Console)

### 3. Run Individual Services

Each service can be run independently:

```bash
# Auth Service
cd backend/services/auth-service
go run cmd/main.go

# Gateway Service
cd backend/services/gateway-service
go run main.go

# Other services follow similar pattern
```

### 4. Start the Frontend

```bash
cd frontend
pnpm install
pnpm dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Gateway API: http://localhost:8000
- MinIO Console: http://localhost:9001

## 🔧 Development

### Backend Development

Each microservice is self-contained with its own:
- `go.mod` for dependencies
- `cmd/` directory for main application
- `internal/` directory for business logic
- Dockerfile for containerization

### Frontend Development

The frontend uses:
- **Next.js App Router** for routing
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **shadcn/ui** for components
- **React Hook Form + Zod** for form validation

### API Documentation

The system uses RESTful APIs with the following patterns:
- `POST /auth/login` - User authentication
- `GET /news` - Fetch news articles
- `POST /letters` - Create letters
- `GET /meetings` - Get meetings

## 🔒 Security

- **Authentication**: JWT tokens with expiration
- **Authorization**: Role-based access control (admin/user)
- **Rate Limiting**: Prevents abuse with configurable limits
- **CORS**: Configured for cross-origin requests
- **Data Validation**: Input sanitization and validation
- **File Security**: Secure upload with type checking

## 🌍 Internationalization

The application supports multiple languages:
- English
- Amharic (አማርኛ)

Language files are located in `frontend/lib/i18n.ts`

## 📊 Monitoring & Logging

- **Health Checks**: Each service has `/health` endpoints
- **Audit Logs**: Track all user actions and system events
- **Error Handling**: Comprehensive error responses
- **Logging**: Structured logging for debugging

## 🚀 Deployment

### Docker Deployment

```bash
# Build and run all services
docker-compose up --build

# Run in detached mode
docker-compose up -d --build
```

### Production Considerations

- Set `GIN_MODE=release` for production
- Use environment variables for all configuration
- Configure proper SSL/TLS certificates
- Set up monitoring and alerting
- Configure backup strategies for databases

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 📞 Support

For support or questions, please contact the development team.

---

**Built with ❤️ for ቦሌ ደብረ ሳሌም መድኃኔዓለም ካቴድራል ፈለገ ዮርዳኖስ ሰንበት ትምህርት ቤት**

