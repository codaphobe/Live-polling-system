import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from '../Context/SocketProvider.jsx';

export const StudentName = () => {
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const socket = useSocket();

  const handleJoinPoll = () => {
    if (name.trim()) {
      socket.emit("studentJoin", { name });

      socket.once("studentRegistered", (data) => {

        localStorage.setItem("studentId", data.studentId);
        navigate("/student/loading");
      });

      socket.once("studentJoinError", (err) => {
        alert(err.message || "Error joining poll");
      });
    }
  };

  return (
    <div className="bg-[#f8f9fa] w-screen min-h-screen relative">
      {/* Intervue Poll Badge */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="flex w-[134px] h-[31px] items-center justify-center gap-[7px] px-[9px] py-0 rounded-3xl bg-[linear-gradient(90deg,rgba(117,101,217,1)_0%,rgba(77,10,205,1)_100%)]">
          <img
            className="relative w-[14.66px] h-[14.65px]"
            alt="Vector"
            src="/vector.svg"
          />
          <span className="relative flex items-center justify-center w-fit font-['Sora'] font-semibold text-white text-sm">
            Intervue Poll
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-screen gap-8 px-8 w-screen">
        <div className="flex flex-col items-center gap-8 w-full max-w-lg">
          {/* Header */}
          <div className="text-center">
            <h1 className="font-['Sora'] font-bold text-black text-[48px] leading-tight mb-6">
              Let's Get Started
            </h1>
            <p className="font-['Sora'] font-normal text-[#6b7280] text-lg leading-relaxed max-w-md mx-auto">
              If you're a student, you'll be able to{" "}
              <span className="font-semibold text-black">submit your answers</span>
              , participate in live polls, and see how your responses compare with
              your classmates
            </p>
          </div>

          {/* Name Input Section */}
          <div className="w-full flex flex-col items-center gap-4">
            <label className="font-['Sora'] font-medium text-black text-base self-start">
              Enter your Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Rahul Bajaj"
              className="w-full h-[56px] px-6 bg-[#e5e7eb] rounded-lg border-none font-['Sora'] font-normal text-black text-base placeholder-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#7765da] focus:bg-white transition-all"
              onKeyPress={(e) => e.key === "Enter" && handleJoinPoll()}
            />
          </div>

          {/* Continue Button */}
          <button
            onClick={handleJoinPoll}
            disabled={!name.trim()}
            className={`w-[200px] h-[56px] flex items-center justify-center gap-2.5 px-[40px] py-[16px] rounded-[28px] border-none transition-all duration-200 cursor-pointer mt-4 ${
              name.trim()
                ? "bg-[linear-gradient(135deg,rgba(139,92,246,1)_0%,rgba(99,102,241,1)_100%)] hover:bg-[linear-gradient(135deg,rgba(139,92,246,0.9)_0%,rgba(99,102,241,0.9)_100%)] shadow-lg hover:shadow-xl"
                : "bg-[#d1d5db] cursor-not-allowed"
            }`}
          >
            <span
              className={`font-['Sora'] font-semibold text-lg leading-normal ${
                name.trim() ? "text-white" : "text-[#9ca3af]"
              }`}
            >
              Continue
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};