import { deleteCookie, getCookie, setCookie } from '@/lib/utils/cookie';
import axios from 'axios';

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL, 
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  const token = await getCookie('authToken');
  console.log(token)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

export interface IAuthData { 
  username?: string, 
  email: string,
  password: string, 
  confirmPassword?: string
}

export const authApi = {
  login: async (data: IAuthData) => {
    const response = await api.post('/api/v1/auth/login', data);
    setCookie('authToken', response.data.data.token);
    return response.data;
  },
  signup: async (data: IAuthData) => {
    const response = await api.post('/api/v1/auth/signup', data);
    return response.data;
  },
  logout: async() => {
    deleteCookie('authToken');
    return true;
  }
};

export interface ITaskData { 
  _id?: string;
  title: string, 
  description: string, 
  category: string, 
  priority?: string, 
  status?: string 
}

export interface ITaskFilters { 
  title?: string; 
  status?: string; 
  category?: string; 
  priority?: string; 
  page?: number,
  limit?: number
}

export const tasksApi = {
  createTask: async (data: ITaskData) => {
    const response = await api.post('/api/v1/tasks', data);
    return response.data;
  },
  getTasks: async (filters: ITaskFilters) => {
    const response = await api.get(`/api/v1/tasks`, { params: filters });
    return response.data;
  },
  getTask: async (taskId: string) => {
    const response = await api.get(`/api/v1/tasks/${taskId}`);
    return response.data;
  },
  updateTask: async (taskId: string, data: ITaskData) => {
    const response = await api.put(`/api/v1/tasks/${taskId}`, data);
    return response.data;
  },
  deleteTask: async (taskId: string) => {
    await api.delete(`/api/v1/tasks/${taskId}`);
    return true;
  }
};
