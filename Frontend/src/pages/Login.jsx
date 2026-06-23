import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [role, setRole] = useState("patient");
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // const response = await axios.post("http://127.0.0.1:8000/login", {
      const response = await axios.post("https://rhms-b9d9.onrender.com/login", {
        ...formData,
        role,
      });

      const  user  = response.data;

      // Save login info in localStorage
      localStorage.setItem("token", "dummy-token"); // Replace with JWT later
      localStorage.setItem("user_id", user.id);
      localStorage.setItem("role", user.role);
      const roleNormalized = user.role?.toLowerCase().trim();
      navigate(roleNormalized === "doctor" ? "/doctor" : "/patient");
    } catch (error) {
      console.error("Login error:", error);
      setError(error.response?.data?.error || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-indigo-100 to-blue-200">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-96 transition-transform transform hover:scale-105">
        <h1 className="text-3xl font-bold text-center text-indigo-700 mb-6">
          {role === "patient" ? "Patient Login" : "Doctor Login"}
        </h1>

        {/* Role Toggle Buttons */}
        <div className="flex justify-center mb-6">
          {["patient", "doctor"].map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`px-4 py-2 rounded-full font-semibold transition-all duration-300 ${
                role === r
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 text-gray-700"
              } ${r === "doctor" ? "ml-2" : ""}`}
            >
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
            onChange={handleChange}
            required
          />

          {error && <p className="text-red-500 text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-semibold transition-all duration-300 disabled:opacity-70"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Register Redirect */}
        <p className="text-center text-sm text-gray-600 mt-4">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-indigo-600 font-medium hover:underline"
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
