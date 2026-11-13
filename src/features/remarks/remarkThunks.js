// src/features/remarks/remarksThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

/* ============================================================
   EMPLOYEE — Submit a remark  (NO attendance_id)
============================================================ */
export const submitRemark = createAsyncThunk(
  "remarks/submitRemark",
  async (
    { attendance_date, new_clock_in, new_clock_out, remark_text },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.post("/api/remarks/create", {
        attendance_date,
        new_clock_in: new_clock_in || null,
        new_clock_out: new_clock_out || null,
        remark_text,
      });

      // assuming backend returns { remark: {...} }
      return res.data.remark;
    } catch (err) {
      console.error(err);
      return rejectWithValue(
        err?.response?.data?.message || "Failed to submit remark"
      );
    }
  }
);

/* ============================================================
   EMPLOYEE — Get my remarks
============================================================ */
export const fetchMyRemarks = createAsyncThunk(
  "remarks/fetchMyRemarks",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.post("/api/remarks/my");
      return res.data;
    } catch (err) {
      console.error(err);
      return rejectWithValue("Failed to fetch my remarks");
    }
  }
);

/* ============================================================
   ADMIN — Get pending remarks
============================================================ */
export const fetchPendingRemarks = createAsyncThunk(
  "remarks/fetchPendingRemarks",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.post("/api/remarks/pending");
      return res.data;
    } catch (err) {
      console.error(err);
      return rejectWithValue("Failed to fetch pending remarks");
    }
  }
);

/* ============================================================
   ADMIN — Accept remark
============================================================ */
export const acceptRemark = createAsyncThunk(
  "remarks/acceptRemark",
  async ({ remarkId, admin_response }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/api/remarks/accept/${remarkId}`, {
        admin_response,
      });
      return res.data.updated;
    } catch (err) {
      console.error(err);
      return rejectWithValue("Failed to accept remark");
    }
  }
);

/* ============================================================
   ADMIN — Reject remark
============================================================ */
export const rejectRemark = createAsyncThunk(
  "remarks/rejectRemark",
  async ({ remarkId, admin_response }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/api/remarks/reject/${remarkId}`, {
        admin_response,
      });
      return res.data.updated;
    } catch (err) {
      console.error(err);
      return rejectWithValue("Failed to reject remark");
    }
  }
);