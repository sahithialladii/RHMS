// // import React from "react";
// // import { useNavigate } from "react-router-dom";

// // const PatientProfile = () => {
// //   const navigate = useNavigate();

// //   // Example patient data (you can replace this with API data)
// //   const patient = {
// //     name: "Aarav Sharma",
// //     age: 25,
// //     email: "aarav@example.com",
// //     phone: "+91 9876543210",
// //     gender: "Male",
// //     condition: "Fever",
// //     address: "Hyderabad, Telangana, India",
// //     history: [
// //       { date: "2025-10-28", doctor: "Dr. Meera Rao", notes: "Mild fever, paracetamol prescribed." },
// //       { date: "2025-09-15", doctor: "Dr. Arjun Nair", notes: "Routine checkup, normal vitals." },
// //       { date: "2025-08-02", doctor: "Dr. Kavita Sharma", notes: "Cough and cold, antibiotics course." },
// //     ],
// //   };

// //   return (
// //     <div className="min-h-screen bg-gray-100 flex flex-col">
// //       {/* 🔹 Top Navigation */}
// //       <nav className="bg-blue-700 text-white flex justify-between items-center px-6 py-3 shadow-md">
// //         <h1
// //           onClick={() => navigate("/")}
// //           className="text-2xl font-bold cursor-pointer hover:text-blue-200 transition"
// //         >
// //           🏥 Patient Dashboard
// //         </h1>
// //         <button
// //           onClick={() => navigate("/patient/edit")}
// //           className="bg-white text-blue-700 font-medium px-4 py-2 rounded-lg hover:bg-blue-100 transition"
// //         >
// //           Edit Profile
// //         </button>
// //       </nav>

// //       {/* 🔹 Profile Section */}
// //       <div className="flex-1 flex justify-center items-center p-8">
// //         <div className="bg-white rounded-2xl shadow-lg w-full max-w-3xl p-8 border">
// //           <div className="flex justify-between items-center mb-6">
// //             <h2 className="text-2xl font-bold text-gray-800">Patient Profile</h2>
// //             <button
// //               onClick={() => navigate("/patient")}
// //               className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
// //             >
// //               Back to Dashboard
// //             </button>
// //           </div>

// //           <div className="grid grid-cols-2 gap-6">
// //             <div>
// //               <p className="text-gray-600 mb-2"><strong>Name:</strong> {patient.name}</p>
// //               <p className="text-gray-600 mb-2"><strong>Age:</strong> {patient.age}</p>
// //               <p className="text-gray-600 mb-2"><strong>Gender:</strong> {patient.gender}</p>
// //               <p className="text-gray-600 mb-2"><strong>Condition:</strong> {patient.condition}</p>
// //             </div>
// //             <div>
// //               <p className="text-gray-600 mb-2"><strong>Email:</strong> {patient.email}</p>
// //               <p className="text-gray-600 mb-2"><strong>Phone:</strong> {patient.phone}</p>
// //               <p className="text-gray-600 mb-2"><strong>Address:</strong> {patient.address}</p>
// //             </div>
// //           </div>

// //           <hr className="my-6 border-gray-300" />

// //           {/* 🔹 Medical History */}
// //           <div>
// //             <h3 className="text-xl font-semibold text-gray-800 mb-3">Medical History</h3>
// //             <ul className="divide-y divide-gray-200">
// //               {patient.history.map((record, index) => (
// //                 <li key={index} className="py-3">
// //                   <p className="text-gray-700">
// //                     <strong>Date:</strong> {record.date}
// //                   </p>
// //                   <p className="text-gray-700">
// //                     <strong>Doctor:</strong> {record.doctor}
// //                   </p>
// //                   <p className="text-gray-600 italic">“{record.notes}”</p>
// //                 </li>
// //               ))}
// //             </ul>
// //           </div>

// //           <hr className="my-6 border-gray-300" />

