import api from './api';

export const getCarrito = () => api.get('/carrito');
export const agregarAlCarrito = (datos) => api.post('/carrito', datos);
export const actualizarCantidad = (id, cantidad) => api.put(`/carrito/${id}`, { cantidad });
export const eliminarDelCarrito = (id) => api.delete(`/carrito/${id}`);
export const vaciarCarrito = () => api.delete('/carrito');