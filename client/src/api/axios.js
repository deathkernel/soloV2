import axios from "axios";

// Production: Use environment variable
// Development: Use local proxy
const baseURL = import.meta.env.VITE_API_URL || "/api";

const instance = axios.create({ baseURL });

instance.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;