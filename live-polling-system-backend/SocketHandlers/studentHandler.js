import { addStudent, removeStudent, getStudentBySocket } from '../students.js';
import { v4 as uuidv4 } from 'uuid';

function registerStudentHandlers(io, socket) {

  socket.on('studentJoin', (payload) => {
    const { name } = payload || {};
    if (!name) {
      socket.emit('registrationError', { message: 'Name is required' });
      return;
    }

    const studentId = uuidv4(); // generate unique studentId
    addStudent(studentId, socket.id, name);

    // Send back assigned studentId
    socket.emit('studentRegistered', { studentId, name });
  });


  socket.on('disconnect', () => {
    const student = getStudentBySocket(socket.id);
    if (student) {
      removeStudent(student.studentId);
    }
  });
}

export default registerStudentHandlers;
