// backend/server.js
// This is the main server file for your backend. It sets up Express, connects to MongoDB,
// initializes Socket.IO, and defines the main routes.
require('dotenv').config(); // Load environment variables from .env file at the very top
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http'); // Required for Socket.IO
const { Server } = require('socket.io'); // Import Server from socket.io
const initializeSocketHandlers = require('./socket/socketHandler'); // Import Socket.IO handlers

const app = express();
const server = http.createServer(app); // Create HTTP server for Express and Socket.IO

// Initialize Socket.IO
// Allow connections from your frontend origin and specify allowed methods.
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000", // Replace with your frontend URL in production
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000" // Configure CORS for your frontend
}));
app.use(express.json()); // Enable parsing of JSON request bodies

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  // Removed useNewUrlParser and useUnifiedTopology as they are deprecated and have no effect in modern Mongoose versions.
})
.then(() => console.log('MongoDB connected successfully!'))
.catch(err => console.error('MongoDB connection error:', err));

// Basic Route
app.get('/', (req, res) => {
  res.send('Metaverse Game Backend API is running!');
});

// Import Routes
const authRoutes = require('./routes/auth');
// Use Routes
app.use('/api/auth', authRoutes);

// Initialize Socket.IO handlers
initializeSocketHandlers(io); // Pass the io instance to the handlers

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 