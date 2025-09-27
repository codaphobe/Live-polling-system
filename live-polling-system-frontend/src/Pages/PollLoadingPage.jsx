import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from '../Context/SocketProvider.jsx';



export const PollLoadingPage = () => {
  const navigate = useNavigate();
  const socket = useSocket();
    useEffect(() => {
      console.log("Setting up newPoll listener in loading page");

      // Define handler separately for better cleanup
      const handleNewPoll = (poll) => { 
        console.log("Received new poll, cleaning up and navigating");
        console.log("Poll Data:", poll);
        // Clean up listener before navigation
        socket.off("newPoll", handleNewPoll);
        navigate("/student/poll", { state: { poll } });
      };

      // Set up listener for new polls
      socket.on("newPoll", handleNewPoll);

      // Cleanup when component unmounts
      return () => {
        console.log("Loading page unmounting, cleaning up listener");
        socket.off("newPoll", handleNewPoll);
      };
  }, [socket, navigate]);

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
        <div className="flex flex-col items-center gap-8">
          {/* Loading Spinner */}
          <div className="w-16 h-16 border-4 border-transparent border-t-[#7c3aed] rounded-full animate-spin"></div>
          
          {/* Loading Text */}
          <div className="text-center">
            <h1 className="font-['Sora'] font-semibold text-black text-[24px] leading-normal">
              Wait for the teacher to ask questions..
            </h1>
          </div>
        </div>
      </div>

      {/* Chat Icon - Bottom Right */}
      <div className="fixed bottom-8 right-8">
        <div className="w-12 h-12 bg-[#7c3aed] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#6d28d9] transition-colors">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 12H8.01M12 12H12.01M16 12H16.01M21 12C21 16.418 16.97 20 12 20C10.89 20 9.84 19.81 8.87 19.46L3 21L4.54 15.13C4.19 14.16 4 13.11 4 12C4 7.582 8.03 4 12 4C16.97 4 21 7.582 21 12Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </div>
  );
};