// //           {/* 🔹 Recent Doctor Chats */}
// //           <div>
// //             <h3 className="text-xl font-semibold text-gray-800 mb-3">Recent Doctor Chats</h3>
// //             <ul className="list-disc pl-6 text-gray-700">
// //               <li>Dr. Meera Rao — Follow-up scheduled on Nov 3</li>
// //               <li>Dr. Arjun Nair — Shared lab results</li>
// //             </ul>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default PatientProfile;




// import React from "react";

// const PatientProfile = () => {
//   const patient = {
//     name: "Ravi Kumar",
//     age: 29,
//     gender: "Male",
//     email: "ravi.kumar@example.com",
//     phone: "+91 98765 67890",
//     address: "Banjara Hills, Hyderabad",
//     medicalHistory: "Asthma (diagnosed 2018), occasional shortness of breath.",
//     recentVisit: "10 Oct 2025 - Consultation for mild wheezing.",
//     profileImage:
//       "https://cdn-icons-png.flaticon.com/512/2922/2922510.png", // Placeholder avatar
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 flex justify-center items-center p-6">
//       <div className="bg-white shadow-lg rounded-2xl w-full max-w-3xl p-8">
//         {/* Profile Header */}
//         <div className="flex flex-col md:flex-row items-center border-b pb-6">
//           <img
//             src={patient.profileImage}
//             alt="Patient Profile"
//             className="w-32 h-32 rounded-full border-4 border-green-500 shadow-md"
//           />
//           <div className="md:ml-6 mt-4 md:mt-0 text-center md:text-left">
//             <h2 className="text-2xl font-semibold text-green-700">
//               {patient.name}
//             </h2>
//             <p className="text-gray-600 text-lg">Age: {patient.age}</p>
//             <p className="text-gray-600 text-lg">Gender: {patient.gender}</p>
//             <p className="text-sm text-gray-500 mt-1">{patient.address}</p>
//           </div>
//         </div>

//         {/* Profile Info */}
//         <div className="mt-6 space-y-3">
//           <div>
//             <h3 className="font-semibold text-gray-700">Email:</h3>
//             <p className="text-gray-600">{patient.email}</p>
//           </div>

//           <div>
//             <h3 className="font-semibold text-gray-700">Phone:</h3>
//             <p className="text-gray-600">{patient.phone}</p>
//           </div>

//           <div>
//             <h3 className="font-semibold text-gray-700">Medical History:</h3>
//             <p className="text-gray-600">{patient.medicalHistory}</p>
//           </div>

//           <div>
//             <h3 className="font-semibold text-gray-700">Recent Visit:</h3>
//             <p className="text-gray-600">{patient.recentVisit}</p>
//           </div>
//         </div>

//         {/* Edit Button */}
//         <div className="mt-8 flex justify-end">
//           <button className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-md transition">
//             Edit Profile
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PatientProfile;






import React, { useEffect, useState } from "react";
import axios from "axios";

const PatientProfile = () => {
  const [patient, setPatient] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      setError("User not logged in");
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/profile/${userId}`);
        setPatient(response.data);
      } catch (err) {
        setError("Failed to load patient profile");
      }
    };

    fetchProfile();
  }, []);

  if (error) return <p className="text-center text-red-500 mt-8">{error}</p>;
  if (!patient) return <p className="text-center mt-8">Loading...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 flex justify-center items-center p-6">
      <div className="bg-white shadow-lg rounded-2xl w-full max-w-3xl p-8">
        <div className="flex flex-col md:flex-row items-center border-b pb-6">
          <img
            src="https://cdn-icons-png.flaticon.com/512/2922/2922510.png"
            alt="Patient Profile"
            className="w-32 h-32 rounded-full border-4 border-green-500 shadow-md"
          />
          <div className="md:ml-6 mt-4 md:mt-0 text-center md:text-left">
            <h2 className="text-2xl font-semibold text-green-700">{patient.name}</h2>
            <p className="text-gray-600 text-lg">Condition: {patient.condition}</p>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <p><strong>Email:</strong> {patient.email}</p>
          <p><strong>Age:</strong> {patient.age}</p>
          <p><strong>Diagnosis:</strong> {patient.model_output || "N/A"}</p>
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;
