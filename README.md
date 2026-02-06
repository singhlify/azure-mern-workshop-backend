# Todo Backend API

A RESTful API backend for a Todo application built with Node.js, Express.js, and MongoDB (Mongoose). This is part of a MERN workshop series.

## Quick Start

### Prerequisites

- Node.js (v14 or higher)
- pnpm (or npm/yarn)
- MongoDB Atlas account (or local MongoDB instance)

### Installation

1. Install dependencies:
```bash
pnpm install
```

2. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Update `.env` with your MongoDB Atlas connection string:
   ```
   PORT=5000
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/todoapp?retryWrites=true&w=majority
   ```

### Running the Server

**Development mode** (with auto-reload):
```bash
pnpm dev
```

**Production mode**:
```bash
pnpm start
```

The server will start on `http://localhost:5000` (or the port specified in `.env`).

## API Endpoints

### Health Check
- **GET** `/health`
  - Returns: `{ success: true, message: "Backend is healthy!" }`

### Todos

#### Create Todo
- **POST** `/api/todos`
  - **Body:**
    ```json
    {
      "title": "Complete workshop assignment"
    }
    ```
  - **Success Response:** `201 Created`
    ```json
    {
      "success": true,
      "data": {
        "_id": "...",
        "title": "Complete workshop assignment",
        "isCompleted": false,
        "createdAt": "...",
        "updatedAt": "..."
      }
    }
    ```

#### Get All Todos
- **GET** `/api/todos`
  - **Success Response:** `200 OK`
    ```json
    {
      "success": true,
      "data": [
        {
          "_id": "...",
          "title": "Complete workshop assignment",
          "isCompleted": false,
          "createdAt": "...",
          "updatedAt": "..."
        }
      ]
    }
    ```
  - Returns todos sorted by newest first (createdAt descending)

#### Update Todo
- **PATCH** `/api/todos/:id`
  - **Body:** (at least one field required)
    ```json
    {
      "title": "Updated title",
      "isCompleted": true
    }
    ```
  - **Success Response:** `200 OK`
    ```json
    {
      "success": true,
      "data": {
        "_id": "...",
        "title": "Updated title",
        "isCompleted": true,
        "createdAt": "...",
        "updatedAt": "..."
      }
    }
    ```
  - **Error Responses:**
    - `400 Bad Request` - Invalid todo id or empty title
    - `404 Not Found` - Todo not found

#### Delete Todo
- **DELETE** `/api/todos/:id`
  - **Success Response:** `200 OK`
    ```json
    {
      "success": true,
      "message": "Todo deleted successfully"
    }
    ```
  - **Error Responses:**
    - `400 Bad Request` - Invalid todo id
    - `404 Not Found` - Todo not found

## Testing with Postman

### Setup
1. Import the following endpoints into Postman or use the HTTP client of your choice.

### Sample Requests

**1. Health Check**
```
GET http://localhost:5000/health
```

**2. Create Todo**
```
POST http://localhost:5000/api/todos
Content-Type: application/json

{
  "title": "Learn Express.js"
}
```

**3. Get All Todos**
```
GET http://localhost:5000/api/todos
```

**4. Update Todo** (replace `:id` with actual todo ID)
```
PATCH http://localhost:5000/api/todos/:id
Content-Type: application/json

{
  "isCompleted": true
}
```

**5. Delete Todo** (replace `:id` with actual todo ID)
```
DELETE http://localhost:5000/api/todos/:id
```

## Project Structure

```
backend/
├── src/
│   ├── server.js          # Entry point, starts server after DB connection
│   ├── app.js             # Express app setup and middleware
│   ├── config/
│   │   └── db.js          # MongoDB connection logic
│   ├── models/
│   │   └── Todo.js        # Todo Mongoose schema
│   ├── controllers/
│   │   └── todoController.js  # Todo business logic
│   └── routes/
│       ├── healthRoutes.js    # Health check routes
│       └── todoRoutes.js      # Todo CRUD routes
├── .env                   # Environment variables (not committed)
├── .env.example           # Environment variables template
├── .gitignore
├── package.json
└── README.md
```

## Environment Variables

Required environment variables (set in `.env`):
- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB Atlas connection string

**Important:** Never commit `.env` to version control. The `.gitignore` file is configured to exclude it.

## Notes

- The server will not start if MongoDB connection fails
- All error responses follow a consistent format: `{ success: false, message: "..." }`
- Todos are automatically sorted by creation date (newest first)
- The Todo model includes automatic timestamps (`createdAt`, `updatedAt`)
