import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

// ============================================================
// 1️⃣ SAVE / UPDATE COMPANY SETTING
// ============================================================
export const saveCompanySetting = createAsyncThunk(
  "companySettings/saveCompanySetting",
  async (payload, { rejectWithValue }) => {
    try {
      // 🔥 Ensure weekend_days is ALWAYS array
      const cleanPayload = {
        ...payload,
        required_hours: Number(payload.required_hours),
        weekend_days: Array.isArray(payload.weekend_days)
          ? payload.weekend_days
          : String(payload.weekend_days)
              .split(",")
              .map((d) => d.trim())
              .filter((x) => x),
      };

      console.log("📤 Sending Payload:", cleanPayload);

      const res = await api.post("/api/company-settings", cleanPayload);

      return res.data;
    } catch (err) {
      console.error("❌ API Error:", err.response?.data || err.message);
      return rejectWithValue(err.response?.data || { message: "Server error" });
    }
  }
);

// ============================================================
// 2️⃣ FETCH ALL SETTINGS
// ============================================================
export const fetchAllSettings = createAsyncThunk(
  "companySettings/fetchAllSettings",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.post("/api/company-settings/all-settings");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ============================================================
// 3️⃣ FETCH SETTING BY DATE
// ============================================================
export const fetchSettingByDate = createAsyncThunk(
  "companySettings/fetchSettingByDate",
  async (date, { rejectWithValue }) => {
    try {
      const res = await api.post(`/api/company-settings/by-date?date=${date}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);
