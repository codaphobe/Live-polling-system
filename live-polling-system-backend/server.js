import dotenv from 'dotenv';

import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import './db/connectDb.js';

dotenv.config();

import { registerSocketHandlers } from './SocketHandlers/index.js';


const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

app.use(express.json());

registerSocketHandlers(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
