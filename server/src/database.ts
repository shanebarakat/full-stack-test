import sqlite3 from 'sqlite3';
import { Task, CreateTaskRequest, UpdateTaskRequest } from './types';
import { v4 as uuidv4 } from 'uuid';

class Database {
  private db: sqlite3.Database;

  constructor() {
    this.db = new sqlite3.Database('./tasks.db');
    this.init();
  }

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

    this.db.run(createTable, (err) => {
      if (err) {
        console.error('Error creating table:', err);
      } else {
        console.log('Database initialized successfully');
      }
    });
  }

  getAllTasks(): Promise<Task[]> {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM tasks ORDER BY created_at DESC';
      this.db.all(query, (err, rows: any[]) => {
        if (err) {
          reject(err);
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
          resolve(tasks);
        }
      });
    });
  }

  createTask(taskData: CreateTaskRequest): Promise<Task> {
    return new Promise((resolve, reject) => {
      const id = uuidv4();
      const now = new Date().toISOString();
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
      `;

      this.db.run(
        query,
        [task.id, task.title, task.description, task.completed, task.priority, task.category, task.createdAt, task.updatedAt],
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve(task);
          }
        }
      );
    });
  }

  updateTask(id: string, updates: UpdateTaskRequest): Promise<Task | null> {
    return new Promise((resolve, reject) => {
      const now = new Date().toISOString();
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

      const query = `UPDATE tasks SET ${setClause.join(', ')} WHERE id = ?`;

      this.db.run(query, values, function(err) {
        if (err) {
          reject(err);
        } else if (this.changes === 0) {
          resolve(null);
        } else {
          // Get the updated task
          db.getTaskById(id).then(resolve).catch(reject);
        }
      });
    });
  }

  getTaskById(id: string): Promise<Task | null> {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM tasks WHERE id = ?';
      this.db.get(query, [id], (err, row: any) => {
        if (err) {
          reject(err);
        } else if (!row) {
          resolve(null);
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
          resolve(task);
        }
      });
    });
  }

  deleteTask(id: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const query = 'DELETE FROM tasks WHERE id = ?';
      this.db.run(query, [id], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.changes > 0);
        }
      });
    });
  }
}

const db = new Database();
export default db;
