import { render, screen, fireEvent } from "@testing-library/react";
import Login from "../src/pages/auth/Login";
import axios from "../src/api/axios";
import { test, expect, vi } from "vitest";
import { AuthProvider } from "../src/authentication/AuthContext";
import React from "react";
import { MemoryRouter } from "react-router-dom";

// Mock axios
vi.mock("../src/api/axios");

test("calls login API on click", async () => {
  const mockedPost = axios.post as unknown as ReturnType<typeof vi.fn>;
  mockedPost.mockResolvedValueOnce({ data: { user: "Mock User" } });

  render(
    <MemoryRouter>
      <AuthProvider>
        <Login />
      </AuthProvider>
    </MemoryRouter>
  );

  fireEvent.click(screen.getByText("Log in"));

  expect(mockedPost).toHaveBeenCalledWith("http://localhost:8080/auth/login", {
    email: "anthony.dev@gmail.com",
    password: "Anthony@123",
  });
});
