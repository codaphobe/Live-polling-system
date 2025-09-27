import mongoose from 'mongoose';

const optionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  votes: { type: Number, default: 0 }
});

const pollSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [optionSchema],          // store each option with vote count
  correctAnswer: { type: Number, required: true }, // index of correct option
  timeLimit: { type: Number, default: 60000 },     // ms
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

const Poll = mongoose.model("Poll", pollSchema);
export default Poll;
