import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../authentication/AuthContext";

// You can use any toast library, here is an example with react-toastify
import { toast } from "react-toastify";

interface Props {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<Props> = ({ children, allowedRoles }) => {
  const { accessToken, role } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // If no accessToken, show toast for expired token
    if (!accessToken) {
      toast.error("Session expired. Please log in again.");
    }
  }, [accessToken]);

  if (!accessToken) {
    // Redirect to login and show toast
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowedRoles && !allowedRoles.includes(role || "")) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
