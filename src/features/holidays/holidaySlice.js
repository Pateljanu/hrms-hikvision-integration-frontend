import { createSlice } from "@reduxjs/toolkit";
import { fetchHolidays, addHoliday, deleteHoliday } from "./holidayThunks";

const holidaySlice = createSlice({
  name: "holidays",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHolidays.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchHolidays.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchHolidays.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(addHoliday.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })

      .addCase(deleteHoliday.fulfilled, (state, action) => {
        state.list = state.list.filter((h) => h.id !== action.payload);
      });
  },
});

export default holidaySlice.reducer;
