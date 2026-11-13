import { createSlice } from "@reduxjs/toolkit";
import {
  fetchEmployees,
  saveEmployee,
  deleteEmployee,
  sendPasswordLink,
  setPasswordWithToken,
} from "./employeesThunks";

const employeesSlice = createSlice({
  name: "employees",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 🔹 GET EMPLOYEES
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔹 ADD / UPDATE EMPLOYEE
      .addCase(saveEmployee.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.list.findIndex(
          (e) => e.employee_code === updated.employee_code
        );

        if (index >= 0) {
          state.list[index] = updated;
        } else {
          state.list.push(updated);
        }
      })

      // 🔹 DELETE EMPLOYEE
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.list = state.list.filter(
          (e) => e.employee_code !== action.payload
        );
      })

      // 🔹 ADMIN SENDS PASSWORD LINK
      .addCase(sendPasswordLink.pending, (state) => {
        state.loading = true;
      })
      .addCase(sendPasswordLink.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(sendPasswordLink.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔹 EMPLOYEE SETS PASSWORD WITH TOKEN
      .addCase(setPasswordWithToken.pending, (state) => {
        state.loading = true;
      })
      .addCase(setPasswordWithToken.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(setPasswordWithToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default employeesSlice.reducer;
