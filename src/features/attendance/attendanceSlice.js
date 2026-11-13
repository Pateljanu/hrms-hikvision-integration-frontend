import { createSlice } from "@reduxjs/toolkit";
import {
  fetchAttendance,
  fetchMyAttendance,
  fetchAttendanceSummary,
} from "./attendanceThunks";

const initialState = {
  list: [],
  myList: [],
  summary: [],
  loadingList: false,
  loadingMyList: false,
  loadingSummary: false,
  error: null,
};

const attendanceSlice = createSlice({
  name: "attendance",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      /* ---------- Admin: All Attendance ---------- */
      .addCase(fetchAttendance.pending, (state) => {
        state.loadingList = true;
        state.error = null;
        
      })
      .addCase(fetchAttendance.fulfilled, (state, action) => {
        state.loadingList = false;
        state.list = action.payload;
      })
      .addCase(fetchAttendance.rejected, (state, action) => {
        state.loadingList = false;
        state.error = action.payload;
      })

      /* ---------- Employee: My Attendance ---------- */
      .addCase(fetchMyAttendance.pending, (state) => {
        state.loadingMyList = true;
        state.error = null;
      })
      .addCase(fetchMyAttendance.fulfilled, (state, action) => {
        state.loadingMyList = false;
        state.myList = action.payload;
      })
      .addCase(fetchMyAttendance.rejected, (state, action) => {
        state.loadingMyList = false;
        state.error = action.payload;
      })

      /* ---------- Admin: Daily Summary ---------- */
      .addCase(fetchAttendanceSummary.pending, (state) => {
        state.loadingSummary = true;
        state.error = null;
      })
      .addCase(fetchAttendanceSummary.fulfilled, (state, action) => {
        state.loadingSummary = false;
        state.summary = action.payload;
      })
      .addCase(fetchAttendanceSummary.rejected, (state, action) => {
        state.loadingSummary = false;
        state.error = action.payload;
      });
  },
});

export default attendanceSlice.reducer;
