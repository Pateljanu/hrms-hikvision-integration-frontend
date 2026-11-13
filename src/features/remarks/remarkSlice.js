import { createSlice } from "@reduxjs/toolkit";
import {
  submitRemark,
  fetchMyRemarks,
  fetchPendingRemarks,
  acceptRemark,
  rejectRemark,
} from "./remarkThunks";

const remarkSlice = createSlice({
  name: "remarks",
  initialState: {
    myRemarks: [],
    pending: [],
    loading: false,
    error: null,
  },
  reducers: {},

  extraReducers: (builder) => {
    builder

      // EMPLOYEE — SUBMIT REMARK
      .addCase(submitRemark.pending, (state) => {
        state.loading = true;
      })
      .addCase(submitRemark.fulfilled, (state, action) => {
        state.loading = false;
        state.myRemarks.push(action.payload);
      })
      .addCase(submitRemark.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // EMPLOYEE — GET MY REMARKS
      .addCase(fetchMyRemarks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyRemarks.fulfilled, (state, action) => {
        state.loading = false;
        state.myRemarks = action.payload;
      })
      .addCase(fetchMyRemarks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ADMIN — GET PENDING REMARKS
      .addCase(fetchPendingRemarks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPendingRemarks.fulfilled, (state, action) => {
        state.loading = false;
        state.pending = action.payload;
      })
      .addCase(fetchPendingRemarks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ADMIN — ACCEPT REMARK
      .addCase(acceptRemark.fulfilled, (state, action) => {
        const { remarkId } = action.meta.arg;     // FIXED
        state.pending = state.pending.filter((r) => r.id !== remarkId);
      })

      // ADMIN — REJECT REMARK
      .addCase(rejectRemark.fulfilled, (state, action) => {
        const { remarkId } = action.meta.arg;     // FIXED
        state.pending = state.pending.filter((r) => r.id !== remarkId);
      });
  },
});

export default remarkSlice.reducer;
