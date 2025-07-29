import { useAuth } from "@/authentication/AuthContext";
import { Modal } from "antd";
import { Lock, CheckCircle } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccessModalVisible, setIsSuccessModalVisible] =
    useState<boolean>(false);

  const navigate = useNavigate();
  const { login, role, accessToken } = useAuth();

  console.log("accessToken", accessToken);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Attempt login first to get the role
      await login(email, password);

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
      <div className="hidden lg:flex flex-1 items-center justify-center bg-gray-900">
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
            Welcome back!
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Log in to continue to your account
          </p>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-4">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          <form onSubmit={handleLogin} className="space-y-3">
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
                  placeholder="Enter your password"
                />
              </div>
              <div className="text-sm my-5 flex justify-end">
                <a href="#" className=" text-indigo-600 hover:text-indigo-500">
                  Forgot password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                disabled={isLoading}
              >
                {isLoading ? <ClipLoader color="#fff" size={22} /> : "Log in"}
              </button>
            </div>
          </form>

          <div className="text-center text-xs sm:text-sm text-gray-600 mt-5">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className=" text-indigo-600 hover:underline hover:text-indigo-500 transition"
            >
              Sign up here for free
            </Link>
          </div>

          <div className="text-center text-xs sm:text-sm text-gray-600 mt-5">
            Need help?{" "}
            <Link
              to="https://ncmcmaranding.com/contact-us"
              target="_blank"
              className="text-indigo-600 hover:underline hover:text-indigo-500 transition"
            >
              Contact us
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
