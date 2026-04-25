import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Don't retry if the request was to login or refresh already
    if (
      error.response?.status === 401 && 
      !originalRequest._retry && 
      !originalRequest.url.includes('/auth/login') && 
      !originalRequest.url.includes('/auth/refresh')
    ) {
      originalRequest._retry = true;

      try {
        const response = await axios.post('/api/auth/refresh', {}, { withCredentials: true });
        const { accessToken } = response.data;
        
        // Update the global auth header for future requests
        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        
        // Update the retried request's header
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
        
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, we don't necessarily want a hard redirect to /login
        // because it causes full page reloads. Let the AuthContext handle it.
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
