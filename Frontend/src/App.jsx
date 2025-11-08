// import React from 'react'
// import {BrowserRouter, Routes, Route} from 'react-router-dom'
// import Home from './pages/Home'
// import Patient from './pages/Patient'
// import Doctor from './pages/Doctor'
// import Login from './pages/Login'
// import Register from './pages/Register'
// import DocProfile from './pages/DocProfile'
// import PatientProfile from './pages/PatientProfile'

// const App = () => {
//   return (
//     <>
//     <BrowserRouter>
//     <Routes>
//       <Route path='/' element={<Home />}/>
//       <Route path='/patient' element={<Patient />}/>
//       <Route path='/doctor' element={<Doctor />}/>
//       <Route path='/login' element={<Login />} />
//       <Route path='/register' element={<Register />} />
//       <Route path='/doctor/profile' element={<DocProfile />} />
//       <Route path='/patient/profile' element={<PatientProfile />} />
//     </Routes>
//     </BrowserRouter>
//     </>
//     )
// }

// export default App


import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Patient from "./pages/Patient";
import Doctor from "./pages/Doctor";
import PatientProfile from './pages/PatientProfile'
import DocProfile from './pages/DocProfile'
import CompletePatientProfile from './pages/CompletePatientProfile'
import CompleteDoctorProfile from "./pages/CompleteDoctorProfile"
import ConnectDoctor from './pages/ConnectDoctor'
import ChatRoom from './pages/ChatRoom'


const PrivateRoute = ({ children, allowedRole }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) return <Navigate to="/login" />;
  if (allowedRole && role !== allowedRole) return <Navigate to="/login" />;
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* ✅ Protected Routes */}
        <Route
          path="/patient"
          element={
            <PrivateRoute allowedRole="patient">
              <Patient />
            </PrivateRoute>
          }
        />
        <Route
          path="/doctor"
          element={
            <PrivateRoute allowedRole="doctor">
              <Doctor />
            </PrivateRoute>
          }
        />

          <Route path='/doctor/profile' element={<DocProfile />} />
         <Route path='/patient/profile' element={<PatientProfile />} />
         <Route path='/patient/completeprofile' element={<CompletePatientProfile />} />
         <Route path='/doctor/completeprofile' element={<CompleteDoctorProfile />} />
         <Route path='/patient/connectdoctor' element={<ConnectDoctor />} />
         <Route path='/chatroom/:appointmentId' element={<ChatRoom />} />

        {/* Default redirect */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
