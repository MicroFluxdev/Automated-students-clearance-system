// src/routes/index.tsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "../pages/auth/Login";
import { ViewClearance } from "../pages/clearing-officer/ViewClearance";
import Unauthorized from "../pages/Unauthorized";
import Dashboard from "../pages/clearing-officer/Dashboard";
import Clearance from "../pages/clearing-officer/Clearance";
import StudentRecord from "../pages/clearing-officer/StudentRecord";
import Requirements from "../pages/clearing-officer/Requirements";
import Events from "@/pages/clearing-officer/Events";
import AccountSettings from "@/pages/clearing-officer/AccountSettings";
import AdminDashboard from "@/pages/admin-side/Dashboard";
import AdminLayout from "@/layouts/AdminLayout";
import AddStudents from "@/pages/admin-side/AddStudents";
import AddClearingOfficer from "@/pages/admin-side/AddClearingOfficer";
import AdminSettings from "@/pages/admin-side/AccountSettings";
import Layout from "@/layouts/Layout";
import ViewQrCodePermit from "@/pages/ViewQrCodePermit";
import ProtectedRoute from "@/components/ProtectedRoute";
import Register from "@/pages/auth/Register";
import GuestRoute from "@/components/GuestRoute";
import RootPages from "@/pages/landingPage/RootPages";
import ClearingOfficerLayout from "@/layouts/ClearingOfficerLayout";
import SampleQrCode from "@/pages/SampleQrCode";
import ViewPermit from "@/pages/TestingQrCodePermit";
// Enrollment System Imports
import EnrollmentDashboard from "@/pages/enrollmentSide/EnrollmentDashboard";
import StudentManagement from "@/pages/enrollmentSide/StudentManagement";
import CourseManagement from "@/pages/enrollmentSide/CourseManagement";
import SemesterManagement from "@/pages/enrollmentSide/SemesterManagement";
import StudentEnrollment from "@/pages/enrollmentSide/StudentEnrollment";
import EnrollmentRecords from "@/pages/enrollmentSide/EnrollmentRecords";
import EnrollmentLayout from "@/layouts/EnrollmentLayout";
import EnrollmentLogin from "@/pages/enrollmentSide/EnrollmentLogin";
import ViewCourses from "@/pages/clearing-officer/ViewCourses";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/**Route for Home*/}
      <Route path="/" element={<Layout />}>
        <Route index element={<RootPages />} />
        <Route path="*" element={<Unauthorized />} />
      </Route>

      {/**Route for admin */}
      <Route
        path="/admin-side"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="addStudents" element={<AddStudents />} />
        <Route path="addClearingOfficer" element={<AddClearingOfficer />} />
        <Route path="adminSettings" element={<AdminSettings />} />

        <Route path="*" element={<Unauthorized />} />
      </Route>
      {/**Route for clearing officer */}
      <Route
        path="/clearing-officer"
        element={
          <ProtectedRoute allowedRoles={["clearingOfficer"]}>
            <ClearingOfficerLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="clearance" element={<Clearance />} />
        <Route
          path="student-records/:courseCode/:reqId"
          element={<StudentRecord />}
        />
        <Route path="requirements" element={<Requirements />} />
        <Route path="events" element={<Events />} />
        <Route path="accountSettings" element={<AccountSettings />} />
        <Route path="viewClearance" element={<ViewClearance />} />
        <Route path="viewCourses" element={<ViewCourses />} />
        <Route path="*" element={<Unauthorized />} />
      </Route>
      {/**General Route */}
      <Route path="permit" element={<ViewQrCodePermit />} />
      <Route path="sampleQrCode" element={<SampleQrCode />} />
      <Route path="viewPermit" element={<ViewPermit />} />

      <Route path="enrollmentLogin" element={<EnrollmentLogin />} />
      <Route
        path="login"
        element={
          <GuestRoute>
            <Login />
          </GuestRoute>
        }
      />
      <Route
        path="register"
        element={
          <GuestRoute>
            <Register />
          </GuestRoute>
        }
      />
      {/* Enrollment System Routes */}
      <Route
        path="/enrollment"
        element={
          // <ProtectedRoute allowedRoles={["admin"]}>
          <EnrollmentLayout />
          // </ProtectedRoute>
        }
      >
        <Route index element={<EnrollmentDashboard />} />
        <Route path="students" element={<StudentManagement />} />
        <Route path="courses" element={<CourseManagement />} />
        <Route path="semester" element={<SemesterManagement />} />
        <Route path="enroll" element={<StudentEnrollment />} />
        <Route path="records" element={<EnrollmentRecords />} />
      </Route>

      <Route path="unauthorized" element={<Unauthorized />} />
    </Routes>
  );
};

export default AppRoutes;
