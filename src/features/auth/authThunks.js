// src/features/auth/authThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

// --- LOGIN THUNK (Already working) ---
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ employee_code, password, navigate }, { rejectWithValue }) => {
    try {
      const res = await api.post("/api/employees/login", { employee_code, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.employee));
      navigate(res.data.employee.role === "admin" ? "/dashboard" : "/my-attendance");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);

// --- LOGOUT THUNK (Add this) ---
export const logoutUser = createAsyncThunk("auth/logoutUser", async (_, { dispatch }) => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  return true; // you can return something if reducer needs it
});
