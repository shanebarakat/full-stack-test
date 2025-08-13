/**
 * This module provides API functions for managing tasks, including retrieving, creating, updating, and deleting tasks.
 * Exported functions: getAllTasks, createTask, updateTask, deleteTask.
 */

import axios from 'axios';
import type { Task, CreateTaskRequest, UpdateTaskRequest } from './types';

const API_BASE_URL = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const tasksApi = {
  /**
   * Retrieves all tasks from the API.
   *
   * @returns {Promise<Task[]>} A promise that resolves to an array of Task objects.
   */
  getAllTasks: async (): Promise<Task[]> => {
    // Make a GET request to the /tasks endpoint
    const response = await api.get('/tasks');
    return response.data;
  },

  /**
   * Creates a new task using the provided task data.
   *
   * @param {CreateTaskRequest} task - The task data to create.
   * @returns {Promise<Task>} A promise that resolves to the created Task object.
   */
  createTask: async (task: CreateTaskRequest): Promise<Task> => {
    // Make a POST request to the /tasks endpoint with the task data
    const response = await api.post('/tasks', task);
    return response.data;
  },

  /**
   * Updates an existing task with the provided updates.
   *
   * @param {string} id - The ID of the task to update.
   * @param {UpdateTaskRequest} updates - The updates to apply to the task.
   * @returns {Promise<Task>} A promise that resolves to the updated Task object.
   */
  updateTask: async (id: string, updates: UpdateTaskRequest): Promise<Task> => {
    // Make a PUT request to the /tasks/{id} endpoint with the updates
    const response = await api.put(`/tasks/${id}`, updates);
    return response.data;
  },

  /**
   * Deletes a task by its ID.
   *
   * @param {string} id - The ID of the task to delete.
   * @returns {Promise<void>} A promise that resolves when the deletion is complete.
   */
  deleteTask: async (id: string): Promise<void> => {
    // Make a DELETE request to the /tasks/{id} endpoint
    await api.delete(`/tasks/${id}`);
  },
};