import axios from 'axios';

// Real device ke liye apna WiFi IP daal
const BASE_URL = 'http://192.168.29.170:5000/api'; // ← APNA IP YAHAN DAAL

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.error ||
      error.message ||
      'Something went wrong';
    console.error('[API Error]', message);
    return Promise.reject(new Error(message));
  }
);

export const getAvailablePartners = (city) =>
  apiClient.get(`/partners/${encodeURIComponent(city)}`);

export const bookSlot = (userId, city, slotTime) =>
  apiClient.post('/book', { userId, city, slotTime });

export const cancelBooking = (bookingId) =>
  apiClient.post('/cancel', { bookingId });

export const getBooking = (bookingId) =>
  apiClient.get(`/booking/${bookingId}`);

export default apiClient;