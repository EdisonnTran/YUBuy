# YUBuy
A York University campus marketplace for students to buy and sell used textbooks, furniture, electronics, and other student essentials.

## Table of Contents
- Project Structure
- Getting Started
- Database Setup
- Data Lake Setup

## Project Structure
The project is a monorepo containing the frontend and backend of the YUBuy application

### Frontend

The frontend is a React application built with [Vite](https://vitejs.dev/).

**Code Structure:**
-   `frontend/src/assets`: Contains static assets like CSS and images.
-   `frontend/src/pages`: Contains React pages.
-   `frontend/src/components`: Contains reusable React components
-   `frontend/src/App.jsx`: The root React component.
-   `frontend/src/main.jsx`: The entry point of the application.
-   `frontend/src/test`: Contains test cases for frontend pages.

### Backend

The backend is a [Node.js](https://nodejs.org/) application using the [Express](https://expressjs.com/) framework.

**Code Structure:**
-   `backend/src/api`: Contains all the API modules. Each module is organized by feature.
    -   `*Controller.js`: Handles incoming requests, validates input, and calls the appropriate service.
    -   `*Router.js`: Defines the routes for the module.
    -   `*Service.js`: Contains the business logic for the module.
-   `backend/src/db`: Contains the database connection and initialization code.
-   `backend/tests`: Contains unit and integration tests for backend endpoints.

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v20 or higher) and [Prisma ORM](https://www.prisma.io) for connecting to the database

### Local Development

You can run the frontend and backend services locally concurrently.

#### Frontend
```bash
cd frontend
npm install
npm run build
```

### Backend
```bash
cd backend
npm install
# Make sure your .env file is configured
node src/server.js
```

## Backend Environment Variables

The following environment variables are required to run the backend application. These should be set in the `backend/.env` file.

| Variable | Description | 
| -------- | ----------- |
| `DATABASE_URL` | The connection string to your Prisma ORM. |
| `FRONTEND_URL` | The frontend URL that requests will be coming from |
| `SESSION_SECRET` | A session secret key (can be any value) |
| `AZURE_STORAGE_CONNECTION_STRING` | The connection string to your Azure storage account for ADLS |
| `EMAIL_USER` | yubuy.noreply@gmail.com |
| `GMAIL_CLIENT_ID` | Gmail client access ID for Oauth2 API |
| `GMAIL_CLIENT_SECRET` | The client secret for the Gmail access ID for Oauth2 API |
| `GMAIL_REFRESH_TOKEN` | The refresh token required for Oauth2 API |

## Frontend Environment Variables

The following environment variable is required to run the frontend application. This should be set in the `frontend/.env` file.

| Variable | Description | 
| -------- | ----------- |
| `VITE_API_BASE_URL` | http://localhost:8080 |

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

## Data Lake Setup

This project uses an Azure ADLS Gen2 instance to host the data lake.
1. Create an Azure storage account.
    - **IMPORTANT:** When creating your storage account, in the advanced settings, enable "Hierarchical namespace".
2. Inside of the storage account, create a container named "raw".
3. Under `Access Keys`, retrieve your `Connection string (Key 1)` and paste it under `AZURE_STORAGE_CONNECTION_STRING` in the `backend/.env` file.
