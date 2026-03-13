# Todo Backend API

A RESTful API for the Todo app, built with **Express.js** and **MongoDB** (Mongoose).
This is part of the **Building and Deploying a Full-Stack MERN App on Azure with CI/CD** workshop series.

## Tech Stack

| Technology | Version |
| ---------- | ------- |
| Node.js    | 22      |
| Express    | 4.18    |
| Mongoose   | 8.x     |
| pnpm       | 10.26.2 |

## Prerequisites

- Node.js v22+
- pnpm (`corepack enable && corepack prepare pnpm@10.26.2 --activate`)
- A MongoDB Atlas cluster (or a local MongoDB instance)

## Getting Started

1. Install dependencies:

```bash
pnpm install
```

2. Set up environment variables — copy `.env.example` to `.env` and fill in your values:

```
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/todoapp?retryWrites=true&w=majority
```

3. Start the server:

```bash
# Development (auto-reload with nodemon)
pnpm dev

# Production
pnpm start
```

The server starts on [http://localhost:5000](http://localhost:5000).

> The server will **not** start if the MongoDB connection fails.

## Environment Variables

| Variable      | Required | Default | Description                                              |
| ------------- | -------- | ------- | -------------------------------------------------------- |
| `PORT`        | No       | `5000`  | Port the Express server listens on                       |
| `MONGODB_URI` | Yes      | —       | MongoDB connection string                                |
| `NODE_ENV`    | No       | —       | Set to `development` to include stack traces in errors   |

**Important:** Never commit `.env` to version control. The `.gitignore` is already configured to exclude it.

## API Endpoints

### Health Check

| Method | Endpoint  | Description   |
| ------ | --------- | ------------- |
| GET    | `/health` | Health check  |

### Todos

| Method | Endpoint          | Description          |
| ------ | ----------------- | -------------------- |
| GET    | `/api/todos`      | List all todos       |
| POST   | `/api/todos`      | Create a todo        |
| PATCH  | `/api/todos/:id`  | Update a todo by ID  |
| DELETE | `/api/todos/:id`  | Delete a todo by ID  |

### Sample Requests

**Create a todo:**

```bash
curl -X POST http://localhost:5000/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "Learn Express.js"}'
```

**Get all todos:**

```bash
curl http://localhost:5000/api/todos
```

**Toggle completion:**

```bash
curl -X PATCH http://localhost:5000/api/todos/<id> \
  -H "Content-Type: application/json" \
  -d '{"isCompleted": true}'
```

**Delete a todo:**

```bash
curl -X DELETE http://localhost:5000/api/todos/<id>
```

### Response Format

All responses follow a consistent shape:

```json
{ "success": true,  "data": { ... } }
{ "success": false, "message": "Something went wrong" }
```

## Project Structure

```
backend/
├── src/
│   ├── server.js              # Entry point — connects to DB then starts Express
│   ├── app.js                 # Express app setup, middleware, route mounting
│   ├── config/
│   │   └── db.js              # MongoDB connection logic
│   ├── models/
│   │   └── Todo.js            # Todo Mongoose schema
│   ├── controllers/
│   │   └── todoController.js  # CRUD business logic
│   └── routes/
│       ├── healthRoutes.js    # GET /health
│       └── todoRoutes.js      # /api/todos CRUD routes
├── .dockerignore               # Files excluded from Docker builds
├── .env                        # Environment variables (not committed)
├── .env.example                # Template for .env
├── Dockerfile                  # Container build recipe
├── package.json
└── README.md
```

---

## Dockerizing the Backend

The following steps walk you through the **standard container workflow**: build an image, test it locally, then push it to Azure Container Registry (ACR).

### Step 1 — Build the Docker Image

```bash
docker build -t todo-backend .
```

| Flag              | What it does                                              |
| ----------------- | --------------------------------------------------------- |
| `-t todo-backend` | Names (tags) the resulting image                          |
| `.`               | Tells Docker to use the current directory (where the Dockerfile lives) |

> Unlike the frontend, the backend has **no build-time args** — environment variables like `MONGODB_URI` are read at runtime, not baked into the image.

### Step 2 — Run the Container Locally

```bash
docker run --env-file .env -p 5000:5000 todo-backend
```

| Flag / Port      | Meaning                                          |
| ---------------- | ------------------------------------------------ |
| `--env-file .env` | Loads all variables from your local `.env` file into the container (e.g. `MONGODB_URI`, `PORT`) |
| 5000             | Port on **your machine** (host)                  |
| 5000               | Port **inside the container** where Express listens |

Test it:

```bash
curl http://localhost:5000/health
# → { "success": true, "message": "Backend is healthy!" }
```

### Step 3 — Log in to Azure Container Registry

```bash
az acr login --name todoacr
```

This authenticates your local Docker CLI with ACR so you can push images.

### Step 4 — Tag the Image for ACR

```bash
docker tag todo-backend todoacr-chhbdrh0gvdjehdv.azurecr.io/todo-backend
```

Docker registries require images to be tagged with the full registry URL before pushing.

### Step 5 — Push the Image to ACR

```bash
docker push todoacr-chhbdrh0gvdjehdv.azurecr.io/todo-backend
```

Docker uploads every layer of the image. Once complete, the image appears in the Azure Portal under **Container Registry → Repositories → todo-backend**.

### Step 6 — Verify in Azure Portal

Navigate to:

```
Azure Portal → Container Registry → Repositories → todo-backend
```

You should see `todo-backend:latest`.

### Quick Reference (All Commands)

```bash
# Build backend Docker image
docker build -t todo-backend .

# Run backend container locally
docker run --env-file .env -p 5000:5000 todo-backend

# Login to Azure Container Registry
az acr login --name todoacr

# Tag backend image for ACR
docker tag todo-backend todoacr-chhbdrh0gvdjehdv.azurecr.io/todo-backend

# Push backend image to ACR
docker push todoacr-chhbdrh0gvdjehdv.azurecr.io/todo-backend
```

### The Container Workflow (Big Picture)

```
Code  →  Dockerfile  →  Docker Image  →  Run Locally  →  Push to Registry  →  Deploy
```

This is the same workflow used in real production systems — the only difference in CI/CD is that a pipeline runs these commands automatically on every push.
