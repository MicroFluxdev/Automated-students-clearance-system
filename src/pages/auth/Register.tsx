import { useAuth } from "@/authentication/AuthContext";
import { Modal } from "antd";
import { Lock, CheckCircle, MessageCircleWarning } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccessModalVisible, setIsSuccessModalVisible] =
    useState<boolean>(false);
  const [ndaChecked, setNdaChecked] = useState<boolean>(false);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [studentId, setStudentId] = useState<string>("");
  const navigate = useNavigate();
  const { register, role, accessToken } = useAuth();

  console.log("accessToken", accessToken);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !studentId ||
      !email ||
      !password ||
      !firstName ||
      !lastName ||
      !phoneNumber
    ) {
      setError("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!ndaChecked) {
      setError("You must agree to the Non-Disclosure Agreement");
    }

    setIsLoading(true);
    setError("");

    try {
      // Attempt login first to get the role
      await register(
        studentId,
        firstName,
        lastName,
        email,
        phoneNumber,
        password
      );

      navigate("/login", { replace: true });

      // Show success modal before navigation
      setIsSuccessModalVisible(true);
    } catch (error: any) {
      if (error.response) {
        const { status } = error.response;

        if (status === 401 || status === 404 || status === 400) {
          setError("Wrong credentials. Please try again.");
        } else {
          setError("Login failed. Please try again later.");
        }
      } else if (error.request) {
        setError("Network error. Please check your connection and try again.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side: Image */}
      <div className="hidden lg:flex flex-1 max-h-screen items-center justify-center bg-gray-900">
        <img
          src="https://ncmc.edu.ph/img/home_cover.jpg"
          alt="Login illustration"
          className="object-cover w-full h-full max-h-screen opacity-80"
          style={{ filter: "brightness(0.6)" }}
        />
      </div>
      {/* Right side: Login form */}
      <div className="flex flex-col justify-center flex-1 px-6 py-12 bg-white">
        {/* <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            alt="Your Company"
            src="https://ncmcmaranding.com/img/old-logo.png"
            className="mx-auto h-15 w-auto"
          />
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div> */}

        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className=" text-center text-3xl font-bold tracking-tight text-gray-700">
            Create Account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your information to get started
          </p>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-4">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          <form onSubmit={handleRegister} className="space-y-3">
            <div className="flex gap-4">
              <div className="flex-1">
                <label
                  htmlFor="firstName"
                  className="block text-sm/6 font-medium text-gray-800"
                >
                  First Name
                </label>
                <div className="mt-2">
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    autoComplete="given-name"
                    className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="John"
                  />
                </div>
              </div>
              <div className="flex-1">
                <label
                  htmlFor="lastName"
                  className="block text-sm/6 font-medium text-gray-800"
                >
                  Last Name
                </label>
                <div className="mt-2">
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    autoComplete="family-name"
                    className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Doe"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label
                  htmlFor="firstName"
                  className="block text-sm/6 font-medium text-gray-800"
                >
                  Student ID
                </label>
                <div className="mt-2">
                  <input
                    id="studentId"
                    name="studentId"
                    type="text"
                    required
                    autoComplete="given-name"
                    className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder="00-0000"
                  />
                </div>
              </div>
              <div className="flex-1">
                <label
                  htmlFor="lastName"
                  className="block text-sm/6 font-medium text-gray-800"
                >
                  Phone Number
                </label>
                <div className="mt-2">
                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="text"
                    required
                    autoComplete="phone"
                    className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="123456789"
                  />
                </div>
              </div>
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm/6 font-medium text-gray-800"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm/6 font-medium text-gray-800"
                >
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create password"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm/6 font-medium text-gray-800"
                >
                  Confirm Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  autoComplete="current-password"
                  className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm password"
                />
              </div>
            </div>

            <div className="flex items-center justify-center my-5 text-xs sm:text-sm text-gray-600 gap-2">
              <input
                id="nda"
                name="nda"
                type="checkbox"
                required
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                checked={ndaChecked}
                onChange={(e) => setNdaChecked(e.target.checked)}
              />
              <label htmlFor="nda" className="ml-2 flex items-center gap-2 ">
                I have read and agree to the{" "}
                <Link
                  to="https://ncmcmaranding.com/contact-us"
                  target="_blank"
                  className="text-indigo-600  underline hover:text-indigo-500 transition"
                >
                  Non-Disclosure Agreement
                </Link>
                <MessageCircleWarning
                  className="inline-block text-indigo-600"
                  size={16}
                />
              </label>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                disabled={isLoading}
              >
                {isLoading ? <ClipLoader color="#fff" size={22} /> : "Create"}
              </button>
            </div>
          </form>

          <div className="text-center text-xs sm:text-sm text-gray-600 mt-5">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-indigo-600 hover:underline hover:text-indigo-500 transition"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
      <Modal
        title={
          <span
            className={`flex items-center gap-2 ${
              role === "student" ? "text-red-600" : "text-green-700"
            }`}
          >
            {role === "student" ? (
              <Lock className="inline-block" size={22} />
            ) : (
              <CheckCircle className="inline-block" size={22} />
            )}
            {role === "student" ? "Access Denied" : "Login Successful"}
          </span>
        }
        open={isSuccessModalVisible}
        onOk={() => {
          setIsSuccessModalVisible(false);
          if (role === "admin") navigate("/admin-side", { replace: true });
          if (role === "clearingOfficer")
            navigate("/clearing-officer", { replace: true });
        }}
        okText="Okay"
        centered
        cancelButtonProps={{ style: { display: "none" } }}
      >
        <p
          className={`text-base sm:text-lg ${
            role === "student" ? "text-red-600" : "text-green-700"
          }`}
        >
          {role === "student"
            ? "Students cannot access this login page. Please use the student portal."
            : "Welcome back! NCMC's Clearance System is now open..."}
        </p>
      </Modal>
    </div>
  );
}
