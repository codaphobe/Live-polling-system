// // socketHandler.js
// const { createPoll, vote, getResults, closePoll } = require('./polls');

// function registerSocketHandlers(io) {
//   io.on('connection', (socket) => {
//     console.log('User connected:', socket.id);

//     socket.on('createPoll', (payload) => {
//       console.log('createPoll payload:', payload);
//       // support both direct payload and wrapper { data: {...} }
//       const body = payload && payload.data ? payload.data : payload;
//       const { question, options } = body || {};

//       if (typeof question !== 'string' || !Array.isArray(options) || options.length === 0) {
//         socket.emit('createPollError', {
//           message: 'Invalid createPoll payload. Expected { question: string, options: string[] }'
//         });
//         return;
//       }

//       try {
//         const poll = createPoll(question, options);
//         console.log("Poll Created")
//         socket.emit('pollCreated', poll);
//       } catch (err) {
//         console.error('createPoll error:', err);
//         socket.emit('createPollError', { message: err.message });
//       }
//     });

//     socket.on('submitVote', (payload) => {
//       console.log('submitVote payload:', payload);
//       const body = payload && payload.data ? payload.data : payload;
//       const { studentId, optionIndex } = body || {};
//       const result = vote(studentId, optionIndex);

//       if (result.success) {
//         io.emit('pollUpdated', result.poll);
//       } else {
//         socket.emit('voteError', result.reason);
//       }
//     });

//     socket.on('getResults', () => {
//       socket.emit('pollResults', getResults());
//     });

//     socket.on('closePoll', () => {
//       const poll = closePoll();
//       io.emit('pollClosed', poll);
//     });

//     socket.on('disconnect', () => {
//       console.log('User disconnected:', socket.id);
//     });
//   });
// }

// module.exports = registerSocketHandlers;
