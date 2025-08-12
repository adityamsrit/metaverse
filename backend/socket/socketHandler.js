
// This file will contain functions to handle Socket.IO connections and events.

// A simple in-memory store for connected players' data
// In a real game, this might be more sophisticated (e.g., using Redis for scaling)
const connectedPlayers = {};

/**
 * Attaches Socket.IO event listeners for connection, chat messages, and player movement.
 * @param {object} io - The Socket.IO server instance.
 */
function initializeSocketHandlers(io) {
  io.on('connection', (socket) => {
    console.log(`A user connected: ${socket.id}`);

    // When a new user connects, add them to the connectedPlayers map
    // We'll send initial position and username later from client
    connectedPlayers[socket.id] = {
      id: socket.id,
      position: { x: 0, y: 0.9, z: 0 }, // Default starting position
      rotation: { y: 0 },
      username: `Player_${socket.id.substring(0, 4)}`, // Temporary username
      color: `#${Math.floor(Math.random()*16777215).toString(16)}` // Random color
    };

    // Emit the new player's data to all other existing clients
    socket.broadcast.emit('playerConnected', connectedPlayers[socket.id]);
    // Emit all existing players (including self) to the newly connected client
    socket.emit('currentPlayers', connectedPlayers);


    // Listen for 'playerMovement' event from a client
    socket.on('playerMovement', (data) => {
      if (connectedPlayers[socket.id]) {
        connectedPlayers[socket.id].position = data.position;
        connectedPlayers[socket.id].rotation = data.rotation;
        // Broadcast the updated player position to all other clients
        socket.broadcast.emit('playerMoved', {
          id: socket.id,
          position: data.position,
          rotation: data.rotation
        });
      }
    });

    // Listen for 'chatMessage' event from a client
    socket.on('chatMessage', (messageData) => {
      // messageData should contain { sender: 'username', message: 'text' }
      // Broadcast the chat message to all connected clients
      io.emit('chatMessage', messageData);
      console.log(`Chat from ${messageData.sender}: ${messageData.message}`);
    });

    // Listen for client disconnection
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
      // Remove the disconnected player from the map
      delete connectedPlayers[socket.id];
      // Inform all other clients that a player has disconnected
      io.emit('playerDisconnected', socket.id);
    });

    // Add a handler for username update (for authenticated users)
    socket.on('updateUsername', (username) => {
      if (connectedPlayers[socket.id]) {
        connectedPlayers[socket.id].username = username;
        // Broadcast this update to all clients
        io.emit('playerUpdated', connectedPlayers[socket.id]);
        console.log(`Player ${socket.id} updated username to ${username}`);
      }
    });

  });
}

module.exports = initializeSocketHandlers;