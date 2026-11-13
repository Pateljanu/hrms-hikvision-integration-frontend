// features/leaves/leavesThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

/* =======================
   ADMIN: Fetch all leaves
   ======================= */
export const fetchAllLeaves = createAsyncThunk(
  "leaves/fetchAllLeaves",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.post("/api/leave/all-leaves");
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to fetch all leaves"
      );
    }
  }
);

/* =======================
   EMPLOYEE: Fetch my leaves
   ======================= */
export const fetchMyLeaves = createAsyncThunk(
  "leaves/fetchMyLeaves",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.post("/api/leave/my");
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to fetch your leaves"
      );
    }
  }
);

/* =======================
   EMPLOYEE: Apply leave
   ======================= */
export const applyLeave = createAsyncThunk(
  "leaves/applyLeave",
  async (leaveData, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const employee_code =
        auth?.user?.employee_code || auth?.user?.employeeCode || null;

      const payload = {
        ...leaveData,
        employee_code,
        start_date: (leaveData.start_date || "").split("T")[0],
        end_date: (leaveData.end_date || "").split("T")[0],
      };

      const res = await api.post("/api/leave/apply", payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to apply leave"
      );
    }
  }
);

/* =======================
   ADMIN: Approve / Reject leave
   ======================= */
export const updateLeaveStatus = createAsyncThunk(
  "leaves/updateLeaveStatus",
  async ({ id, status, approved_by }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/api/leave/${id}`, { status, approved_by });
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to update leave status"
      );
    }
  }
);

/* =======================
   ADMIN: Set monthly allocation
   POST /api/leave/admin/allocate
   body: { year, month, paid, unpaid }
   ======================= */
export const setAllocation = createAsyncThunk(
  "leaves/setAllocation",
  async ({ year, month, paid = 1, unpaid = 0 }, { rejectWithValue }) => {
    try {
      const body = {
        year: Number(year),
        month: Number(month),
        paid: Number(paid),
        unpaid: Number(unpaid),
      };
      const res = await api.post("/api/leave/admin/allocate", body);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to set allocation"
      );
    }
  }
);

export const fetchAllEmployeeBalances = createAsyncThunk(
  "leaves/fetchAllEmployeeBalances",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.post("/api/leave/admin/balances");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);


/* =======================
   ADMIN: Generate monthly balance for all employees
   POST /api/leave/admin/generate-month
   Optional query: ?testNext=true
   ======================= */
export const generateMonthlyBalance = createAsyncThunk(
  "leaves/generateMonthlyBalance",
  async ({ testNext = false } = {}, { rejectWithValue }) => {
    try {
      const url = testNext
        ? "/api/leave/generate-month?testNext=true"
        : "/api/leave/generate-month";

      const res = await api.post(url);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to generate monthly leave balance"
      );
    }
  }
);

/* =======================
   ADMIN: Fetch all allocations (year-wise)
   ======================= */
export const fetchAllAllocations = createAsyncThunk(
  "leaves/fetchAllAllocations",
  async (_, { rejectWithValue }) => {
    try {
      const now = new Date();
      const year1 = now.getFullYear();
      const year2 = year1 + 1;

      const res1 = await api.post(`/api/leave/admin/all-allocations?year=${year1}`);
      const res2 = await api.post(`/api/leave/admin/all-allocations?year=${year2}`);

      // merge both years
      return [...res1.data, ...res2.data];

    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to fetch leave allocations"
      );
    }
  }
);


/* ============================
   ADMIN: Add Extra Leave to an Employee
   POST /api/leave/admin/extra-leave
   body: { employee_code, year, month, extra }
   ============================ */
export const addExtraLeave = createAsyncThunk(
  "leaves/addExtraLeave",
  async ({ employee_code, year, month, extra }, { rejectWithValue }) => {
    try {
      const body = {
        employee_code,
        year: Number(year),
        month: Number(month),
        extra: Number(extra),
      };

      const res = await api.post("/api/leave/admin/add-extra-leave", body);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Failed to add extra leave"
      );
    }
  }
);

/* ============================
   ADMIN: Fetch All Extra Leave
   GET all extra leave for all employees, all months
   ============================ */
export const fetchAllExtraLeave = createAsyncThunk(
  "leaves/fetchAllExtraLeave",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.post("/api/leave/admin/all-extra-leave");
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Failed to fetch extra leave data"
      );
    }
  }
);

