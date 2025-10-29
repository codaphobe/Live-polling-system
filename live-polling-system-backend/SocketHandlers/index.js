import registerPollHandlers from './pollHandler.js';
import registerStudentHandlers from './studentHandler.js';

function registerSocketHandlers(io) {
  io.on('connection', (socket) => {

    registerStudentHandlers(io, socket);
    registerPollHandlers(io, socket);
  });
}

export { registerSocketHandlers };
