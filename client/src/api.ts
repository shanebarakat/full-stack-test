import axios from 'axios';
import type { Task, CreateTaskRequest, UpdateTaskRequest } from './types';

const API_BASE_URL = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const tasksApi = {
  getAllTasks: async (): Promise<Task[]> => {
    const response = await api.get('/tasks');
    return response.data;
  },

  createTask: async (task: CreateTaskRequest): Promise<Task> => {
    const response = await api.post('/tasks', task);
    return response.data;
  },

  updateTask: async (id: string, updates: UpdateTaskRequest): Promise<Task> => {
    const response = await api.put(`/tasks/${id}`, updates);
    return response.data;
  },

  deleteTask: async (id: string): Promise<void> => {
    await api.delete(`/tasks/${id}`);
  },
};
