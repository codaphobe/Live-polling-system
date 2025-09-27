const students = new Map(); // studentId -> socket.id
const socketToStudentId = new Map();

function addStudent(studentId, socketId, name) {
  students.set(studentId, socketId,name);
  socketToStudentId.set(socketId, studentId);
}

function removeStudent(studentId) {
  const info = students.get(studentId);
  if (info) socketToStudentId.delete(info.socketId);
  students.delete(studentId);
}

function getAllStudents() {
  return Array.from(students.keys());
}

function getStudentById(studentId) {
  return students.get(studentId) || null;
}

function getStudentBySocket(socketId) {
  const studentId = socketToStudentId.get(socketId);
  if (!studentId) return null;
  return { studentId, ...students.get(studentId) };
}

function getStudentName(studentId) {
  return students.get(studentId)?.name;
}

export { addStudent, removeStudent, getAllStudents, getStudentById, getStudentBySocket, getStudentName };
