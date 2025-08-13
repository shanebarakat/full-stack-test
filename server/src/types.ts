/**
 * Interface representing a task entity in the system.
 * This defines the structure for a task, including its properties such as ID, title, and status.
 */
export interface Task {
  id: string;  // Unique identifier for the task
  title: string;  // Title of the task
  description?: string;  // Optional description of the task
  completed: boolean;  // Indicates whether the task is completed
  /**
   * Priority level of the task, which can be one of the predefined values.
   * This union type ensures only specific string literals are used for consistency.
   */
  priority: 'low' | 'medium' | 'high';
  category: string;  // Category that the task belongs to
  createdAt: string;  // Timestamp when the task was created
  updatedAt: string;  // Timestamp when the task was last updated
}

/**
 * Interface representing the request body for creating a new task.
 * This includes required and optional fields for task creation.
 */
export interface CreateTaskRequest {
  title: string;  // Required title for the new task
  description?: string;  // Optional description for the new task
  priority?: 'low' | 'medium' | 'high';  // Optional priority level for the new task
  category?: string;  // Optional category for the new task
}

/**
 * Interface representing the request body for updating an existing task.
 * This allows partial updates to task properties.
 */
export interface UpdateTaskRequest {
  title?: string;  // Optional updated title for the task
  description?: string;  // Optional updated description for the task
  completed?: boolean;  // Optional updated completion status for the task
  priority?: 'low' | 'medium' | 'high';  // Optional updated priority level for the task
  category?: string;  // Optional updated category for the task
}