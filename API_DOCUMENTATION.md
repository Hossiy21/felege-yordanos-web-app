# SST Manager API Documentation

## Overview

This document provides comprehensive API documentation for the SST Manager Sunday School Digital Management System.

## Base URL
```
http://localhost:8000 (development)
```

## Authentication

All API requests require authentication except for login and health check endpoints. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Response Format

### Success Response
```json
{
  "success": true,
  "data": {},
  "message": "Operation successful",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description",
    "details": {}
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
```

## Endpoints

### Authentication

#### Login
```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "name": "John Doe",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Login successful"
}
```

#### Get Current User
```http
GET /auth/me
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "name": "John Doe",
      "role": "user",
      "created_at": "2024-01-01T00:00:00Z"
    }
  }
}
```

#### Refresh Token
```http
POST /auth/refresh
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "new_jwt_token_here"
  },
  "message": "Token refreshed"
}
```

#### Logout
```http
POST /auth/logout
```

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### Admin Endpoints

#### Create User
```http
POST /admin/create-user
```
*Requires admin role*

**Request Body:**
```json
{
  "email": "newuser@example.com",
  "password": "securepassword",
  "name": "New User",
  "role": "user"
}
```

#### List Users
```http
GET /admin/users
```
*Requires admin role*

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search term

**Response:**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": 1,
        "email": "user@example.com",
        "name": "John Doe",
        "role": "user",
        "created_at": "2024-01-01T00:00:00Z",
        "last_login": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1,
      "pages": 1
    }
  }
}
```

#### Update User
```http
PATCH /admin/update-user
```
*Requires admin role*

**Request Body:**
```json
{
  "id": 1,
  "email": "updated@example.com",
  "name": "Updated Name",
  "role": "admin"
}
```

#### System Statistics
```http
GET /admin/stats
```
*Requires admin role*

**Response:**
```json
{
  "success": true,
  "data": {
    "total_users": 25,
    "active_users": 20,
    "total_letters": 150,
    "total_news": 45,
    "total_meetings": 12,
    "system_health": "healthy"
  }
}
```

### News Management

#### List News
```http
GET /news
```

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Items per page
- `status` (optional): published/draft
- `search` (optional): Search term

**Response:**
```json
{
  "success": true,
  "data": {
    "news": [
      {
        "id": "507f1f77bcf86cd799439011",
        "title": "Sunday School News",
        "content": "News content here...",
        "author": "John Doe",
        "status": "published",
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-01-01T00:00:00Z",
        "attachments": ["file1.pdf", "image1.jpg"]
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 45,
      "pages": 5
    }
  }
}
```

#### Create News
```http
POST /news
```

**Request Body:**
```json
{
  "title": "New Sunday School Event",
  "content": "Detailed content here...",
  "status": "draft",
  "attachments": ["file_url_1", "file_url_2"]
}
```

#### Update News
```http
PUT /news/{id}
```

**Request Body:**
```json
{
  "title": "Updated Title",
  "content": "Updated content...",
  "status": "published"
}
```

#### Delete News
```http
DELETE /news/{id}
```

### Letter Management

#### List Letters
```http
GET /letters
```

**Query Parameters:**
- `page`, `limit`, `search`
- `status`: draft/pending/approved/rejected
- `type`: incoming/outgoing

**Response:**
```json
{
  "success": true,
  "data": {
    "letters": [
      {
        "id": "507f1f77bcf86cd799439011",
        "title": "Letter Title",
        "content": "Letter content...",
        "type": "incoming",
        "status": "pending",
        "sender": "Sender Name",
        "recipient": "Recipient Name",
        "created_by": "John Doe",
        "created_at": "2024-01-01T00:00:00Z",
        "attachments": []
      }
    ]
  }
}
```

#### Create Letter
```http
POST /letters
```

**Request Body:**
```json
{
  "title": "New Letter",
  "content": "Letter content...",
  "type": "outgoing",
  "recipient": "Recipient Name",
  "attachments": []
}
```

#### Update Letter
```http
PUT /letters/{id}
```

#### Approve/Reject Letter
```http
PATCH /letters/{id}/status
```

**Request Body:**
```json
{
  "status": "approved",
  "comments": "Approved for distribution"
}
```

### Meeting Management

#### List Meetings
```http
GET /meetings
```

**Response:**
```json
{
  "success": true,
  "data": {
    "meetings": [
      {
        "id": "507f1f77bcf86cd799439011",
        "title": "Monthly Meeting",
        "description": "Monthly Sunday School meeting",
        "date": "2024-01-15T10:00:00Z",
        "location": "Church Hall",
        "attendees": ["John Doe", "Jane Smith"],
        "minutes": "Meeting minutes content...",
        "created_by": "John Doe",
        "created_at": "2024-01-01T00:00:00Z"
      }
    ]
  }
}
```

#### Create Meeting
```http
POST /meetings
```

**Request Body:**
```json
{
  "title": "New Meeting",
  "description": "Meeting description",
  "date": "2024-01-15T10:00:00Z",
  "location": "Church Hall",
  "attendees": ["John Doe", "Jane Smith"]
}
```

#### Update Meeting Minutes
```http
PUT /meetings/{id}/minutes
```

**Request Body:**
```json
{
  "minutes": "Detailed meeting minutes..."
}
```

### File Storage

#### Upload File
```http
POST /storage/upload
```

**Content-Type:** multipart/form-data

**Form Data:**
- `file`: File to upload
- `folder`: Target folder (news/letters/meetings/gallery)

**Response:**
```json
{
  "success": true,
  "data": {
    "url": "https://minio.example.com/bucket/file.pdf",
    "filename": "file.pdf",
    "size": 1024000
  }
}
```

## Error Codes

| Code | Description |
|------|-------------|
| `VALIDATION_ERROR` | Invalid input data |
| `UNAUTHORIZED` | Authentication required |
| `FORBIDDEN` | Insufficient permissions |
| `NOT_FOUND` | Resource not found |
| `CONFLICT` | Resource conflict |
| `INTERNAL_ERROR` | Server error |
| `RATE_LIMITED` | Too many requests |

## Rate Limiting

- **Authenticated requests**: 1000 requests per hour
- **Unauthenticated requests**: 100 requests per hour
- **Login attempts**: 5 attempts per 15 minutes

## WebSocket Events (Future)

The system supports real-time notifications via WebSocket:

```javascript
// Connect to WebSocket
const ws = new WebSocket('ws://localhost:8000/ws?token=<jwt_token>');

// Listen for events
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Received:', data);
};

// Event types:
// - user_login
// - letter_created
// - news_published
// - meeting_scheduled
```

## SDKs and Libraries

### JavaScript/TypeScript Client

```javascript
import { SSTManagerAPI } from 'sst-manager-api';

const api = new SSTManagerAPI({
  baseURL: 'http://localhost:8000',
  token: 'your_jwt_token'
});

// Example usage
const news = await api.news.list({ page: 1, limit: 10 });
const letter = await api.letters.create({
  title: 'New Letter',
  content: 'Content...',
  type: 'outgoing'
});
```

## Changelog

### Version 1.0.0
- Initial release
- Basic CRUD operations for all entities
- JWT authentication
- Role-based access control
- File upload support

### Version 1.1.0 (Planned)
- Real-time notifications
- Advanced search and filtering
- Bulk operations
- API rate limiting improvements
- Enhanced error handling

## Support

For API support or questions:
- Email: support@sstmanager.com
- Documentation: https://docs.sstmanager.com
- GitHub Issues: https://github.com/sstmanager/api/issues