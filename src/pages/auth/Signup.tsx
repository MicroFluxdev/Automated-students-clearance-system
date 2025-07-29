import {
  Facebook,
  Code,
  Mail,
  Lock,
  IdCardIcon,
  Phone,
  User2,
  UsersRound,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import { register } from "../../api/authentication.api";
import { Alert } from "antd";

export const Signup = () => {
  const navigate = useNavigate();
  const [studentId, setStudentId] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (
      !studentId ||
      !fullName ||
      !email ||
      !phoneNumber ||
      !password ||
      !confirmPassword ||
      !role
    ) {
      setError("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    try {
      const response = await register(
        studentId,
        fullName,
        email,
        phoneNumber,
        password,
        role
      );
      console.log(response);
      setSuccess("Signup successful! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error: any) {
      console.error("Signup failed:", error);
      setError(
        error.response?.data?.message || "Signup failed. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 to-black p-30 relative">
      <div className="absolute inset-0 z-0">
        <img
          src="https://ncmc.edu.ph/img/home_cover.jpg"
          alt="Background"
          className="w-full h-full object-cover opacity-20"
        />
      </div>

      <div className="container mx-auto px-4 flex items-center justify-between relative z-10">
        {/* Left side - Title and Subtitle */}
        <motion.div
          className="text-white"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <span className="flex justify-start items-center h-10 w-full rounded-lg text-xs text-gray-600 mb-5">
            <img src="/ncmc-logo1.png" alt="Web Image" className="w-15 h-15" />
          </span>

          <h1 className="text-6xl font-bold mb-4 text-left">
            Automated Student Clearance System
          </h1>

          <p className="text-xl font-stretch-50% text-gray-300 text-left mb-4">
            Improving Processing Time in the College of Engineering and Computer
            Science
          </p>

          <div className="flex gap-5 text-left">
            <Link
              to="https://www.facebook.com/NCMCMarandingOfficial"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Facebook className="text-gray-300 hover:text-white w-8 h-8" />
            </Link>
            <Link to="https://www.ncmc.edu.ph/">
              <Code className="text-gray-300 hover:text-white w-8 h-8" />
            </Link>
          </div>
        </motion.div>

        {/* Right side - Login Card */}
        <motion.div
          className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md ml-20"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Create Your Account
          </h2>

          {error && (
            <Alert
              message={error}
              type="error"
              showIcon
              className="mb-4"
              closable
              onClose={() => setError("")}
            />
          )}

          {success && (
            <Alert message={success} type="success" showIcon className="mb-4" />
          )}

          <form className="space-y-6" onSubmit={handleSignup}>
            <div className="flex items-center">
              <IdCardIcon className="text-gray-400 mr-2" size={20} />
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your School ID"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center">
              <User2 className="text-gray-400 mr-2" size={20} />
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your Full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center">
              <Mail className="text-gray-400 mr-2" size={20} />
              <input
                type="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center">
              <Phone className="text-gray-400 mr-2" size={20} />
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your Phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center">
              <Lock className="text-gray-400 mr-2" size={20} />
              <input
                type="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center">
              <Lock className="text-gray-400 mr-2" size={20} />
              <input
                type="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center">
              <UsersRound className="text-gray-400 mr-2" size={20} />
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              >
                <option value="">Select Role</option>
                {/* <option value="student">Student</option> */}
                <option value="clearingOfficer">Clearing Officer</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
            >
              Sign up
            </button>

            <div className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 hover:underline">
                Log in
              </Link>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};
