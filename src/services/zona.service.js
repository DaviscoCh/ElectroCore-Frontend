import api from './api';

export const verificarCobertura = (ciudad) => api.get(`/zonas/cobertura/${ciudad}`);
export const getZonas = () => api.get('/zonas');
export const getSucursales = () => api.get('/zonas/sucursales');