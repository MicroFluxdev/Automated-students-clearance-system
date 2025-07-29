// src/layouts/Layout.tsx
import React from "react";
import { Link, Outlet } from "react-router-dom";
import { HoverCardDemo } from "../components/Footer";

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gray-50 p-4 flex justify-between items-center">
        <nav className="flex gap-4">
          <Link to="/" className="text-gray-700 hover:text-gray-900">
            Home
          </Link>
          <Link to="/about" className="text-gray-700 hover:text-gray-900">
            About
          </Link>
          <Link to="/contact" className="text-gray-700 hover:text-gray-900">
            Contact
          </Link>
          <Link to="" className="text-gray-700 hover:text-gray-900">
            Student Records
          </Link>
        </nav>
        <HoverCardDemo />
      </header>

      <main className="flex-1 p-8">
        <Outlet />
      </main>

      <footer className="bg-gray-50 p-4 mt-8">
        <p className="text-center text-gray-600">© 2025 My React App</p>
      </footer>
    </div>
  );
};

export default Layout;
