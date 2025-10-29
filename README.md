# Live Polling System

A real-time polling app for classrooms or live sessions.

- Teachers create timed multiple-choice polls, select a correct answer, and see live results.
- Students join with a name, receive the poll instantly, and submit one vote.
- Polls auto-close on a timer and are saved to MongoDB for history.

## Stack
- Backend: Node.js, Express, Socket.IO, Mongoose, MongoDB Atlas, dotenv, uuid
- Frontend: React, Vite, React Router, Tailwind CSS

## Core Concepts
- Real-time updates with WebSockets (Socket.IO) for `pollCreated`, `pollUpdated`, `pollClosed`.
- In-memory active poll state for fast updates; one-vote-per-student enforced server-side.
- Server timers auto-close polls and persist results to the database.
- Simple student identity via UUID (stored client-side and validated on server).
- Poll history persisted in MongoDB and fetched via socket events.

## Features
- Create polls (question, options, correct answer, time limit)
- Live voting and result aggregation in real time
- Auto-close on timeout and persist results
- Teacher views: create poll, live results, poll history
- Student views: register name and vote (exactly once per poll)

## Data Model (MongoDB via Mongoose)
```js
Poll: {
  question: String,
  options: [{ text: String, votes: Number }],
  correctAnswer: Number, // index
  timeLimit: Number,     // seconds (saved from active poll)
  active: Boolean,       // historical record is false
  createdAt: Date
}
```

## Project Directories
- `live-polling-system-backend`: Express + Socket.IO server, in-memory poll state, timers, DB models.
- `live-polling-system-backend/db`: Mongo connection and Mongoose models (e.g., `Poll`).
- `live-polling-system-backend/SocketHandlers`: Socket events for students, polls, timers.
- `live-polling-system-frontend`: React UI with role-based pages and Tailwind styling.
- `live-polling-system-frontend/src/Context`: Shared Socket.IO client via React Context.
- `live-polling-system-frontend/src/Pages`: Teacher and Student flows (create, vote, results, history).

## Socket Events
- Client → Server: `studentJoin`, `createPoll`, `submitVote`, `getActivePoll`, `getPollHistory`
- Server → Client: `studentRegistered`, `pollCreated`, `pollUpdated`, `pollClosed`, `activePoll`, `pollHistory`
- Errors: `registrationError`, `createPollError`, `voteError`, `pollHistoryError`

## Try it out
1. Open the [Live polling webpage](https://live-polling-system-codaphobe.netlify.app/).
2. Choose Teacher if you want to create polls.
3. Open the webapge in another tab and set yourself as student and your name before creating the poll.
4. Teacher page also shows you the Poll history, and see live poll results.

## Future implementations
- There is no authentication on neither student nor teacher.
- Bug : If the teacher moves from live-poll page to poll results page, and then comes back to live-poll page the poll is still visible even if it has ended.
- Teacher cannot see who participated in the poll.
- Student cannot see his/her poll results.

> Note: This project was made in just a day as an assesment test given in a company's job process.

