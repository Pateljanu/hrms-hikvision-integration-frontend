import axios from "axios";
import { toast } from "sonner";
import { store } from "../app/store";
import { clearAuth } from "../features/auth/authSlice";

// ⭐ Use Render backend URL if deployed, otherwise use localhost
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
});

// Attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle errors globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;
    const msg = err?.response?.data?.message || "Server Error";

    // 🚨 AUTO LOGOUT on INVALID TOKEN or EXPIRED TOKEN
    if (status === 401) {
      toast.error("Session expired. Please login again.");

      // Clear auth state in Redux
      store.dispatch(clearAuth());

      // redirect to login
      window.location.href = "/login";
      return Promise.reject(err);
    }

    // Other errors
    toast.error(msg);
    return Promise.reject(err);
  }
);

export default api;
