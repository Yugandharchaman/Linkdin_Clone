import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Menu, X } from "lucide-react"; // For hamburger icon

function Navbar() {
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-blue-900 text-white px-6 py-3 fixed top-0 left-0 w-full z-50 shadow-md">
      {/* Desktop + Mobile container */}
      <div className="flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold">
          MiniLinkedIn
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-4">
          {/* 🔹 Post link */}
          <Link to="/" className="hover:underline">Posts</Link>
          <Link to="/profile" className="hover:underline">{user?.name}</Link>
          <button
            onClick={() => { logout(); navigate("/login"); }}
            className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="flex flex-col mt-3 space-y-2 md:hidden">
          {/* 🔹 Post link in mobile */}
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="hover:underline"
          >
            Post
          </Link>
          <Link
            to="/profile"
            onClick={() => setIsOpen(false)}
            className="hover:underline"
          >
            {user?.name}
          </Link>
          <button
            onClick={() => { logout(); navigate("/login"); setIsOpen(false); }}
            className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 text-left"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
