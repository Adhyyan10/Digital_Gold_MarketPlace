import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:9090/api',
    withCredentials: true, // Important for OAuth2 session cookies
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
