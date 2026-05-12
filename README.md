# Global360 TODO List

Simple full-stack TODO list application built for a technical assessment. The app keeps the scope intentionally small: view, add, and delete TODO items.

## Tech Stack

- Angular standalone components
- .NET Web API
- In-memory backend storage
- Docker and Docker Compose
- xUnit backend tests and Angular frontend tests

## Features

- View TODO items
- Add a TODO item with validation
- Delete a TODO item
- Loading and user-friendly error states
- Swagger API documentation

TODO data is stored in memory and resets when the backend restarts.

## Run with Docker

```powershell
docker compose up --build
```

- Frontend: http://localhost:4200
- Backend API: http://localhost:5000
- Swagger: http://localhost:5000/swagger

## Run Backend Locally

```powershell
cd backend
dotnet run --project Todo.Api
```

## Run Frontend Locally

```powershell
cd frontend
npm install
npm start -- --host 0.0.0.0
```

## Tests

Backend:

```powershell
cd backend
dotnet test
```

Frontend:

```powershell
cd frontend
npm test -- --watch=false
```
