import axios from 'axios';

export interface Task {
  id: number;
  title: string;
  description: string;
  // ... 다른 필요한 필드들
}

export const getTasks = async (): Promise<Task[]> => {
  const response = await axios.get('http://localhost:3001/tasks');
  return response.data;
};

export const createTask = async (task: Omit<Task, 'id'>): Promise<Task> => {
  const response = await axios.post('http://localhost:3001/tasks', task);
  return response.data;
};

export const updateTask = async (id: number, task: Partial<Task>): Promise<Task> => {
  const response = await axios.patch(`http://localhost:3001/tasks/${id}`, task);
  return response.data;
};

export const deleteTask = async (id: number): Promise<void> => {
  await axios.delete(`http://localhost:3001/tasks/${id}`);
};