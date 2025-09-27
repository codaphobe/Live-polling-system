import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Replace this with your actual Atlas connection string
console.log("MongoDB URI from env:", process.env);
const mongoURI = process.env.MONGO_URI;
console.log("Connecting to MongoDB with URI:", process.env.MONGO_URI);

mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));


const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => console.log("MongoDB connected to Atlas successfully!"));

export default db;
