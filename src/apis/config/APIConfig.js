import axios from 'axios';

// Cấu hình base URL cho API
// Backend chạy trên http://localhost:5246 (HTTP) hoặc https://localhost:7066 (HTTPS)
const API_BASE_URL = 'http://localhost:5246/api/v1';

// Tạo instance axios với config mặc định
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Interceptor để xử lý response
api.interceptors.response.use(
    response => response,
    error => {
        // Xử lý lỗi tập trung ở đây
        console.error('API Error:', error);
        return Promise.reject(error);
    }
);

export default api;
