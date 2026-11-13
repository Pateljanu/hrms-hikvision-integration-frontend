


// features/leaves/leavesSlice.js
import { createSlice } from "@reduxjs/toolkit";
import {
  fetchAllLeaves,
  fetchMyLeaves,
  applyLeave,
  updateLeaveStatus,
  setAllocation,
  fetchAllEmployeeBalances,
  generateMonthlyBalance,
  fetchAllAllocations,
  addExtraLeave,
  fetchAllExtraLeave
} from "../leaves/leavesThunks";

const initialState = {
  allLeaves: [],
  myLeaves: [],
  loading: false,
  error: null,
  allocationResult: null,

  employeeBalances: [],
  loadingBalances: false,
  errorBalances: null,

  // NEW — for monthly generation
  monthlyGenResult: null,
  loadingMonthlyGen: false,
  errorMonthlyGen: null,

  allocations: [],
  loadingAllocations: false,
  errorAllocations: null,

  extraLeaveResult: null,

  // All extra leave data
  allExtraLeave: [],
  loadingExtraLeave: false,
  errorExtraLeave: null,

};

const leavesSlice = createSlice({
  name: "leaves",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ==========================================
      //  ADMIN — FETCH ALL LEAVES
      // ==========================================
      .addCase(fetchAllLeaves.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllLeaves.fulfilled, (state, action) => {
        state.loading = false;
        state.allLeaves = action.payload;
      })
      .addCase(fetchAllLeaves.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ==========================================
      //  EMPLOYEE — FETCH MY LEAVES
      // ==========================================
      .addCase(fetchMyLeaves.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyLeaves.fulfilled, (state, action) => {
        state.loading = false;
        state.myLeaves = action.payload;
      })
      .addCase(fetchMyLeaves.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ==========================================
      //  EMPLOYEE — APPLY LEAVE
      // ==========================================
      .addCase(applyLeave.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(applyLeave.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(applyLeave.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ==========================================
      //  ADMIN — APPROVE / REJECT LEAVE
      // ==========================================
      .addCase(updateLeaveStatus.fulfilled, (state, action) => {
        const updated = action.payload.data;
        const index = state.allLeaves.findIndex((l) => l.id === updated.id);
        if (index !== -1) state.allLeaves[index] = updated;
      })

      // ==========================================
      //  ADMIN — SET ALLOCATION
      // ==========================================
      .addCase(setAllocation.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.allocationResult = null;
      })
      .addCase(setAllocation.fulfilled, (state, action) => {
        state.loading = false;
        state.allocationResult = action.payload;
      })
      .addCase(setAllocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.allocationResult = null;
      });

    builder
      // ==========================================
      //  ADMIN — FETCH ALL EMPLOYEE BALANCES
      // ==========================================
      .addCase(fetchAllEmployeeBalances.pending, (state) => {
        state.loadingBalances = true;
        state.errorBalances = null;
      })
      .addCase(fetchAllEmployeeBalances.fulfilled, (state, action) => {
        state.loadingBalances = false;
        state.employeeBalances = action.payload;
      })
      .addCase(fetchAllEmployeeBalances.rejected, (state, action) => {
        state.loadingBalances = false;
        state.errorBalances = action.payload;
      });

    builder
      // ==========================================
      //  ADMIN — GENERATE MONTHLY LEAVE BALANCE
      // ==========================================
      .addCase(generateMonthlyBalance.pending, (state) => {
        state.loadingMonthlyGen = true;
        state.errorMonthlyGen = null;
        state.monthlyGenResult = null;
      })
      .addCase(generateMonthlyBalance.fulfilled, (state, action) => {
        state.loadingMonthlyGen = false;
        state.monthlyGenResult = action.payload;
      })
      .addCase(generateMonthlyBalance.rejected, (state, action) => {
        state.loadingMonthlyGen = false;
        state.errorMonthlyGen = action.payload;
      });

    builder
      .addCase(fetchAllAllocations.pending, (state) => {
        state.loadingAllocations = true;
      })
      .addCase(fetchAllAllocations.fulfilled, (state, action) => {
        state.loadingAllocations = false;
        state.allocations = action.payload; // store DB allocation data
      })
      .addCase(fetchAllAllocations.rejected, (state, action) => {
        state.loadingAllocations = false;
        state.errorAllocations = action.payload;
      });

    builder
      // ==========================================
      //  ADMIN — ADD EXTRA LEAVE
      // ==========================================
      .addCase(addExtraLeave.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addExtraLeave.fulfilled, (state, action) => {
        state.loading = false;
        state.extraLeaveResult = action.payload;
      })
      .addCase(addExtraLeave.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      // ==========================================
      //  ADMIN — FETCH ALL EXTRA LEAVE
      // ==========================================
      .addCase(fetchAllExtraLeave.pending, (state) => {
        state.loadingExtraLeave = true;
        state.errorExtraLeave = null;
      })
      .addCase(fetchAllExtraLeave.fulfilled, (state, action) => {
        state.loadingExtraLeave = false;
        state.allExtraLeave = action.payload;
      })
      .addCase(fetchAllExtraLeave.rejected, (state, action) => {
        state.loadingExtraLeave = false;
        state.errorExtraLeave = action.payload;
      });

  },
});

export default leavesSlice.reducer;
