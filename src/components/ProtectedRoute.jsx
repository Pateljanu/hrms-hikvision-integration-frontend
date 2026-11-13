import { Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import api from "../api/api";
import { clearAuth } from "../features/auth/authSlice";

export default function ProtectedRoute({ children, role }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const token = localStorage.getItem("token");
  const [isValidating, setIsValidating] = useState(true);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const validateToken = async () => {
      // If no token, don't bother validating
      if (!token) {
        setIsValidating(false);
        setIsValid(false);
        return;
      }

      try {
        // Make a lightweight API call to verify token
        // This will trigger 401 if token is invalid
        await api.post("/api/employees/all-employees");
        setIsValid(true);
      } catch (error) {
        // Token is invalid - clear auth state
        dispatch(clearAuth());
        setIsValid(false);
      } finally {
        setIsValidating(false);
      }
    };

    validateToken();
  }, [token, dispatch]);

  // Show loading while validating
  if (isValidating) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // 1) If NO TOKEN → block immediately
  if (!token || !isValid) {
    return <Navigate to="/login" replace />;
  }

  // 2) If NO USER loaded in redux
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 3) Role-based protection
  if (role && user.role !== role) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
