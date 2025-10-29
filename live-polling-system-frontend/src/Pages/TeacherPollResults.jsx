import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSocket } from '../Context/SocketProvider.jsx';

export const TeacherPollResults = () => {
  const { state } = useLocation();
  const [currentPoll, setCurrentPoll] = useState(state?.poll || null);
  const [results, setResults] = useState({ totalVotes: 0, results: {} });
  const [pollCompleted, setPollCompleted] = useState(false);
  const [poll, setPoll] = useState(state?.poll || null);
  const navigate = useNavigate();
  const socket = useSocket();
  const [totalVotes, setTotalVotes] = useState(0);


    // if (!poll) return null;

    useEffect(() => {
        if (!poll) {
          navigate("/teacher"); // fallback if state missing
          return;
        }

        if (poll.active === false) {
          navigate("/teacher");
          return;
        }

        if(poll) {
          const totalVotes = poll.votes.reduce((a, b) => a + b, 0);
          setTotalVotes(totalVotes);
        }

        socket.emit('getActivePoll');
        socket.once('activePoll', (activePoll) => {
          if (!activePoll.active) {
            navigate("/teacher");
          }
        });

        // Listen for poll updates (votes coming in)
        socket.on("pollUpdated", (updatedPoll) => {
          setPoll(updatedPoll);
        });

        // Listen for poll close
        socket.on("pollClosed", (closedPoll) => {
          setPoll(closedPoll);
        });

        return () => {
          socket.off("pollUpdated");
          socket.off("pollClosed");
        };
      }, [socket, poll, navigate]);

    const getPercentage = (optionId) => {
      if (!poll || totalVotes === 0) return 0;
      return Math.round((poll.votes[optionId] / totalVotes) * 100);
    };

    const handleNewQuestion = () => {
      navigate("/teacher");
    };

    const handleViewHistory = () => {
      navigate("/teacher/poll-history");
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

      {/* View Poll History Button */}
      <div className="absolute top-8 right-8">
        <button
          onClick={handleViewHistory}
          className="flex items-center gap-2 px-4 py-2 bg-[#7c3aed] text-white rounded-full font-['Sora'] font-medium text-sm hover:bg-[#6d28d9] transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 3.5V8L10.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5"/>
          </svg>
          View Poll history
        </button>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-screen gap-8 px-8 w-full pt-20">
        <div className="w-full max-w-2xl">
          {/* Question Header */}
          <div className="flex items-center justify-center mb-6">
            <h2 className="font-['Sora'] font-semibold text-black text-xl">
              Question
            </h2>
          </div>

          {/* Question */}
          <div className="bg-[#4a4a4a] text-white p-4 rounded-lg mb-6">
            <p className="font-['Sora'] font-medium text-lg">
              {currentPoll.question}
            </p>
          </div>

          {/* Results Container */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
            {/* Options with Results */}
            <div className="space-y-3">
              {currentPoll.options.map((option, idx) => {
                const percentage = getPercentage(idx);  
                // const voteCount = results.results[option.id] || 0;
                const voteCount = poll.votes[idx] || 0;
                const isCorrect = option.id === currentPoll.correctAnswer;
                
                return (
                  <div
                    key={idx}
                    className="relative overflow-hidden rounded-lg border border-gray-200"
                  >
                    {/* Progress bar background */}
                    <div 
                      className={`absolute inset-0 transition-all duration-1000 ${
                        isCorrect ? 'bg-green-100' : 'bg-[#7c3aed] opacity-20'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                    
                    <div className="relative flex items-center justify-between p-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-semibold ${
                          isCorrect ? 'bg-green-500 text-white' : 'bg-[#7c3aed] text-white'
                        }`}>
                          {String.fromCharCode(65 + idx)}
                        </div>
                        <span className="font-['Sora'] font-medium text-lg text-black">
                          {option}
                        </span>
                        {isCorrect && (
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13.5 4.5L6 12L2.5 8.5" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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

            {/* Total Votes */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-center font-['Sora'] font-medium text-gray-600">
                Total Responses: <span className="font-semibold text-black">{totalVotes}</span>
              </p>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex justify-center">
            {pollCompleted ? (
              <button
                onClick={handleNewQuestion}
                className="flex items-center gap-2 px-8 py-3 bg-[#7c3aed] text-white rounded-full font-['Sora'] font-semibold text-lg hover:bg-[#6d28d9] transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 3V13M3 8H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Ask a new question
              </button>
            ) : (
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="w-4 h-4 border-2 border-transparent border-t-[#7c3aed] rounded-full animate-spin"></div>
                  <span className="font-['Sora'] font-medium text-gray-600">
                    Poll is active - Results updating in real-time
                  </span>
                </div>
                <button
                  onClick={handleNewQuestion}
                  className="flex items-center gap-2 px-8 py-3 bg-[#7c3aed] text-white rounded-full font-['Sora'] font-semibold text-lg hover:bg-[#6d28d9] transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 3V13M3 8H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  Ask a new question
                </button>
              </div>
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