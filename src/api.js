import axios from "axios";

const API = axios.create({ baseURL: process.env.REACT_APP_PATH })
API.interceptors.request.use((config) => ({ ...config, headers: { ...config.headers, 'Content-Type': 'application/json' } }))
API.interceptors.response.use((value) => value.data)
export default API