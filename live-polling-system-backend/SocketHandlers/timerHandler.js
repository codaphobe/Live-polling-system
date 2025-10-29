import { closePoll } from '../polls.js';
import Poll from '../db/models/Poll.js';

let pollTimer = null;

function startPollTimer(io, duration) {
  clearPollTimer();

  pollTimer = setTimeout(async () => {
    const poll = closePoll();

    const pollToSave = new Poll({
      question: poll.question,
      options: poll.options.map((text, i) => ({
        text,
        votes: poll.votes[i] || 0
      })),
      correctAnswer: poll.correctAnswer,
      timeLimit: poll.time,
      active: false,        // mark as completed
      createdAt: poll.createdAt
    });
    await pollToSave.save();
    
    io.emit('pollClosed', poll);
  }, duration);
}

function clearPollTimer() {
  if (pollTimer) clearTimeout(pollTimer);
}

export { startPollTimer, clearPollTimer };
