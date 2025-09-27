import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from '../Context/SocketProvider.jsx';

export const Teacher = () => {
  const navigate = useNavigate();
  const socket = useSocket();
  const [question, setQuestion] = useState("");
  const [timeLimit, setTimeLimit] = useState(60); // Default to 60 seconds
  const [options, setOptions] = useState([
    { id: 0, text: "", isCorrect: false },
    { id: 1, text: "", isCorrect: false }
  ]);

  const addOption = () => {
    const newOption = {
      id: options.length,
      text: "",
      isCorrect: false
    };
    console.log("New Option: ",newOption);
    setOptions([...options, newOption]);
  };

  const handleAskQuestion = () => {
    // Here you would normally emit the poll to the backend
    // For now, we'll navigate to the results page
    if (!question.trim() || options.some(o => !o.text.trim())) {
      alert("Please fill out question and options before submitting");
      return;
    }
    console.log("Options: ",options);
    const correctOption = options.find(o => o.isCorrect); // backend expects index from 0
    if (!correctOption) {
      alert("Please select a correct answer");
      return;
    }
    console.log("Correct Option",correctOption);
    
    const payload = {
      question,
      options: options.map(o => o.text), // backend expects string[]
      timeLimit: Number(timeLimit*1000) || 60,
      correctAnswer : correctOption.id
    };

    console.log("Submitting poll:", payload);
    socket.emit("createPoll", payload);

    socket.once("pollCreated", (poll) => {
    console.log("Poll created:", poll);

    navigate("/teacher/poll-results", { state: { poll } });
    });
  };

  const updateOption = (id, text) => {
    setOptions(options.map(option => 
      option.id === id ? { ...option, text } : option
    ));
  };

  const setCorrectAnswer = (id) => {
    setOptions(options.map(option => 
      ({ ...option, isCorrect: option.id === id })
    ));
  };

  return (
    <div className="bg-white w-screen min-h-screen relative">
      {/* Intervue Poll Badge */}
      <div className="absolute top-8 left-8 z-10">
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
      <div className="flex flex-col gap-8 pt-20 pb-20 px-16 w-full h-full">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <h1 className="font-['Sora'] font-bold text-black text-[32px] leading-normal">
            Let's Get Started
          </h1>
          <p className="font-['Sora'] font-normal text-[#666666] text-base leading-normal max-w-4xl">
            you'll have the ability to create and manage polls, ask questions, and monitor your students' responses in real-time.
          </p>
        </div>

        {/* Question Input Section */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <label className="font-['Sora'] font-semibold text-black text-lg">
              Enter your question
            </label>
            <div className="relative">
              <select
                value={timeLimit}
                onChange={(e) => setTimeLimit(Number(e.target.value))}
                className="bg-[#f5f5f5] border border-[#d9d9d9] rounded-lg px-4 py-2 text-black text-sm font-['Sora'] focus:outline-none focus:ring-2 focus:ring-[#7765da] hover:border-[#7765da] transition-all"
              >
                <option value={60}>60 seconds</option>
                <option value={30}>30 seconds</option>
                <option value={120}>120 seconds</option>
              </select>
            </div>
          </div>
          
          <div className="relative">
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Rahul Bajaj"
              className="w-full h-[120px] p-4 bg-[#f5f5f5] rounded-lg border-none resize-none font-['Sora'] font-normal text-black text-base placeholder-[#999999] focus:outline-none focus:ring-2 focus:ring-[#7765da]"
            />
            <div className="absolute bottom-4 right-4 font-['Sora'] font-normal text-[#999999] text-sm">
              0/100
            </div>
          </div>
        </div>

        {/* Options and Correct Answer Section */}
        <div className="flex gap-12 w-full max-w-6xl">
          {/* Edit Options */}
          <div className="flex flex-col gap-4 flex-1 min-w-0">
            <h3 className="font-['Sora'] font-semibold text-black text-lg">
              Edit Options
            </h3>
            
            <div className="flex flex-col gap-3">
              {options.map((option, index) => (
                <div key={option.id} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#7765da] flex items-center justify-center">
                    <span className="font-['Sora'] font-semibold text-white text-sm">
                      {index + 1}
                    </span>
                  </div>
                  <input
                    type="text"
                    value={option.text}
                    onChange={(e) => updateOption(option.id, e.target.value)}
                    className="flex-1 h-12 px-4 bg-[#f5f5f5] rounded-lg border-none font-['Sora'] font-normal text-black text-base placeholder-[#999999] focus:outline-none focus:ring-2 focus:ring-[#7765da]"
                    placeholder="Enter option"
                  />
                </div>
              ))}
              
              <button
                onClick={addOption}
                className="flex items-center gap-2 mt-2 px-4 py-2 bg-transparent border border-[#d9d9d9] rounded-lg hover:border-[#7765da] transition-colors"
              >
                <span className="font-['Sora'] font-normal text-[#666666] text-sm">
                  + Add More option
                </span>
              </button>
            </div>
          </div>

          {/* Is it Correct */}
          <div className="flex flex-col gap-4 w-64">
            <h3 className="font-['Sora'] font-semibold text-black text-lg">
              Is it Correct?
            </h3>
            
            <div className="flex flex-col gap-3">
              {options.map((option) => (
                <div key={option.id} className="flex items-center gap-4 h-12">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="correctAnswer"
                      checked={option.isCorrect}
                      onChange={() => setCorrectAnswer(option.id)}
                      className="sr-only"
                    />
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      option.isCorrect 
                        ? 'border-[#7765da] bg-[#7765da]' 
                        : 'border-[#d9d9d9] bg-white'
                    }`}>
                      {option.isCorrect && (
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      )}
                    </div>
                    <span className="font-['Sora'] font-normal text-black text-sm">
                      Yes
                    </span>
                  </label>
                  
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name={`incorrect-${option.id}`}
                      checked={!option.isCorrect}
                      onChange={() => {}}
                      className="sr-only"
                    />
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      !option.isCorrect 
                        ? 'border-[#7765da] bg-[#7765da]' 
                        : 'border-[#d9d9d9] bg-white'
                    }`}>
                      {!option.isCorrect && (
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      )}
                    </div>
                    <span className="font-['Sora'] font-normal text-black text-sm">
                      No
                    </span>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Ask Question Button */}
      <div className="fixed bottom-8 right-8">
        <button 
          onClick={handleAskQuestion}
          className="w-[180px] h-[58px] flex items-center justify-center gap-2.5 px-[40px] py-[17px] rounded-[34px] bg-[linear-gradient(159deg,rgba(143,100,225,1)_0%,rgba(29,104,189,1)_100%)] hover:bg-[linear-gradient(159deg,rgba(143,100,225,0.9)_0%,rgba(29,104,189,0.9)_100%)] border-none transition-all duration-200 cursor-pointer">
          <span className="font-['Sora'] font-semibold text-white text-lg leading-normal">
            Ask Question
          </span>
        </button>
      </div>
    </div>
  );
};