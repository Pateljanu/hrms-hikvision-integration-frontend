
// src/components/Navbar.jsx
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser, logoutUser } from "@/features/auth/authThunks";

// UI Components
import { Button } from "@/components/ui/button";

export default function Navbar({ adminView, setAdminView }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  // ⭐ Switch Admin ↔ Employee + Navigate
  const handleSwitchView = () => {
    if (adminView === "admin") {
      // Switch to employee view
      setAdminView("employee");
      navigate("/my-attendance"); // Employee route
    } else {
      // Switch back to admin view
      setAdminView("admin");
      navigate("/dashboard"); // Admin route
    }
  };

  return (
    <nav className="w-full bg-white border-b shadow-sm flex items-center justify-between px-6 py-3">
      {/* Title */}
      <h1 className="text-xl font-semibold text-gray-800">
        {user?.role === "admin"
          ? adminView === "admin"
            ? "Admin Dashboard"
            : "Employee View"
          : "Employee Dashboard"}
      </h1>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        
        {/* Switch View Button (Admin Only) */}
        {user?.role === "admin" && (
          <Button
            variant="outline"
            onClick={handleSwitchView}
            className="border-blue-500 text-blue-500 hover:bg-blue-50"
          >
            {adminView === "admin"
              ? "Switch to Employee View"
              : "Back to Admin"}
          </Button>
        )}

        {/* User Info */}
        <div className="text-gray-600 text-sm">
          <strong>{user?.full_name || "User"}</strong>{" "}
          <span className="text-gray-400">({user?.role})</span>
        </div>

        {/* Logout Button */}
        <Button
          variant="destructive"
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white"
        >
          Logout
        </Button>
      </div>
    </nav>
  );
}
