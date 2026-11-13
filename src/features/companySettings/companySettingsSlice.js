import { createSlice } from "@reduxjs/toolkit";
import {
  saveCompanySetting,
  fetchAllSettings,
  fetchSettingByDate,
} from "./companySettingsThunks";

const companySettingsSlice = createSlice({
  name: "companySettings",
  initialState: {
    allSettings: [],
    currentSetting: null,
    loading: false,
    error: null,
    message: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(saveCompanySetting.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveCompanySetting.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message || "Saved successfully!";
      })
      .addCase(saveCompanySetting.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAllSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.allSettings = action.payload;
      })
      .addCase(fetchAllSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchSettingByDate.fulfilled, (state, action) => {
        state.currentSetting = action.payload;
      });
  },
});

export default companySettingsSlice.reducer;
