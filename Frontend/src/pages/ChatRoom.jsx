import React, { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import io from "socket.io-client";

const socket = io("http://127.0.0.1:8000", {
  transports: ["websocket"],
  autoConnect: false,
});

const ChatRoom = () => {
  const { appointmentId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const role = localStorage.getItem("role");
  // const userId = localStorage.getItem("user_id");
  const currentUserId = Number(localStorage.getItem("user_id"));
  const userName = localStorage.getItem("user_name");


  const [appointmentInfo, setAppointmentInfo] = useState(null);


  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [connected, setConnected] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [diagnosis, setDiagnosis] = useState("");
  const [prescription, setPrescription] = useState("");

  useEffect(() => {
    socket.connect();

    socket.emit("join", { appointment_id: appointmentId });

    socket.on("connect", () => setConnected(true));

    socket.on("consultation_finished", (data) => {
      alert("Consultation has been completed.");

      if (role === "doctor") {
        navigate("/doctor");
      } else {
      navigate("/patient");
      }
    });


    socket.on("receive_message", (data) => {
      console.log("Received message:",data)
      setMessages((prev) => [...prev, data]);
    });
    //  fetch(`http://127.0.0.1:8000/appointment/${appointmentId}`)
     fetch(`https://rhms-b9d9.onrender.com/appointment/${appointmentId}`)
    .then(res => res.json())
    .then(data => setAppointmentInfo(data));

    return () => {
      socket.off("receive_message");
      socket.off("consultation_finished");
      socket.disconnect();
    };
  }, [appointmentId]);

  const sendMessage = () => {
    console.log("Sending message from:" ,currentUserId);
    console.log("Role:",role);
    if (!input.trim()) return;

    socket.emit("send_message", {
      appointment_id: appointmentId,
      sender_id: currentUserId,
      message: input,
    });

    setInput("");
  };


  const finishConsultation = async () => {
    // await fetch("http://127.0.0.1:8000/complete_consultation", {
    await fetch("https://rhms-b9d9.onrender.com/complete_consultation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        appointment_id: appointmentId,
        disease: diagnosis,
        prescription: prescription,
      }),
    });

    alert("Consultation Completed");
    navigate("/doctor");
  };

  return (
    <div className="flex flex-col h-screen bg-slate-100">

      {/* Header */}
      <div className="bg-indigo-600 text-white p-4 flex justify-between items-center shadow">
        <h2 className="font-bold">
          {!appointmentInfo
          ?"Loading..."
          :role === "doctor"
            ? `Chat with ${appointmentInfo.patientName}`
            : `Chat with Dr. ${appointmentInfo.doctorName}`}
        </h2>

        {role === "doctor" && appointmentInfo?.status==="Active" && (
          <button
            onClick={() => setShowModal(true)}
            className="bg-red-500 px-4 py-2 rounded-lg text-sm hover:bg-red-600"
          >
            Finish Consultation
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
  {messages.map((msg, index) => {
    const isOwn = Number(msg.sender_id) === currentUserId;

    return (
      <div
        key={`${msg.timestamp || index}-${index}`}
        className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
      >
        <div
          className={`px-4 py-2 rounded-2xl max-w-sm shadow text-sm
            ${
              isOwn
                ? "bg-indigo-600 text-white rounded-br-none"
                : "bg-white text-slate-800 rounded-bl-none border"
            }`}
        >
          <p>{msg.message}</p>
          <p className="text-[10px] mt-1 opacity-60 text-right">
            {msg.timestamp? new Date(msg.timestamp).toLocaleTimeString()
            : ""}
          </p>
        </div>
      </div>
    );
  })}
</div>


      {/* Input */}
      <div className="p-3 bg-white flex gap-2 border-t">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="flex-1 border rounded-full px-4 py-2 focus:ring-2 focus:ring-indigo-400"
          placeholder="Type your message..."
          disabled={!connected}
        />
        <button
          onClick={sendMessage}
          className="bg-indigo-600 text-white px-5 rounded-full hover:bg-indigo-700"
        >
          Send
        </button>
      </div>

      {/* Diagnosis Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl w-96 shadow-lg">
            <h3 className="font-bold text-lg mb-4">Enter Diagnosis</h3>

            <input
              type="text"
              placeholder="Disease"
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              className="w-full border p-2 rounded mb-3"
            />

            <textarea
              placeholder="Prescription"
              value={prescription}
              onChange={(e) => setPrescription(e.target.value)}
              className="w-full border p-2 rounded mb-3"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={finishConsultation}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatRoom;
