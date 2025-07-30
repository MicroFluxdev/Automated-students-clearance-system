import { useAuth } from "@/authentication/AuthContext";
import { Modal } from "antd";
import { Lock, CheckCircle, MessageCircleWarning } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { type RegisterData, registerSchema } from "@/lib/validation";
import { passwordRules } from "@/lib/passwordRules";
import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";

export default function Register() {
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccessModalVisible, setIsSuccessModalVisible] =
    useState<boolean>(false);

  const navigate = useNavigate();
  const { registerUser, role } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    mode: "onTouched",
  });

  const onSubmit = async (data: RegisterData) => {
    setIsLoading(true);
    setError("");
    try {
      await registerUser(
        data.studentId,
        data.firstName,
        data.lastName,
        data.email,
        data.phoneNumber,
        data.password
      );
      setIsSuccessModalVisible(true);
      reset();
    } catch (error: any) {
      if (error?.response) {
        const { status } = error.response;
        if (status === 401 || status === 404 || status === 400) {
          setError(
            "Registration failed. Please check your details and try again."
          );
        } else {
          setError("Registration failed. Please try again later.");
        }
      } else if (error?.request) {
        setError("Network error. Please check your connection and try again.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const passwordValue = watch("password");

  return (
    <div className="min-h-screen flex">
      {/* Left side: Image */}
      <div className="hidden lg:flex flex-1 max-h-screen items-center justify-center bg-gray-900">
        <img
          src="https://ncmc.edu.ph/img/home_cover.jpg"
          alt="Register illustration"
          className="object-cover w-full h-full max-h-screen opacity-80"
          style={{ filter: "brightness(0.6)" }}
        />
      </div>
      {/* Right side: Register form */}
      <div className="flex flex-col justify-center flex-1 px-6 py-12 bg-white">
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
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-3"
            noValidate
          >
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
                    type="text"
                    autoComplete="given-name"
                    className={`block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 ${
                      errors.firstName ? "border-red-500" : ""
                    }`}
                    placeholder="John"
                    {...register("firstName")}
                  />
                  {errors.firstName && (
                    <span className="text-xs text-red-600">
                      {errors.firstName.message}
                    </span>
                  )}
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
                    type="text"
                    autoComplete="family-name"
                    className={`block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 ${
                      errors.lastName ? "border-red-500" : ""
                    }`}
                    placeholder="Doe"
                    {...register("lastName")}
                  />
                  {errors.lastName && (
                    <span className="text-xs text-red-600">
                      {errors.lastName.message}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label
                  htmlFor="studentId"
                  className="block text-sm/6 font-medium text-gray-800"
                >
                  Student ID
                </label>
                <div className="mt-2">
                  <input
                    id="studentId"
                    type="text"
                    autoComplete="off"
                    className={`block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 ${
                      errors.studentId ? "border-red-500" : ""
                    }`}
                    placeholder="00-0000"
                    {...register("studentId")}
                  />
                  {errors.studentId && (
                    <span className="text-xs text-red-600">
                      {errors.studentId.message}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex-1">
                <label
                  htmlFor="phoneNumber"
                  className="block text-sm/6 font-medium text-gray-800"
                >
                  Phone Number
                </label>
                <div className="mt-2">
                  <input
                    id="phoneNumber"
                    type="text"
                    autoComplete="tel"
                    className={`block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 ${
                      errors.phoneNumber ? "border-red-500" : ""
                    }`}
                    placeholder="123456789"
                    {...register("phoneNumber")}
                  />
                  {errors.phoneNumber && (
                    <span className="text-xs text-red-600">
                      {errors.phoneNumber.message}
                    </span>
                  )}
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
                  type="email"
                  autoComplete="email"
                  className={`block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 ${
                    errors.email ? "border-red-500" : ""
                  }`}
                  placeholder="john@example.com"
                  {...register("email")}
                />
                {errors.email && (
                  <span className="text-xs text-red-600">
                    {errors.email.message}
                  </span>
                )}
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
                  type="password"
                  autoComplete="new-password"
                  className={`block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 ${
                    errors.password ? "border-red-500" : ""
                  }`}
                  placeholder="Create password"
                  {...register("password")}
                />
                {errors.password && (
                  <span className="text-xs text-red-600">
                    {errors.password.message}
                  </span>
                )}

                {passwordValue && (
                  <ul className="mt-2 space-y-1 text-sm text-gray-700">
                    {passwordRules.map((rule, idx) => {
                      const isValid = rule.test(passwordValue);
                      return (
                        <li key={idx} className="flex items-center gap-2">
                          {isValid ? (
                            <AiOutlineCheck className="text-green-600" />
                          ) : (
                            <AiOutlineClose className="text-red-600" />
                          )}
                          <span
                            className={
                              isValid ? "text-green-700" : "text-red-700"
                            }
                          >
                            {rule.label}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                )}
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
                  type="password"
                  autoComplete="new-password"
                  className={`block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 ${
                    errors.confirmPassword ? "border-red-500" : ""
                  }`}
                  placeholder="Confirm password"
                  {...register("confirmPassword", {
                    validate: (value) => value === watch("password"),
                  })}
                />
                {errors.confirmPassword && (
                  <span className="text-xs text-red-600">
                    {errors.confirmPassword.message}
                  </span>
                )}
              </div>
            </div>

            <div className="my-5">
              <div className="flex items-center justify-center text-xs sm:text-sm text-gray-600 gap-2">
                <input
                  id="nda"
                  type="checkbox"
                  className={`h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 ${
                    errors.nda ? "border-red-500" : ""
                  }`}
                  {...register("nda", {
                    required: "You must agree to the Non-Disclosure Agreement.",
                  })}
                />
                <label
                  htmlFor="nda"
                  className="ml-2 flex items-center gap-2 cursor-pointer"
                >
                  I have read and agree to the{" "}
                  <Link
                    to="https://ncmcmaranding.com/contact-us"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 underline hover:text-indigo-500 transition"
                  >
                    Non-Disclosure Agreement
                  </Link>
                  <MessageCircleWarning
                    className="inline-block text-indigo-600"
                    size={16}
                  />
                </label>
              </div>
              {errors.nda && (
                <span className="block text-xs text-red-600 mt-1">
                  {errors.nda.message}
                </span>
              )}
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
            {role === "student" ? "Access Denied" : "Registration Successful"}
          </span>
        }
        open={isSuccessModalVisible}
        onOk={() => {
          setIsSuccessModalVisible(false);
          navigate("/login", { replace: true });
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
            : "Registration successful! You may now log in to your account."}
        </p>
      </Modal>
    </div>
  );
}
