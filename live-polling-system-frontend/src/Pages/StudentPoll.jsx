import React, { useState, useEffect } from "react";
// import { io } from "socket.io-client";
import { useLocation, useNavigate } from "react-router-dom";
import { useSocket } from '../Context/SocketProvider.jsx';

export const StudentPoll = () => {
    
  const location = useLocation();
  const poll = location.state?.poll;
  const socket = useSocket();
  const [currentPoll, setCurrentPoll] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState((currentPoll?.time || 60)); // seconds
  const [results, setResults] = useState(null);
  const [isWaiting, setIsWaiting] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
      setCurrentPoll(poll);
      setTimeLeft(poll.time || 60);
      setSelectedAnswer(null);
      setResults(null);
      setIsWaiting(false);
  }, [poll]);

  // Timer countdown
    useEffect(() => {
        if (timeLeft > 0 && !hasSubmitted) { 
            const timer = setTimeout(() => setTimeLeft(timeLeft-1), 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft <= 0 && !hasSubmitted) {
            handleSubmit(true); // auto-submit
        }
    }, [timeLeft, hasSubmitted]);

  const handleAnswerSelect = (optionId) => {
    if (!hasSubmitted && timeLeft > 0) {
        console.log("Selected option:", optionId);
      setSelectedAnswer(optionId);
    }
  };
  
    useEffect(() => {
      // Set up socket event listeners
      socket.on("pollUpdated", (updatedPoll) => {
        console.log("Updated poll:", updatedPoll);
        setCurrentPoll(updatedPoll);
      });
      
      socket.on("voteError", (errMsg) => {
        alert(errMsg || "Error submitting vote");
        setHasSubmitted(false);
      });

      // Cleanup function
      return () => {
        socket.off("pollUpdated");
        socket.off("voteError");
      };
    }, []);


    const handleSubmit = () => {
        if (selectedAnswer===null) {
            alert("Please select an option before submitting.");
            setTimeout(() => {
              navigate("/student/loading",{ replace: true });
            }, 2000);
        }
        const studentId = localStorage.getItem("studentId");

        // Emit vote to backend
        console.log('Submitting vote for option index:', selectedAnswer);
        socket.emit("submitVote", {studentId, optionIndex: selectedAnswer });

        // Disable further voting
        setHasSubmitted(true);
                
        setTimeout(() => {
            navigate("/student/loading",{ replace: true });
        }, 2000);
    };


  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};


  const getPercentage = (optionId) => {
    if (!results || results.totalVotes === 0) return 0;
    return Math.round((results.results[optionId] / results.totalVotes) * 100);
  };

  if (isWaiting || !currentPoll) {
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

        {/* Chat Icon */}
        <div className="fixed bottom-8 right-8">
          <div className="w-12 h-12 bg-[#7c3aed] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#6d28d9] transition-colors">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 12H8.01M12 12H12.01M16 12H16.01M21 12C21 16.418 16.97 20 12 20C10.89 20 9.84 19.81 8.87 19.46L3 21L4.54 15.13C4.19 14.16 4 13.11 4 12C4 7.582 8.03 4 12 4C16.97 4 21 7.582 21 12Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>
    );
  }

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
      <div className="flex flex-col items-center justify-center min-h-screen gap-8 px-8 w-screen pt-20">
        <div className="w-full max-w-2xl">
          {/* Question Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-['Sora'] font-semibold text-black text-xl">
              Question :
            </h2>
            <div className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="8" cy="8" r="7" stroke="#dc2626" strokeWidth="2"/>
                <path d="M8 4v4l3 2" stroke="#dc2626" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <span className="font-['Sora'] font-medium text-[#dc2626] text-lg">
                {formatTime(timeLeft*1000)}
              </span>
            </div>
          </div>

          {/* Question */}
          <div className="bg-[#4a4a4a] text-white p-4 rounded-lg mb-6">
            <p className="font-['Sora'] font-medium text-lg">
              {currentPoll.question}
            </p>
          </div>

            
            {/* Options */}
            <div className="space-y-3 mb-8">
            {currentPoll.options.map((option, idx ) => {
            const isSelected = selectedAnswer === idx;
            const percentage = hasSubmitted ? getPercentage(idx) : 0;
            const showResults = hasSubmitted && results;

            return (
            <div
                key={idx}
                className={`relative overflow-hidden rounded-lg border-2 cursor-pointer transition-all ${
                isSelected 
                    ? 'border-[#7c3aed] bg-[#7c3aed]' 
                    : 'border-gray-300 bg-white hover:border-[#7c3aed]'
                } ${hasSubmitted ? 'cursor-default' : ''}`}
                onClick={() => handleAnswerSelect(idx)} // still use array id
            >
                {showResults && (
                <div
                    className="absolute inset-0 bg-[#7c3aed] opacity-20 transition-all duration-1000"
                    style={{ width: `${percentage}%` }}
                />
                )}

                <div className="relative flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-semibold ${
                    isSelected ? 'bg-white text-[#7c3aed]' : 'bg-[#7c3aed] text-white'
                    }`}>
                    {String.fromCharCode(65 + idx)}
                    </div>
                    <span className={`font-['Sora'] font-medium text-lg ${
                    isSelected ? 'text-white' : 'text-black'
                    }`}>
                    {option} {/* Access the text from object */}
                    </span>
                </div>

                {showResults && (
                    <span className={`font-['Sora'] font-semibold text-lg ${
                    isSelected ? 'text-white' : 'text-black'
                    }`}>
                    {percentage}%
                    </span>
                )}
                </div>
            </div>
            );
        })}
        </div>

          {/* Submit Button or Waiting Message */}
          {!hasSubmitted ? (
            <div className="flex justify-center">
              <button
                onClick={handleSubmit}
                disabled={selectedAnswer === null}
                className={`px-8 py-3 rounded-full font-['Sora'] font-semibold text-lg transition-all ${
                  selectedAnswer != null
                    ? 'bg-[#7c3aed] text-white hover:bg-[#6d28d9] cursor-pointer'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Submit Answer
              </button>
            </div>
          ) : (
            <div className="text-center">
              <p className="font-['Sora'] font-medium text-black text-lg">
                Wait for the teacher to ask a new question..
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Chat Icon */}
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