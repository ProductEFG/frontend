import axios from "axios";
import Cookies from "js-cookie";

const apiClient = axios.create({
  baseURL: `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = Cookies.get("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
