
import axios from 'axios';
import { Task, Board, Column, TaskLabel } from '../contexts/TaskContext';

const API_URL = 'http://localhost:5000/api';

// Configure axios with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API functions for tasks
export const fetchTasks = async (userId: string) => {
  const response = await api.get(`/tasks/${userId}`);
  return response.data;
};

export const createTask = async (
  userId: string,
  title: string,
  description: string,
  labels: TaskLabel[],
  columnId: string
) => {
  const response = await api.post('/tasks', {
    userId,
    title,
    description,
    labels,
    columnId,
  });
  return response.data;
};

export const updateTaskAPI = async (
  taskId: string,
  updates: Partial<Task>
) => {
  const response = await api.put(`/tasks/${taskId}`, updates);
  return response.data;
};

export const deleteTaskAPI = async (taskId: string) => {
  const response = await api.delete(`/tasks/${taskId}`);
  return response.data;
};

// API functions for board
export const fetchBoard = async (userId: string) => {
  const response = await api.get(`/board/${userId}`);
  return response.data;
};

export const updateBoard = async (userId: string, board: Partial<Board>) => {
  const response = await api.put(`/board/${userId}`, { board });
  return response.data;
};

export default api;
