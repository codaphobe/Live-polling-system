import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from '../Context/SocketProvider.jsx';

export const TeacherPollHistory = () => {
  const [pollHistory, setPollHistory] = useState([]);
  const socket = useSocket();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  

   useEffect(() => {
    // Request poll history
    socket.emit("getPollHistory");

    // Listen for response
    socket.on("pollHistory", (history) => {
      setPollHistory(history);
      setLoading(false);
    });

    socket.on("pollHistoryError", (err) => {
      setLoading(false);
    });

    // Cleanup
    return () => {
      socket.off("pollHistory");
      socket.off("pollHistoryError");
    };
  }, [socket]);

  const getTotalVotes = (poll) => {
    return poll.options.reduce((sum, opt) => sum + (opt.votes || 0), 0);
  };

  const getPercentage = (poll, optionId) => {
    if (!poll.results || poll.results.totalVotes === 0) return 0;
    return Math.round((poll.results.votes[optionId] / poll.results.totalVotes) * 100);
  };

  const handleBackToResults = () => {
    navigate("/teacher/poll-results");
  };

  const handleCreateNewPoll = () => {
    navigate("/teacher");
  };

  if (loading) {
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

        {/* Loading State */}
        <div className="flex flex-col items-center justify-center min-h-screen gap-8 px-8 w-full">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-transparent border-t-[#7c3aed] rounded-full animate-spin"></div>
            <p className="font-['Sora'] font-medium text-black text-lg">
              Loading poll history...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
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

        {/* Error State */}
        <div className="flex flex-col items-center justify-center min-h-screen gap-8 px-8 w-full">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <p className="font-['Sora'] font-medium text-red-600 text-lg">
              {error}
            </p>
            <button
              onClick={fetchPollHistory}
              className="px-6 py-2 bg-[#7c3aed] text-white rounded-full font-['Sora'] font-medium hover:bg-[#6d28d9] transition-colors"
            >
              Try Again
            </button>
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

      {/* Back Button */}
      <div className="absolute top-8 left-8">
        <button
          onClick={handleBackToResults}
          className="flex items-center gap-2 px-4 py-2 bg-white text-[#7c3aed] rounded-full font-['Sora'] font-medium text-sm hover:bg-gray-50 transition-colors border border-[#7c3aed]"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back
        </button>
      </div>

      {/* Create New Poll Button */}
      <div className="absolute top-8 right-8">
        <button
          onClick={handleCreateNewPoll}
          className="flex items-center gap-2 px-4 py-2 bg-[#7c3aed] text-white rounded-full font-['Sora'] font-medium text-sm hover:bg-[#6d28d9] transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 3V13M3 8H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Create New Poll
        </button>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-start min-h-screen gap-8 px-8 w-full pt-24 pb-20">
        <div className="w-full max-w-2xl">
          {/* Page Title */}
          <div className="text-center mb-8">
            <h1 className="font-['Sora'] font-bold text-black text-[32px] leading-normal">
              View Poll History
            </h1>
          </div>

          {/* Poll History List */}
          <div className="space-y-8">
            {pollHistory.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 4V28M4 16H28" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <p className="font-['Sora'] font-medium text-gray-500 text-lg">
                  No polls found
                </p>
                <p className="font-['Sora'] font-normal text-gray-400 text-sm mt-2">
                  Create your first poll to see it here
                </p>
              </div>
            ) : (
              pollHistory.map((poll, index) => (
                <div key={index} className="bg-white rounded-lg border border-gray-200 p-6">
                  {/* Question Header */}
                  <div className="mb-4">
                    <h2 className="font-['Sora'] font-semibold text-black text-xl mb-2">
                      Question {index + 1}
                    </h2>
                    <div className="bg-[#4a4a4a] text-white p-4 rounded-lg">
                      <p className="font-['Sora'] font-medium text-lg">
                        {poll.question}
                      </p>
                    </div>
                  </div>

                  {/* Results */}
                  <div className="space-y-6">
                    {poll.options.map((option, index) => {
                      const totalVotes = getTotalVotes(poll);
                      const voteCount = option.votes || 0;
                      const percentage = totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0;
                      const isCorrect = index === poll.correctAnswer;

                      return (
                        <div key={index} className="relative overflow-hidden rounded-lg border border-gray-200">
                          {/* Progress bar */}
                          <div
                            className={`absolute inset-0 transition-all duration-1000 ${
                              isCorrect ? "bg-green-100" : "bg-[#7c3aed] opacity-20"
                            }`}
                            style={{ width: `${percentage}%` }}
                          />

                          <div className="relative flex items-center justify-between p-4">
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-semibold ${
                                  isCorrect ? "bg-green-500 text-white" : "bg-[#7c3aed] text-white"
                                }`}
                              >
                                {String.fromCharCode(65 + index)}
                              </div>
                              <span className="font-['Sora'] font-medium text-lg text-black">
                                {option.text}
                              </span>
                              {isCorrect && (
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 16 16"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M13.5 4.5L6 12L2.5 8.5"
                                    stroke="#10b981"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              )}
                            </div>

                            <div className="flex items-center gap-4">
                              <span className="font-['Sora'] font-medium text-gray-600 text-sm">
                                {voteCount} votes
                              </span>
                              <span className="font-['Sora'] font-semibold text-lg text-black">
                                {percentage}%
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {/* Poll Stats */}
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center text-sm text-gray-600">
                      <span className="font-['Sora'] font-medium">
                        Total Responses: <span className="font-semibold text-black">{getTotalVotes(poll)}</span>
                      </span>
                    </div>
                </div>
                </div>
              ))
            )}
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
};