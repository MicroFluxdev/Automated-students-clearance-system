import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../authentication/AuthContext";

interface Props {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<Props> = ({ children, allowedRoles }) => {
  const { accessToken, role } = useAuth();
  const location = useLocation();

  if (!accessToken || accessToken === "null" || accessToken === "undefined") {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowedRoles && !allowedRoles.includes(role || "")) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
