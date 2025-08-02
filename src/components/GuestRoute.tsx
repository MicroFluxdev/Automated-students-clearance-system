import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../authentication/AuthContext";

interface Props {
  children: React.ReactNode;
}

const GuestRoute: React.FC<Props> = ({ children }) => {
  const { accessToken, role } = useAuth();

  if (accessToken) {
    if (role === "admin") {
      return <Navigate to="/admin-side" replace />;
    } else if (role === "clearingOfficer") {
      return <Navigate to="/clearing-officer" replace />;
    }
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default GuestRoute;
