import axios from 'axios';

axios.defaults.baseURL = process.env.REACT_APP_API_URL || '/api';
axios.defaults.headers.post['Content-Type'] = 'multipart/form-data';
axios.defaults.withCredentials = true;

export const axiosReq = axios.create();
export const axiosRes = axios.create();
