# Full Stack Task Manager

A modern task management application built with React and Node.js.

## Features

- ✅ Create, read, update, and delete tasks
- 🏷️ Task categories and priorities
- 📱 Responsive design
- ⚡ Real-time updates
- 🎨 Clean, modern UI with Tailwind CSS

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for fast development
- Tailwind CSS for styling
- Axios for API calls

### Backend
- Node.js with Express
- TypeScript
- SQLite database
- CORS enabled

## Quick Start

1. Install all dependencies:
```bash
npm run install:all
```

2. Start development servers:
```bash
npm run dev
```

This will start:
- Backend server on http://localhost:3001
- Frontend server on http://localhost:5173

## Project Structure

```
├── client/          # React frontend
├── server/          # Express backend
└── README.md
```

## API Endpoints

- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task
