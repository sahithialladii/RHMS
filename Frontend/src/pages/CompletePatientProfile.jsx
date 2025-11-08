import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CompletePatientProfile = () => {
  const [form, setForm] = useState({ age: "", condition: "" });
  const navigate = useNavigate();
  const userId = localStorage.getItem("user_id");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://127.0.0.1:8000/complete_profile", {
        user_id: userId,
        age: form.age,
        condition: form.condition,
      });
      localStorage.setItem("profile_completed", true);
      alert("Profile completed successfully!");
      navigate("/patient");
    } catch (err) {
      alert("Error completing profile");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center text-green-600 mb-4">
          Complete Patient Profile
        </h2>
        <input
          name="age"
          placeholder="Age"
          type="number"
          onChange={handleChange}
          value={form.age}
          className="border rounded-lg w-full p-2 mb-3"
          required
        />
        <input
          name="condition"
          placeholder="Health Condition"
          onChange={handleChange}
          value={form.condition}
          className="border rounded-lg w-full p-2 mb-3"
          required
        />
        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg"
        >
          Save Profile
        </button>
      </form>
    </div>
  );
};

export default CompletePatientProfile;
