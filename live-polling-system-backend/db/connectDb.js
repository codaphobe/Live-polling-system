import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Replace this with your actual Atlas connection string

const mongoURI = process.env.MONGO_URI;


mongoose.connect(mongoURI);


const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {});

export default db;
