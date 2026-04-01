import api from './api';

export const getProductos = (params) => api.get('/productos', { params });
export const getProducto = (slug) => api.get(`/productos/${slug}`);
export const getCategorias = () => api.get('/categorias');
export const getMarcas = () => api.get('/marcas');