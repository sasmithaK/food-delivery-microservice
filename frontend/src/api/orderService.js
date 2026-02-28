import api from './axios';

export const getAllOrders = () => api.get('/order-service/orders');
export const createOrder = (order) => api.post('/order-service/orders', order);
export const deleteOrder = (id) => api.delete(`/order-service/orders/${id}`);
