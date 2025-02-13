# Task Management API

A RESTful API built with Node.js, Express, and PostgreSQL for managing tasks. This API allows users to create, read, update, delete, and search tasks with features like due dates and completion status.

## Features

- Create new tasks with title, description, and due date
- List all tasks with their current status
- Update existing tasks
- Mark tasks as complete
- Delete tasks
- Search tasks by title or description
- Automatic status calculation (Pending, Due Today, Overdue, Completed)

## Prerequisites

- Node.js (v12 or higher)
- PostgreSQL database
- npm or yarn package manager

## Installation

1. Clone the repository:

git clone <repository-url>
cd <project-directory>

2. Install dependencies:

npm install

3. Create a `.env` file in the root directory with the following variables:

```env
PORT=3001
DB_USER=your_db_user
DB_HOST=your_db_host
DB_NAME=your_db_name
DB_PASSWORD=your_db_password
DB_PORT=5432
NODE_ENV=development
```

4. Create the tasks table in your PostgreSQL database:

```sql
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    due_date TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/tasks` | Create a new task |
| GET | `/tasks` | Get all tasks |
| GET | `/tasks/search?query=searchterm` | Search tasks |
| PUT | `/tasks/:id` | Update a task |
| PUT | `/tasks/:id/complete` | Mark a task as complete |
| DELETE | `/tasks/:id` | Delete a task |

### Request Body Examples

Create/Update Task:
```json
{
    "title": "Task Title",
    "description": "Task Description",
    "due_date": "2024-03-20T00:00:00.000Z"
}
```

## Task Status Logic

Tasks automatically calculate their status based on the following rules:
- **Completed**: Task has been marked as complete
- **Overdue**: Due date is before current date
- **Due Today**: Due date is today
- **Pending**: Due date is in the future

## Error Handling

The API includes comprehensive error handling:
- 400: Bad Request (e.g., missing required fields)
- 404: Resource Not Found
- 500: Internal Server Error

## Development

To start the server in development mode:
```bash
npm run dev
```

The server will start on the port specified in your `.env` file (default: 3001).

## Project Structure

```
src/
├── app.js              # Express app setup
├── controllers/        # Request handlers
├── routes/            # API routes
└── services/          # Business logic and database operations
```

## Dependencies

- express: Web framework
- pg: PostgreSQL client
- dotenv: Environment variable management

