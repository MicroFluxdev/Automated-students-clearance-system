import { render, screen } from "@testing-library/react";
import Login from "../src/pages/auth/Login";
import { test, expect } from "vitest";
import { AuthProvider } from "../src/authentication/AuthContext";
import { MemoryRouter } from "react-router-dom";

test("renders Login component", () => {
  render(
    <MemoryRouter>
      <AuthProvider>
        <Login />
      </AuthProvider>
    </MemoryRouter>
  );
  // Check for the heading text in the Login component
  expect(
    screen.getByRole("heading", { name: /welcome back!/i })
  ).toBeInTheDocument();
  // Check for the login button
  expect(screen.getByRole("button", { name: /log in/i })).toBeInTheDocument();
});
