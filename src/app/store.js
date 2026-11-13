import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import employeesReducer from "../features/employees/employeesSlice";
import attendanceReducer from "../features/attendance/attendanceSlice";
import leavesReducer from "../features/leaves/leavesSlice";
import companySettingsReducer from "../features/companySettings/companySettingsSlice";
import holidayReducer from '../features/holidays/holidaySlice';
import remarksReducer from '../features/remarks/remarkSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    employees: employeesReducer,
    attendance: attendanceReducer,
    leaves: leavesReducer,
    companySettings: companySettingsReducer,
    holidays:holidayReducer,
    remarks: remarksReducer,
  },
});
