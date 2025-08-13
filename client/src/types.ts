/**
 * Interface representing a task in the system.
 * This defines the structure for a task entity, including its unique identifier,
 * title, optional description, completion status, priority level, category,
 * and timestamps for creation and last update.
 */
export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  /**
   * Priority level of the task, which can be one of the following string literals:
   * 'low', 'medium', or 'high'. This union type ensures only valid priorities are used.
   */
  priority: 'low' | 'medium' | 'high';
  category: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Interface for the request body when creating a new task.
 * This includes the required title and optional fields for description,
 * priority, and category.
 */
export interface CreateTaskRequest {
  title: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  category?: string;
}

/**
 * Interface for the request body when updating an existing task.
 * This allows partial updates, with optional fields for title, description,
 * completion status, priority, and category.
 */
export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  completed?: boolean;
  priority?: 'low' | 'medium' | 'high';
  category?: string;
}