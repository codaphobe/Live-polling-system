import { createPoll, vote, getResults, closePoll, getActivePoll } from '../polls.js';
import { startPollTimer, clearPollTimer } from './timerHandler.js';
import { getStudentById } from '../students.js'; 
import Poll from '../db/models/Poll.js';

function registerPollHandlers(io, socket) { 

  socket.on('createPoll', (payload) => {
    const body = payload?.data || payload;
    const { question, options, timeLimit, correctAnswer  } = body || {};

    if (!question || !Array.isArray(options) || options.length === 0) {
      socket.emit('createPollError', { message: 'Invalid payload' });
      return;
    }

    const correctIndex = parseInt(correctAnswer, 10);
    if (isNaN(correctIndex) || correctIndex < 0 || correctIndex >= options.length) {
      socket.emit('createPollError', { message: 'Invalid or missing correct answer index' });
      return;
    }

    if (getResults()?.active) {
      socket.emit('createPollError', { message: 'Another poll is already active' });
      return;
    }

    try {
      const poll = createPoll(question, options,timeLimit, correctIndex);
      io.emit('pollCreated', poll);
      socket.broadcast.emit('newPoll',poll);
      startPollTimer(io, timeLimit || 60000); // default 60s
    } catch (err) {
      socket.emit('createPollError', { message: err.message });
    }
  });

  
  socket.on('submitVote', (payload) => {
    const body = payload?.data || payload;
    const { studentId, optionIndex } = body || {};
    

    if (!studentId) {
      socket.emit('voteError', 'Missing studentId');
      return;
    }

    // Look up student by studentId instead of socket.id
    const student = getStudentById(studentId); // implement this helper to return the student object
    if (!student) {
      socket.emit('voteError', 'Student not registered');
      return;
    }
    const result = vote(studentId, optionIndex);
    

    if (result.success) {
      io.emit('pollUpdated', result.poll);
    } else {
      socket.emit('voteError', result.reason);
    }
  });

   socket.on("getPollHistory", async () => {
    try {
      const history = await Poll.find().sort({ createdAt: -1 }); // newest first
      socket.emit("pollHistory", history);
    } catch (err) {
      socket.emit("pollHistoryError", { message: err.message });
    }
  });

  socket.on('closePoll', () => {
    clearPollTimer();
    const poll = closePoll();
    io.emit('pollClosed', poll);
  });

  socket.on('getActivePoll', () => {
    const poll = getActivePoll();
    socket.emit('activePoll', poll);
  });
}

export default registerPollHandlers;
