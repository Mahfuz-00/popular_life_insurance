import axios from 'axios';
const BASE_URL = 'http://localhost:3500';

export default axios.create({
    timeout: 5000,
});

export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' }
});