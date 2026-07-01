# YUBuy
A York University campus marketplace for students to buy and sell used textbooks, furniture, electronics, and other student essentials.

## Table of Contents
- Project Structure
- Getting Started
- Database Setup

## Project Structure
The project is a monorepo containing the frontend and backend of the YUBuy application

### Frontend

The frontend is a React application built with [Vite](https://vitejs.dev/).

**Code Structure:**
-   `frontend/src/assets`: Contains static assets like CSS and images.
-   `frontend/src/pages`: Contains reusable React components.
-   `frontend/src/App.jsx`: The root React component.
-   `frontend/src/main.jsx`: The entry point of the application.

### Backend

The backend is a [Node.js](https://nodejs.org/) application using the [Express](https://expressjs.com/) framework.

**Code Structure:**
-   `backend/src/api`: Contains all the API modules. Each module is organized by feature.
    -   `*Controller.js`: Handles incoming requests, validates input, and calls the appropriate service.
    -   `*Router.js`: Defines the routes for the module.
    -   `*Service.js`: Contains the business logic for the module.
-   `backend/src/db`: Contains the database connection and initialization code.

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v20 or higher) and [Prisma ORM](https://www.prisma.io) for connecting to the database

### Local Development

You can run the frontend and backend services locally concurrently.

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
npm install
# Make sure your .env file is configured
npm run dev
```

## Backend Environment Variables

The following environment variables are required to run the backend application. These should be set in the `backend/.env` file.

| Variable | Description | 
| -------- | ----------- |
| `DATABASE_URL` | The connection string to your Prisma ORM. |
| `PORT` | The port your server will listen on. |

## Database Setup

This project uses a Prisma ORM for the database.

1. Get your connection string: [Quickstart: Prisma ORM with PostgreSQL | Prisma Documentation](https://www.prisma.io/docs/prisma-orm/quickstart/postgresql).
2. Set the `DATABASE_URL` in the `backend/.env` file.

### Initializing Tables

Once your `backend/.env` is configured with `DATABASE_URL`, run the following from the project root to create all the tables:

```bash
npx prisma generate
npx prisma migrate dev
```
   
