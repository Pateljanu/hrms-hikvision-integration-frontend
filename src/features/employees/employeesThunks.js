import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

// ✅ GET all employees
export const fetchEmployees = createAsyncThunk(
  "employees/fetchEmployees",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.post("/api/employees/all-employees");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error fetching employees");
    }
  }
);

// ✅ ADD or UPDATE employee (Admin only)
export const saveEmployee = createAsyncThunk(
  "employees/saveEmployee",
  async (employee, { rejectWithValue }) => {
    try {
      const res = await api.post("/api/employees", employee);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error saving employee");
    }
  }
);

// ✅ DELETE employee
export const deleteEmployee = createAsyncThunk(
  "employees/deleteEmployee",
  async (employee_code, { rejectWithValue }) => {
    try {
      await api.delete(`/api/employees/${employee_code}`);
      return employee_code;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error deleting employee");
    }
  }
);

// ✅ ADMIN — SEND PASSWORD SETUP LINK TO EMPLOYEE EMAIL
export const sendPasswordLink = createAsyncThunk(
  "employees/sendPasswordLink",
  async (employee_code, { rejectWithValue }) => {
    try {
      const res = await api.post("/api/employees/send-password-link", {
        employee_code
      });
      return res.data.message;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Error sending password setup link"
      );
    }
  }
);

// ✅ EMPLOYEE — SET PASSWORD USING TOKEN FROM EMAIL
export const setPasswordWithToken = createAsyncThunk(
  "employees/setPasswordWithToken",
  async ({ token, newPassword }, { rejectWithValue }) => {
    try {
      const res = await api.post("/api/employees/set-password", {
        token,
        newPassword,
      });
      return res.data.message;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Error setting new password"
      );
    }
  }
);
