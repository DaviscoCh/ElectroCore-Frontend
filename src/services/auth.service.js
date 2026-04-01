import api from './api';

export const login = (datos) => api.post('/auth/login', datos);
export const register = (datos) => api.post('/auth/register', datos);
export const getMe = () => api.get('/auth/me');