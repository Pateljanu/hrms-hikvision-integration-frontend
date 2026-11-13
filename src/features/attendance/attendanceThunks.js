import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

/* =======================
   🔹 Admin: Fetch all attendance
   ======================= */
export const fetchAttendance = createAsyncThunk(
  "attendance/fetchAll",
  async ({ from, to, employeeCode }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();

      if (from) params.append("from", from);
      if (to) params.append("to", to);
      if (employeeCode) params.append("employeeCode", employeeCode);

      const res = await api.post(`/api/attendance?${params.toString()}`);
      return res.data;
    } catch (err) {
      return rejectWithValue("Error fetching attendance");
    }
  }
);


/* =======================
   🔹 Employee: Fetch my attendance
   ======================= */
export const fetchMyAttendance = createAsyncThunk(
  "attendance/fetchMy",
  async ({ from, to }, { rejectWithValue }) => {
    try {
      const res = await api.post(`/api/attendance/my?from=${from}&to=${to}`);
      console.log("✅ Fetched My Attendance:", res.data);
      return res.data;
    } catch (err) {
      console.error("❌ Error fetching my attendance:", err.response?.data);
      return rejectWithValue(
        err.response?.data?.message || "Error fetching your attendance"
      );
    }
  }
);

/* =======================
   🔹 Admin: Fetch summary by date
   ======================= */
export const fetchAttendanceSummary = createAsyncThunk(
  "attendance/fetchSummary",
  async (date, { rejectWithValue }) => {
    try {
      const res = await api.get(`/api/attendance/summary?date=${date}`);
      console.log("✅ Fetched Summary:", res.data);
      return res.data;
    } catch (err) {
      console.error("❌ Error fetching summary:", err.response?.data);
      return rejectWithValue(
        err.response?.data?.message || "Error fetching summary"
      );
    }
  }
);
