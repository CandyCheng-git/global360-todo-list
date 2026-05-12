# Global360 TODO List App

Simple TODO list application built with Angular and .NET Web API for the Global360 technical assessment.

## Tech Stack

- Angular
- .NET Web API
- In-memory backend storage
- Docker / Docker Compose
- Backend and frontend tests

## Features

- View TODO list
- Add TODO item
- Delete TODO item
- Backend validation
- Basic error handling

## Run with Docker

docker compose up --build

## Backend

Run the API from the backend folder:

```powershell
cd backend
dotnet run --project Todo.Api
```

The API exposes:

- `GET /api/todos`
- `POST /api/todos`
- `DELETE /api/todos/{id}`

Swagger UI is available in Development at `/swagger`.

Run backend tests:

```powershell
cd backend
dotnet test
```

## Notes

Data is stored in memory as requested. Restarting the backend will reset the TODO list.
