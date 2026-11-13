import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import { Toaster } from "sonner";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Attendance from "./pages/Attendance";
import EmployeeAttendance from "./pages/EmployeeAttendance";
import LeaveApproval from "./pages/LeaveApproval";
import MyLeaves from "./pages/MyLeaves";
import CompanySettings from "./pages/CompanySettings";
import SetPassword from "./pages/SetPassword";
import AdminRemarks from "./pages/AdminRemarks";
import EmployeeDetail from "./pages/EmployeeDetail";

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" richColors />

      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/login" element={<Login />} />
        <Route path="/set-password" element={<SetPassword />} />

        {/* PROTECTED + WRAPPED IN LAYOUT */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >

          {/* ADMIN ROUTES */}
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="/remark" element={<AdminRemarks/>}/>
          <Route path="employees" element={<Employees />} />
          <Route path="/employee/:code" element={<EmployeeDetail />} />

          <Route path="attendance" element={<Attendance />} />
          <Route path="leaves" element={<LeaveApproval />} />
          <Route path="company-settings" element={<CompanySettings />} />

          {/* EMPLOYEE ROUTES */}
          <Route path="my-attendance" element={<EmployeeAttendance />} />
          <Route path="my-leaves" element={<MyLeaves />} />

          {/* DEFAULT */}
          <Route index element={<Dashboard />} />

          {/* CATCH ALL */}
          <Route path="*" element={<Dashboard />} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}
