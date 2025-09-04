# DevNotes API Documentation

## Overview

The DevNotes API provides RESTful endpoints for managing notes with user authentication. All endpoints require authentication via session cookies.

## Base URL
```
http://localhost:3000/api
```

## Authentication

All notes endpoints require authentication. Users must first login via the auth endpoints to establish a session.

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "alice",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "message": "Login successful",
  "user": {
    "id": "user_id",
    "username": "alice"
  }
}
```

### Logout
```http
POST /api/auth/logout
```

**Response (200 OK):**
```json
{
  "message": "Logout successful"
}
```

## Notes Endpoints

### 1. Get All Notes

Retrieve all notes for the authenticated user with optional filtering.

```http
GET /api/notes
```

**Query Parameters:**
- `category` (optional): Filter by category
- `archived` (optional): Filter by archived status (true/false)
- `pinned` (optional): Filter by pinned status (true/false)
- `search` (optional): Search in title, content, and tags
- `limit` (optional): Limit number of results
- `offset` (optional): Skip number of results for pagination

**Examples:**
```http
GET /api/notes
GET /api/notes?category=Work
GET /api/notes?pinned=true
GET /api/notes?search=meeting
GET /api/notes?limit=10&offset=0
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "note_id",
      "title": "Welcome to DevNotes",
      "content": "This is your first note!",
      "category": "Welcome",
      "tags": ["welcome", "first-note"],
      "archived": false,
      "pinned": true,
      "createdAt": "2025-09-04T06:42:00.000Z",
      "updatedAt": "2025-09-04T06:42:00.000Z",
      "userId": "user_id"
    }
  ],
  "message": "Found 1 notes"
}
```

### 2. Get Single Note

Retrieve a specific note by ID.

```http
GET /api/notes/{id}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "note_id",
    "title": "Project Ideas",
    "content": "# Project Ideas for 2025...",
    "category": "Projects",
    "tags": ["projects", "ideas"],
    "archived": false,
    "pinned": false,
    "createdAt": "2025-09-04T06:42:00.000Z",
    "updatedAt": "2025-09-04T06:42:00.000Z",
    "userId": "user_id"
  },
  "message": "Note retrieved successfully"
}
```

**Response (404 Not Found):**
```json
{
  "success": false,
  "error": "Note not found"
}
```

### 3. Create Note

Create a new note.

```http
POST /api/notes
Content-Type: application/json

{
  "title": "My New Note",
  "content": "This is the note content.",
  "category": "Personal",
  "tags": ["personal", "ideas"],
  "pinned": false
}
```

**Required Fields:**
- `title` (string): Note title
- `content` (string): Note content

**Optional Fields:**
- `category` (string): Note category
- `tags` (array): Array of tag strings
- `pinned` (boolean): Whether note is pinned (default: false)

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "new_note_id",
    "title": "My New Note",
    "content": "This is the note content.",
    "category": "Personal",
    "tags": ["personal", "ideas"],
    "archived": false,
    "pinned": false,
    "createdAt": "2025-09-04T12:00:00.000Z",
    "updatedAt": "2025-09-04T12:00:00.000Z",
    "userId": "user_id"
  },
  "message": "Note created successfully"
}
```

**Response (400 Bad Request):**
```json
{
  "success": false,
  "error": "Title and content are required"
}
```

### 4. Update Note

Update an existing note.

```http
PUT /api/notes/{id}
Content-Type: application/json

{
  "title": "Updated Note Title",
  "content": "Updated content",
  "category": "Work",
  "tags": ["work", "updated"],
  "pinned": true,
  "archived": false
}
```

**Optional Fields (all fields are optional for updates):**
- `title` (string): Note title
- `content` (string): Note content
- `category` (string): Note category
- `tags` (array): Array of tag strings
- `pinned` (boolean): Whether note is pinned
- `archived` (boolean): Whether note is archived

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "note_id",
    "title": "Updated Note Title",
    "content": "Updated content",
    "category": "Work",
    "tags": ["work", "updated"],
    "archived": false,
    "pinned": true,
    "createdAt": "2025-09-04T06:42:00.000Z",
    "updatedAt": "2025-09-04T12:30:00.000Z",
    "userId": "user_id"
  },
  "message": "Note updated successfully"
}
```

**Response (404 Not Found):**
```json
{
  "success": false,
  "error": "Note not found"
}
```

### 5. Delete Note

Delete a note permanently.

```http
DELETE /api/notes/{id}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Note deleted successfully"
}
```

**Response (404 Not Found):**
```json
{
  "success": false,
  "error": "Note not found"
}
```

## Error Responses

### Authentication Errors

**Response (401 Unauthorized):**
```json
{
  "success": false,
  "error": "Unauthorized"
}
```

### Validation Errors

**Response (400 Bad Request):**
```json
{
  "success": false,
  "error": "Title and content are required"
}
```

**Response (400 Bad Request):**
```json
{
  "success": false,
  "error": "Invalid JSON in request body"
}
```

### Server Errors

**Response (500 Internal Server Error):**
```json
{
  "success": false,
  "error": "Internal server error"
}
```

## Testing the API

### Using curl

1. **Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"alice","password":"password123"}' \
  -c cookies.txt
```

2. **Get all notes:**
```bash
curl -X GET http://localhost:3000/api/notes \
  -b cookies.txt
```

3. **Create a note:**
```bash
curl -X POST http://localhost:3000/api/notes \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Note","content":"Test content","category":"Test"}' \
  -b cookies.txt
```

4. **Update a note:**
```bash
curl -X PUT http://localhost:3000/api/notes/{note_id} \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated Title","pinned":true}' \
  -b cookies.txt
```

5. **Delete a note:**
```bash
curl -X DELETE http://localhost:3000/api/notes/{note_id} \
  -b cookies.txt
```

### Using Browser Developer Tools

You can test the API directly in the browser console after logging in:

```javascript
// Get all notes
fetch('/api/notes')
  .then(r => r.json())
  .then(console.log)

// Create a note
fetch('/api/notes', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Browser Test Note',
    content: 'Created from browser console',
    category: 'Testing'
  })
}).then(r => r.json()).then(console.log)
```

## Security Features

1. **Session-based Authentication**: All endpoints verify user sessions
2. **User Isolation**: Users can only access their own notes
3. **Input Validation**: All inputs are validated and sanitized
4. **SQL Injection Protection**: Prisma ORM provides built-in protection
5. **HTTP-only Cookies**: Session tokens are stored securely

## Performance Features

1. **Database Indexing**: Optimized indexes on userId, category, archived, pinned, and createdAt
2. **Pagination Support**: Use limit and offset parameters for large datasets
3. **Efficient Queries**: Prisma generates optimized SQL queries
4. **Search Optimization**: Full-text search across title, content, and tags

## Development Notes

- All endpoints follow REST conventions
- Response format is consistent across all endpoints
- Error handling includes proper HTTP status codes
- TypeScript interfaces ensure type safety
- Follows project coding standards and patterns