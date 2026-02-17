import axios from "axios";

const instance = axios.create({
  baseURL: "/api",  // Vite proxy handle karega — no hardcoded IP needed
});

instance.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;