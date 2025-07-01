import axios from 'axios';

axios.defaults.baseURL = process.env.REACT_APP_API_BASE;
axios.defaults.withCredentials = true; // optional, remove if not using auth
