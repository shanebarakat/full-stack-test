import express from 'express';
import cors from 'cors';
import db from './database';
import { CreateTaskRequest, UpdateTaskRequest } from './types';

// Create the Express application
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware setup for handling cross-origin requests and JSON parsing
// CORS is enabled to allow requests from different domains
app.use(cors());
// Express JSON middleware parses incoming request bodies in JSON format
app.use(express.json());

// Create a router for task-related routes to separate concerns from main app setup
const taskRouter = express.Router();

/**
 * Handles GET request to retrieve all tasks from the database.
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 */
async function getTasks(req, res) {
  try {
    const tasks = await db.getAllTasks();
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
}

/**
 * Handles POST request to create a new task.
 * @param {Object} req - The Express request object containing the task data in req.body.
 * @param {Object} res - The Express response object.
 */
async function createTask(req, res) {
  try {
    const taskData: CreateTaskRequest = req.body;
    
    if (!taskData.title || taskData.title.trim() === '') {
      return res.status(400).json({ error: 'Title is required' });
    }

    const task = await db.createTask(taskData);
    res.status(201).json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
}

/**
 * Handles PUT request to update an existing task by ID.
 * @param {Object} req - The Express request object with task ID in req.params and updates in req.body.
 * @param {Object} res - The Express response object.
 */
async function updateTask(req, res) {
  try {
    const { id } = req.params;
    const updates: UpdateTaskRequest = req.body;
    
    const task = await db.updateTask(id, updates);
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    res.json(task);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
}

/**
 * Handles DELETE request to remove a task by ID.
 * @param {Object} req - The Express request object with task ID in req.params.
 * @param {Object} res - The Express response object.
 */
async function deleteTask(req, res) {
  try {
    const { id } = req.params;
    const deleted = await db.deleteTask(id);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
}

// Mount the task routes under /api to separate API endpoints from other potential routes
taskRouter.get('/tasks', getTasks);
taskRouter.post('/tasks', createTask);
taskRouter.put('/tasks/:id', updateTask);
taskRouter.delete('/tasks/:id', deleteTask);
app.use('/api', taskRouter);

// Start the server and listen on the specified port
// This is the entry point for the server to begin accepting requests
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});