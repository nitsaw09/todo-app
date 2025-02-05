# TODO App
This project is a fullstack TODO application with a Next.js frontend and a Node.js backend connected to a MongoDB database. It supports user authentication, task management, and Swagger API documentation.

---

### Prerequisites
Before you begin, ensure you have the following installed:
- Node.js (v18.20 or higher)
- Docker (v20 or higher)
- MongoDB (or use Docker to run MongoDB)

---

### Frontend Setup
The frontend is built using Next.js with the App Router.
1. Navigate to the Frontend Directory: `cd frontend`
2. Install Dependencies: `npm install`
3. Start the Development Server: `npm run dev`
The frontend will be available at:
http://localhost:3000

### Backend Setup
The backend is built using Node.js, Express, and MongoDB.
1. Navigate to the Backend Directory: `cd backend`
2. Install Dependencies: `npm install`
3. Start the Development Server: `npm run dev`
4. The backend will be available at: http://localhost:5000

---

### Running with Docker
You can run the entire application (frontend, backend, and MongoDB) using Docker.

1. Build and Start the Docker Containers From the root directory, run: `docker-compose up --build` 
- Start the frontend on http://localhost:3000.
- Start the backend on http://localhost:5000.
- Start the MongoDB database.

2. Stop the Docker Containers, To stop the containers, run: `docker-compose down`

---
### API Documentation
The backend API is documented using Swagger. You can access the Swagger UI at:
http://localhost:5000/api-docs

### Environment Variables
#### Frontend 
Create a .env.local file in the frontend directory:
- `NEXT_PUBLIC_API_BASE_URL=http://localhost:5000`
- `NEXT_PUBLIC_AUTH_TOKEN_EXPIRES_IN_DAYS=7`

### Backend
Create a .env file in the backend directory:
- `MONGODB_URI=mongodb://mongo:27017/todo-app`
- `PORT=5000`
- `JWT_SECRET=your_jwt_secret_key`
