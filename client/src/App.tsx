import React, { useState, useEffect } from 'react';
import { tasksApi } from './api';
import type { Task, CreateTaskRequest } from './types';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';

/**
 * The main App component manages the task list, including loading, creating, updating, and deleting tasks.
 * It handles state for tasks, loading state, and errors, and renders the UI accordingly.
 *
 * @returns {JSX.Element} The rendered App component with task form and list.
 */
function App() {
  const [tasks, setTasks] = useState([]);  // State to hold the array of tasks
  const [loading, setLoading] = useState(true);  // State to indicate if data is being loaded
  const [error, setError] = useState(null);  // State to hold any error messages

  /**
   * useEffect hook to load tasks when the component mounts.
   * The empty dependency array ensures this runs only once on initial render.
   */
  useEffect(() => {
    loadTasks();
  }, []);

  /**
   * Asynchronously loads tasks from the API.
   * Sets loading state, fetches tasks, updates state on success, or sets an error on failure.
   */
  const loadTasks = async () => {
    try {
      setLoading(true);  // Set loading to true before fetching
      const fetchedTasks = await tasksApi.getAllTasks();  // Fetch tasks from API
      setTasks(fetchedTasks);  // Update tasks state with fetched data
      setError(null);  // Clear any previous error
    } catch (err) {
      setError('Failed to load tasks');  // Set error message on failure
      console.error('Error loading tasks:', err);  // Log error for debugging
    } finally {
      setLoading(false);  // Always set loading to false after attempt
    }
  };

  /**
   * Asynchronously handles creating a new task.
   * 
   * @param {CreateTaskRequest} taskData - The data for the new task to create.
   */
  const handleCreateTask = async (taskData) => {
    try {
      const newTask = await tasksApi.createTask(taskData);  // Create task via API
      setTasks(prev => [newTask, ...prev]);  // Add new task to the beginning of the tasks array
      setError(null);  // Clear any previous error
    } catch (err) {
      setError('Failed to create task');  // Set error message on failure
      console.error('Error creating task:', err);  // Log error for debugging
    }
  };

  /**
   * Asynchronously handles updating an existing task.
   * 
   * @param {string} id - The ID of the task to update.
   * @param {Partial<Task>} updates - The partial updates to apply to the task.
   */
  const handleUpdateTask = async (id, updates) => {
    try {
      const updatedTask = await tasksApi.updateTask(id, updates);  // Update task via API
      setTasks(prev => prev.map(task => task.id === id ? updatedTask : task));  // Update the specific task in state
      setError(null);  // Clear any previous error
    } catch (err) {
      setError('Failed to update task');  // Set error message on failure
      console.error('Error updating task:', err);  // Log error for debugging
    }
  };

  /**
   * Asynchronously handles deleting a task.
   * 
   * @param {string} id - The ID of the task to delete.
   */
  const handleDeleteTask = async (id) => {
    try {
      await tasksApi.deleteTask(id);  // Delete task via API
      setTasks(prev => prev.filter(task => task.id !== id));  // Remove the task from state
      setError(null);  // Clear any previous error
    } catch (err) {
      setError('Failed to delete task');  // Set error message on failure
      console.error('Error deleting task:', err);  // Log error for debugging
    }
  };

  /**
   * Handles toggling the completion status of a task by calling the update function.
   * 
   * @param {Task} task - The task object to toggle.
   */
  const handleToggleComplete = async (task) => {
    await handleUpdateTask(task.id, { completed: !task.completed });  // Toggle the completed status
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>  // Loading spinner element
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
          📝 Task Manager
        </h1>
        
        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Add New Task
            </h2>
            <TaskForm onSubmit={handleCreateTask} />
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Your Tasks ({tasks.length})
            </h2>
            <TaskList
              tasks={tasks}
              onToggleComplete={handleToggleComplete}
              onUpdateTask={handleUpdateTask}
              onDeleteTask={handleDeleteTask}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;