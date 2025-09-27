import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HomePage } from "./Pages/HomePage.jsx";
import { Teacher } from "./Pages/Teacher.jsx";
import { StudentName } from "./Pages/StudentName.jsx";
import { PollLoadingPage } from "./Pages/PollLoadingPage.jsx";
import { StudentPoll } from "./Pages/StudentPoll.jsx";
import { TeacherPollResults } from "./Pages/TeacherPollResults.jsx";
import { TeacherPollHistory } from "./Pages/TeacherPollHistory.jsx";
import { SocketProvider } from './Context/SocketProvider.jsx';

function App () {
  return (
    <SocketProvider>
    <Router>
      <div className="w-screen min-h-screen">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/teacher" element={<Teacher />} />
          <Route path="/student" element={<StudentName />} />
          <Route path="/student/loading" element={<PollLoadingPage />} />
          <Route path="/student/poll" element={<StudentPoll />} />
          <Route path="/teacher/poll-results" element={<TeacherPollResults />} />
          <Route path="/teacher/poll-history" element={<TeacherPollHistory />} />
        </Routes>
      </div>
    </Router>
    </SocketProvider>
  );
};
export default App;