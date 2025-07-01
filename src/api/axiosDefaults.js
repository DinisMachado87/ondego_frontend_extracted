import axios from 'axios';
import { setAuthHeader } from '../utils/jwtUtils';

axios.defaults.baseURL = process.env.REACT_APP_API_URL;
axios.defaults.headers.post['Content-Type'] = 'application/json';

// Set up axios instances with JWT authentication
export const axiosReq = axios.create();
export const axiosRes = axios.create();

// Set initial auth header
setAuthHeader(axiosReq);
setAuthHeader(axiosRes);
