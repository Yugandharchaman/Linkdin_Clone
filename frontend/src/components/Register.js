import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false); // For loader state

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", form);

      // ✅ Show success popup
      toast.success(`Welcome, ${res.data.user.name}! 🎉 Account created`, {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
          padding: "12px 16px",
        },
        icon: "✅",
        duration: 2000
      });

      // Show loader
      setLoading(true);

      // Delay before navigating to Login page
      setTimeout(() => {
        setLoading(false);
        navigate("/login");
      }, 4000);

    } catch (err) {
      if (err.response && err.response.data.message === "User already registered") {
        toast.error("User already registered! Please login.", {
          style: {
            borderRadius: "10px",
            background: "#ff4d4f",
            color: "#fff",
          },
        });
      } else {
        toast.error("Registration failed. Try again.", {
          style: {
            borderRadius: "10px",
            background: "#ff4d4f",
            color: "#fff",
          },
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative">
      <Toaster position="top-center" reverseOrder={false} />

      {/* Responsive Navbar */}
      <nav className="fixed top-0 left-0 w-full bg-blue-900 text-white shadow-lg z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/" className="text-xl font-bold">MiniLinkedIn</Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-4">
            <Link
              to="/login"
              className="bg-white text-blue-900 px-3 py-1 rounded hover:bg-gray-200 font-medium"
            >
              Login
            </Link>
            <Link to="/register" className="hover:underline font-medium">
              Register
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {isMenuOpen && (
          <div className="flex flex-col bg-blue-800 px-4 pb-3 md:hidden">
            <Link
              to="/login"
              className="bg-white text-blue-900 px-3 py-1 rounded mt-2 hover:bg-gray-200 font-medium w-fit"
            >
              Login
            </Link>
            <Link to="/register" className="py-2 hover:underline">
              Register
            </Link>
          </div>
        )}
      </nav>

      {/* Centered Form */}
      <div className="flex flex-1 justify-center items-center mt-20 px-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md border-t-4 border-blue-900"
        >
          <h2 className="text-3xl font-bold mb-6 text-center text-blue-900">
            Create an Account
          </h2>
          <p className="text-sm text-gray-500 mb-6 text-center">
            Join MiniLinkedIn today
          </p>

          <input
            name="name"
            placeholder="Name"
            onChange={handleChange}
            className="border p-3 w-full mb-4 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <input
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="border p-3 w-full mb-4 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            className="border p-3 w-full mb-6 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />

          <button
            className="bg-blue-900 text-white w-full py-3 rounded-lg hover:bg-blue-800 transition font-semibold"
          >
            Register
          </button>

          <p className="text-sm mt-6 text-center">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 font-medium hover:underline"
            >
              Login
            </Link>
          </p>
        </form>
      </div>

      {/* Loader Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-50">
          <div className="flex space-x-2">
            <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce"></div>
            <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.2s]"></div>
            <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.4s]"></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Register;
