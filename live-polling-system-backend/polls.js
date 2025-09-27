  let currentPoll = null;
  const studentsAnswered = new Set();

  function createPoll(question, options,timeLimit, correctIndex) {
    if (typeof question !== 'string' || !Array.isArray(options) || options.length === 0) {
      throw new Error('Invalid poll payload: question must be a string and options must be a non-empty array');
    }

    currentPoll = {
      question,
      options,
      votes: new Array(options.length).fill(0),
      active: true,
      correctAnswer:correctIndex, 
      time:timeLimit/1000,
      createdAt: Date.now(),
    };

    studentsAnswered.clear();
    return currentPoll;
  }

  function vote(studentId, optionIndex) {
    if ((!currentPoll || !currentPoll.active) && !optionIndex) return { success: false, reason: 'No active poll' };
    if (!studentId) return { success: false, reason: 'Missing studentId' };
    if (typeof optionIndex !== 'number' || optionIndex < 0 || optionIndex >= currentPoll.options.length) {
      return { success: false, reason: 'Invalid optionIndex' };
    }
    if (studentsAnswered.has(studentId)) return { success: false, reason: 'Already voted' };

    currentPoll.votes[optionIndex]++;
    studentsAnswered.add(studentId);
    return { success: true, poll: currentPoll };
  }

  function getResults() {
    return currentPoll;
  }

    function getActivePoll() {
    return currentPoll;
  }

  function closePoll() {
    if (currentPoll) currentPoll.active = false;
    return currentPoll;
  }

  export { createPoll, vote, getResults, closePoll, getActivePoll };
