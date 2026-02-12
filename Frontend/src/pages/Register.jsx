// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const Register = () => {
//   const [role, setRole] = useState("patient");
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//     patientId: "",
//     doctorId: "",
//     specialization: "",
//     age: "",
//     gender: "",
//   });

//   const [loading, setLoading] = useState(false);

//   // handle input changes
//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   // handle registration
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (formData.password !== formData.confirmPassword) {
//       alert("Passwords do not match!");
//       return;
//     }

//     const userData = { ...formData, role }; // ✅ include role field
//     setLoading(true);

//     try {
//       const response = await axios.post("http://127.0.0.1:8000/register", userData);
//       console.log("Registration successful:", response.data);

//       alert(`${role.toUpperCase()} registered successfully! Please login.`);
//       navigate("/login"); // ✅ redirect to login page
//     } catch (error) {
//       console.error("Registration error:", error);
//       alert("Signup failed: " + (error.response?.data?.error || "Unknown error"));
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-indigo-100 to-blue-200">
//       <div className="bg-white shadow-2xl rounded-2xl p-8 w-96">
//         <h1 className="text-2xl font-bold text-center text-indigo-700 mb-6">
//           {role === "patient" ? "Patient Registration" : "Doctor Registration"}
//         </h1>

//         {/* Toggle Role */}
//         <div className="flex justify-center mb-6">
//           <button
//             onClick={() => setRole("patient")}
//             className={`px-4 py-2 rounded-full transition-all duration-300 ${
//               role === "patient"
//                 ? "bg-indigo-600 text-white"
//                 : "bg-gray-200 text-gray-700"
//             }`}
//           >
//             Patient
//           </button>
//           <button
//             onClick={() => setRole("doctor")}
//             className={`px-4 py-2 rounded-full transition-all duration-300 ml-2 ${
//               role === "doctor"
//                 ? "bg-indigo-600 text-white"
//                 : "bg-gray-200 text-gray-700"
//             }`}
//           >
//             Doctor
//           </button>
//         </div>

//         {/* Registration Form */}
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <input
//             type="text"
//             name="name"
//             placeholder="Full Name"
//             onChange={handleChange}
//             value={formData.name}
//             className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400"
//             required
//           />
//           <input
//             type="email"
//             name="email"
//             placeholder="Email"
//             onChange={handleChange}
//             value={formData.email}
//             className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400"
//             required
//           />
//           <input
//             type="password"
//             name="password"
//             placeholder="Password"
//             onChange={handleChange}
//             value={formData.password}
//             className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400"
//             required
//           />
//           <input
//             type="password"
//             name="confirmPassword"
//             placeholder="Confirm Password"
//             onChange={handleChange}
//             value={formData.confirmPassword}
//             className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400"
//             required
//           />

//           {/* Role-specific Fields */}
//           {role === "patient" ? (
//             <>
//               <input
//                 type="text"
//                 name="patientId"
//                 placeholder="Patient ID"
//                 onChange={handleChange}
//                 value={formData.patientId}
//                 className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400"
//                 required
//               />
//               <input
//                 type="number"
//                 name="age"
//                 placeholder="Age"
//                 onChange={handleChange}
//                 value={formData.age}
//                 className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400"
//                 required
//               />
//               <select
//                 name="gender"
//                 onChange={handleChange}
//                 value={formData.gender}
//                 className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400"
//                 required
//               >
//                 <option value="">Select Gender</option>
//                 <option value="Male">Male</option>
//                 <option value="Female">Female</option>
//               </select>
//             </>
//           ) : (
//             <>
//               <input
//                 type="text"
//                 name="doctorId"
//                 placeholder="Doctor ID"
//                 onChange={handleChange}
//                 value={formData.doctorId}
//                 className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400"
//                 required
//               />
//               <input
//                 type="text"
//                 name="specialization"
//                 placeholder="Specialization"
//                 onChange={handleChange}
//                 value={formData.specialization}
//                 className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400"
//                 required
//               />
//                 <input
//                   type="text"
//                   name="availability"
//                   placeholder="Availability (e.g. 10:00-18:00)"
//                   onChange={handleChange}
//                   value={formData.availability}
//                   className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400"
//                   required
//                 />

//             </>
//           )}

//           <button
//             type="submit"
//             disabled={loading}
//             className={`w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-semibold transition duration-300 ${
//               loading ? "opacity-70 cursor-not-allowed" : ""
//             }`}
//           >
//             {loading ? "Registering..." : "Register"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };
// export default Register;
















import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [role, setRole] = useState("patient");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    specialization: "",
    available_from: "",
    available_to: "",
    age: "",
    gender: "",
  });

  const [loading, setLoading] = useState(false);

  // handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // handle registration
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const userData = { ...formData, role };
    setLoading(true);

    try {
      const response = await axios.post("http://127.0.0.1:8000/register", userData);
      console.log("Registration successful:", response.data);

      alert(`${role.toUpperCase()} registered successfully! Please login.`);
      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);
      alert("Signup failed: " + (error.response?.data?.error || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-indigo-100 to-blue-200">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-96">
        <h1 className="text-2xl font-bold text-center text-indigo-700 mb-6">
          {role === "patient" ? "Patient Registration" : "Doctor Registration"}
        </h1>

        {/* Toggle Role */}
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setRole("patient")}
            className={`px-4 py-2 rounded-full transition-all duration-300 ${
              role === "patient"
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Patient
          </button>
          <button
            onClick={() => setRole("doctor")}
            className={`px-4 py-2 rounded-full transition-all duration-300 ml-2 ${
              role === "doctor"
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Doctor
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            value={formData.name}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            value={formData.email}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            value={formData.password}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400"
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            onChange={handleChange}
            value={formData.confirmPassword}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400"
            required
          />

          {role === "patient" ? (
            <>
              <input
                type="number"
                name="age"
                placeholder="Age"
                onChange={handleChange}
                value={formData.age}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400"
                required
              />
              <select
                name="gender"
                onChange={handleChange}
                value={formData.gender}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400"
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </>
          ) : (
            <>
              <input
                type="text"
                name="specialization"
                placeholder="Specialization"
                onChange={handleChange}
                value={formData.specialization}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400"
                required
              />

              {/* ✅ Availability Fields */}
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="text-sm text-gray-600">Available From</label>
                  <input
                    type="time"
                    name="available_from"
                    onChange={handleChange}
                    value={formData.available_from}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400"
                    required
                  />
                </div>
                <div className="flex-1">
                  <label className="text-sm text-gray-600">Available To</label>
                  <input
                    type="time"
                    name="available_to"
                    onChange={handleChange}
                    value={formData.available_to}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400"
                    required
                  />
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-semibold transition duration-300 ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
