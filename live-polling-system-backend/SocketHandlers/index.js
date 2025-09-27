import registerPollHandlers from './pollHandler.js';
import registerStudentHandlers from './studentHandler.js';

function registerSocketHandlers(io) {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    registerStudentHandlers(io, socket);
    registerPollHandlers(io, socket);
  });
}

export { registerSocketHandlers };
