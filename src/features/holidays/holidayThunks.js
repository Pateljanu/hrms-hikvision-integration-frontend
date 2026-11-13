import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api"; // ✅ your axios instance

// 🔹 Get All Holidays
export const fetchHolidays = createAsyncThunk(
  "holidays/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.post("/api/holidays/all-holiday");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// 🔹 Add Holiday
export const addHoliday = createAsyncThunk(
  "holidays/add",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await api.post("/api/holidays", payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// 🔹 Delete Holiday
export const deleteHoliday = createAsyncThunk(
  "holidays/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/api/holidays/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);
