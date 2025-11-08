import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CompleteDoctorProfile = () => {
  const [form, setForm] = useState({ specialization: "", experience: "" });
  const navigate = useNavigate();
  const userId = localStorage.getItem("user_id");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://127.0.0.1:8000/complete_profile", {
        user_id: userId,
        specialization: form.specialization,
        experience: form.experience,
      });
      localStorage.setItem("profile_completed", true);
      alert("Profile completed successfully!");
      navigate("/doctor");
    } catch (err) {
      alert("Error completing profile");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-4">
          Complete Doctor Profile
        </h2>
        <input
          name="specialization"
          placeholder="Specialization"
          onChange={handleChange}
          value={form.specialization}
          className="border rounded-lg w-full p-2 mb-3"
          required
        />
        <input
          name="experience"
          placeholder="Experience (years)"
          type="number"
          onChange={handleChange}
          value={form.experience}
          className="border rounded-lg w-full p-2 mb-3"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
        >
          Save Profile
        </button>
      </form>
    </div>
  );
};

export default CompleteDoctorProfile;
