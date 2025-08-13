import sqlite3 from 'sqlite3';
import { Task, CreateTaskRequest, UpdateTaskRequest } from './types';
import { v4 as uuidv4 } from 'uuid';

class Database {
  private db: sqlite3.Database;

  constructor() {
    this.db = new sqlite3.Database('./tasks.db');
    this.init();  // Initialize the database connection and schema
  }

  /**
   * Initializes the database by creating the tasks table if it doesn't exist.
   * This method sets up the schema for storing task data.
   */
  private init() {
    const createTable = `
      CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        completed BOOLEAN DEFAULT 0,
        priority TEXT DEFAULT 'medium',
        category TEXT DEFAULT 'general',
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )
    `;

    // Execute the SQL query to create the table
    this.db.run(createTable, (err) => {
      if (err) {
        console.error('Error creating table:', err);  // Handle error in table creation
      } else {
        console.log('Database initialized successfully');  // Log successful initialization
      }
    });
  }

  /**
   * Retrieves all tasks from the database, ordered by creation date descending.
   *
   * @returns {Promise<Task[]>} A promise that resolves to an array of Task objects.
   */
  getAllTasks(): Promise<Task[]> {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM tasks ORDER BY created_at DESC';  // SQL query to select all tasks
      this.db.all(query, (err, rows: any[]) => {  // Execute SELECT query
        if (err) {
          reject(err);  // Reject promise if query fails
        } else {
          const tasks = rows.map(row => ({
            id: row.id,
            title: row.title,
            description: row.description,
            completed: Boolean(row.completed),
            priority: row.priority,
            category: row.category,
            createdAt: row.created_at,
            updatedAt: row.updated_at
          }));
          resolve(tasks);  // Resolve with the mapped tasks
        }
      });
    });
  }

  /**
   * Creates a new task in the database.
   *
   * @param {CreateTaskRequest} taskData - The data for the new task.
   * @returns {Promise<Task>} A promise that resolves to the created Task object.
   */
  createTask(taskData: CreateTaskRequest): Promise<Task> {
    return new Promise((resolve, reject) => {
      const id = uuidv4();  // Generate a unique ID for the new task
      const now = new Date().toISOString();  // Get current timestamp
      const task = {
        id,
        title: taskData.title,
        description: taskData.description || '',
        completed: false,
        priority: taskData.priority || 'medium',
        category: taskData.category || 'general',
        createdAt: now,
        updatedAt: now
      };

      const query = `
        INSERT INTO tasks (id, title, description, completed, priority, category, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;  // SQL query to insert a new task

      this.db.run(  // Execute INSERT query
        query,
        [task.id, task.title, task.description, task.completed, task.priority, task.category, task.createdAt, task.updatedAt],
        function(err) {
          if (err) {
            reject(err);  // Reject promise if insertion fails
          } else {
            resolve(task);  // Resolve with the new task object
          }
        }
      );
    });
  }

  /**
   * Updates an existing task in the database.
   *
   * @param {string} id - The ID of the task to update.
   * @param {UpdateTaskRequest} updates - The fields to update.
   * @returns {Promise<Task | null>} A promise that resolves to the updated Task object or null if not found.
   */
  updateTask(id: string, updates: UpdateTaskRequest): Promise<Task | null> {
    return new Promise((resolve, reject) => {
      const now = new Date().toISOString();  // Get current timestamp for updated_at
      const setClause = [];
      const values = [];

      if (updates.title !== undefined) {
        setClause.push('title = ?');
        values.push(updates.title);
      }
      if (updates.description !== undefined) {
        setClause.push('description = ?');
        values.push(updates.description);
      }
      if (updates.completed !== undefined) {
        setClause.push('completed = ?');
        values.push(updates.completed);
      }
      if (updates.priority !== undefined) {
        setClause.push('priority = ?');
        values.push(updates.priority);
      }
      if (updates.category !== undefined) {
        setClause.push('category = ?');
        values.push(updates.category);
      }

      setClause.push('updated_at = ?');
      values.push(now);
      values.push(id);

      const query = `UPDATE tasks SET ${setClause.join(', ')} WHERE id = ?`;  // SQL query to update task

      this.db.run(query, values, function(err) {  // Execute UPDATE query
        if (err) {
          reject(err);  // Reject promise if update fails
        } else if (this.changes === 0) {
          resolve(null);  // Resolve with null if no rows affected
        } else {
          // Fetch the updated task
          db.getTaskById(id).then(resolve).catch(reject);  // Call to retrieve updated task
        }
      });
    });
  }

  /**
   * Retrieves a task by its ID from the database.
   *
   * @param {string} id - The ID of the task to retrieve.
   * @returns {Promise<Task | null>} A promise that resolves to the Task object or null if not found.
   */
  getTaskById(id: string): Promise<Task | null> {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM tasks WHERE id = ?';  // SQL query to select task by ID
      this.db.get(query, [id], (err, row: any) => {  // Execute SELECT query
        if (err) {
          reject(err);  // Reject promise if query fails
        } else if (!row) {
          resolve(null);  // Resolve with null if task not found
        } else {
          const task = {
            id: row.id,
            title: row.title,
            description: row.description,
            completed: Boolean(row.completed),
            priority: row.priority,
            category: row.category,
            createdAt: row.created_at,
            updatedAt: row.updated_at
          };
          resolve(task);  // Resolve with the task object
        }
      });
    });
  }

  /**
   * Deletes a task from the database by its ID.
   *
   * @param {string} id - The ID of the task to delete.
   * @returns {Promise<boolean>} A promise that resolves to true if deleted, false otherwise.
   */
  deleteTask(id: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const query = 'DELETE FROM tasks WHERE id = ?';  // SQL query to delete task by ID
      this.db.run(query, [id], function(err) {  // Execute DELETE query
        if (err) {
          reject(err);  // Reject promise if deletion fails
        } else {
          resolve(this.changes > 0);  // Resolve with true if rows were deleted
        }
      });
    });
  }
}

const db = new Database();
export default db;