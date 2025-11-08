import React from "react";
import { Link } from "react-router-dom";
import { Stethoscope } from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center justify-center text-center px-6">
      
      {/* Logo Section */}
      <div
        className="flex items-center gap-3 mb-6"
      >
        <Stethoscope className="w-10 h-10 text-blue-600" />
        <h1 className="text-3xl sm:text-4xl font-bold text-blue-700">
          RDLINet Lung Sound Analysis
        </h1>
      </div>

      {/* Subtitle */}
      <p className="text-gray-700 max-w-2xl text-lg sm:text-xl mb-8"
      >
        An AI-powered system for early detection of respiratory abnormalities through lung sound analysis.
      </p>

      {/* Buttons */}
      <div className="flex gap-6">
        <Link
          to="/login"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-2xl shadow-md transition-all"
        >
          Login
        </Link>

        <Link
          to="/register"
          className="bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-3 px-6 rounded-2xl shadow-md transition-all"
        >
          Sign Up
        </Link>

        <Link
          to="/about"
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-2xl shadow-md transition-all"
        >
          Learn More
        </Link>
      </div>

    </div>
  );
};

export default Home;
