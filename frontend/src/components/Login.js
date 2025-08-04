import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", form);

      // ✅ Store user & token (NO navigation inside AuthContext)
      login(res.data.user, res.data.token);

      // 🎉 Show toast
      toast.success(`Welcome back, ${res.data.user.name}! 🎉`, {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
          padding: "12px 16px",
        },
        icon: "👋",
        duration: 2000,
      });

      // Wait for toast → then show loader
      setTimeout(() => {
        setLoading(true);

        // Navigate after loader delay
        setTimeout(() => {
          setLoading(false);
          navigate("/");
        }, 2000);
      }, 500); // short wait before loader appears

    } catch (err) {
      toast.error("Invalid credentials", {
        style: {
          borderRadius: "10px",
          background: "#ff4d4f",
          color: "#fff",
        },
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative">
      <Toaster position="top-center" reverseOrder={false} />

      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full bg-blue-900 text-white shadow-lg z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/" className="text-xl font-bold">
            MiniLinkedIn
          </Link>

          <div className="hidden md:flex gap-4">
            <Link to="/login" className="hover:underline font-medium">
              Login
            </Link>
            <Link
              to="/register"
              className="bg-white text-blue-900 px-3 py-1 rounded hover:bg-gray-200 font-medium"
            >
              Register
            </Link>
          </div>

          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="flex flex-col bg-blue-800 px-4 pb-3 md:hidden">
            <Link to="/login" className="py-2 hover:underline">
              Login
            </Link>
            <Link
              to="/register"
              className="bg-white text-blue-900 px-3 py-1 rounded mt-2 hover:bg-gray-200 font-medium w-fit"
            >
              Register
            </Link>
          </div>
        )}
      </nav>

      {/* Form */}
      <div className="flex flex-1 justify-center items-center mt-20 px-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md border-t-4 border-blue-900"
        >
          <h2 className="text-3xl font-bold mb-6 text-center text-blue-900">
            Welcome Back
          </h2>
          <p className="text-sm text-gray-500 mb-6 text-center">
            Login to continue to your account
          </p>

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

          <button className="bg-blue-900 text-white w-full py-3 rounded-lg hover:bg-blue-800 transition font-semibold">
            Login
          </button>

          <p className="text-sm mt-6 text-center">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="text-blue-600 font-medium hover:underline"
            >
              Register
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

export default Login;
