import api from './api';

export const crearPedido = (datos) => api.post('/pedidos', datos);
export const getMisPedidos = () => api.get('/pedidos');
export const getDetallePedido = (id) => api.get(`/pedidos/${id}`);