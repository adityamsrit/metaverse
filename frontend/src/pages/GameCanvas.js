// frontend/src/pages/GameCanvas.js
// This component connects to the WebSocket server and handles real-time player synchronization and chat.
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { io } from 'socket.io-client'; // Import socket.io-client
import ChatBox from '../components/ChatBox'; // Import ChatBox component

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'; // Make sure this matches your backend URL

function GameCanvas({ token, onLogout }) {
  const mountRef = useRef(null); // Ref for the DOM element to mount the Three.js canvas
  const playerRef = useRef(new THREE.Object3D()); // Ref for the local player's 3D object
  const keysPressed = useRef({}); // Object to track currently pressed keys for movement
  const otherPlayers = useRef({}); // Object to store other players' 3D objects by their socket ID
  const socket = useRef(null); // Socket.IO client instance reference
  const animationFrameId = useRef(null); // To store the requestAnimationFrame ID for cleanup

  const [chatMessages, setChatMessages] = useState([]); // State to hold chat messages
  const [username, setUsername] = useState('Guest'); // State for the current user's display name

  // Effect to decode username from JWT token on component mount or token change
  useEffect(() => {
    if (token) {
      try {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        if (decodedToken && decodedToken.user && decodedToken.user.username) {
          setUsername(decodedToken.user.username);
        } else if (decodedToken && decodedToken.user && decodedToken.user.id) {
            // Fallback to user ID if username is not directly in token
            setUsername(`User_${decodedToken.user.id.substring(0, 6)}`);
        }
      } catch (e) {
        console.error("Failed to decode token:", e);
      }
    }
  }, [token]);


  // Main useEffect for Three.js setup and Socket.IO connections
  useEffect(() => {
    if (!mountRef.current) return; // Ensure the DOM element is mounted

    // --- Three.js Scene Setup ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x222222); // Dark grey background

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 1.6, 5); // Position camera slightly above ground, looking forward

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement); // Add the renderer's canvas to the DOM

    // Ground plane
    const groundGeometry = new THREE.PlaneGeometry(100, 100);
    const groundMaterial = new THREE.MeshLambertMaterial({ color: 0x444444, side: THREE.DoubleSide });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = Math.PI / 2; // Rotate to be flat on the XZ plane
    scene.add(ground);

    // Player (self) avatar (a green cube)
    const playerGeometry = new THREE.BoxGeometry(1, 1.8, 1); // Avatar-like dimensions
    const playerMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00 }); // Bright green color
    const playerMesh = new THREE.Mesh(playerGeometry, playerMaterial);
    playerMesh.position.y = 0.9; // Half of height to sit on the ground
    playerRef.current = playerMesh; // Assign the mesh to the player ref
    scene.add(playerRef.current);

    // Lighting for the scene
    const ambientLight = new THREE.AmbientLight(0x404040); // Soft white ambient light
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8); // Brighter directional light
    directionalLight.position.set(5, 10, 7); // Position the light source
    scene.add(directionalLight);

    // --- Socket.IO Setup ---
    socket.current = io(BACKEND_URL); // Connect to the WebSocket server

    socket.current.on('connect', () => {
      console.log('Connected to WebSocket server:', socket.current.id);
      // Emit username to backend once connected and username is resolved from token
      if (username !== 'Guest') {
        socket.current.emit('updateUsername', username);
      }
    });

    // Listener for 'currentPlayers' event: receives data about all players currently in the game
    socket.current.on('currentPlayers', (players) => {
      for (const id in players) {
        if (id === socket.current.id) continue; // Skip rendering self, as we already have playerRef for it

        const player = players[id];
        const otherPlayerGeometry = new THREE.BoxGeometry(1, 1.8, 1);
        // Use the player's color received from the backend
        const otherPlayerMaterial = new THREE.MeshPhongMaterial({ color: new THREE.Color(player.color) });
        const otherPlayerMesh = new THREE.Mesh(otherPlayerGeometry, otherPlayerMaterial);
        otherPlayerMesh.position.set(player.position.x, player.position.y, player.position.z);
        otherPlayerMesh.rotation.y = player.rotation.y;
        otherPlayerMesh.name = `player-${id}`; // Assign a unique name for easy retrieval/removal
        scene.add(otherPlayerMesh);
        otherPlayers.current[id] = otherPlayerMesh; // Store the mesh in our ref
        console.log(`Added existing player ${player.username} (${id})`);
      }
    });

    // Listener for 'playerConnected' event: a new player has joined the game
    socket.current.on('playerConnected', (playerData) => {
      if (playerData.id === socket.current.id) return; // Ensure we don't add ourselves twice

      const otherPlayerGeometry = new THREE.BoxGeometry(1, 1.8, 1);
      const otherPlayerMaterial = new THREE.MeshPhongMaterial({ color: new THREE.Color(playerData.color) });
      const otherPlayerMesh = new THREE.Mesh(otherPlayerGeometry, otherPlayerMaterial);
      otherPlayerMesh.position.set(playerData.position.x, playerData.position.y, playerData.position.z);
      otherPlayerMesh.rotation.y = playerData.rotation.y;
      otherPlayerMesh.name = `player-${playerData.id}`;
      scene.add(otherPlayerMesh);
      otherPlayers.current[playerData.id] = otherPlayerMesh;
      console.log(`Player connected: ${playerData.username} (${playerData.id})`);
    });

    // Listener for 'playerMoved' event: an existing player has moved
    socket.current.on('playerMoved', (playerData) => {
      const playerMesh = otherPlayers.current[playerData.id];
      if (playerMesh) {
        // Update the position and rotation of the corresponding player's mesh
        playerMesh.position.set(playerData.position.x, playerData.position.y, playerData.position.z);
        playerMesh.rotation.y = playerData.rotation.y;
      }
    });

    // Listener for 'playerDisconnected' event: a player has left the game
    socket.current.on('playerDisconnected', (playerId) => {
      const playerMesh = otherPlayers.current[playerId];
      if (playerMesh) {
        scene.remove(playerMesh); // Remove the 3D object from the scene
        // Dispose of geometry and material to free up memory
        if (playerMesh.geometry) playerMesh.geometry.dispose();
        if (playerMesh.material) playerMesh.material.dispose();
        delete otherPlayers.current[playerId]; // Remove from our tracking object
        console.log(`Player disconnected: ${playerId}`);
      }
    });

    // Listener for 'chatMessage' event: receives new chat messages
    socket.current.on('chatMessage', (messageData) => {
      setChatMessages((prevMessages) => [...prevMessages, messageData]); // Add new message to state
    });

    // Listener for socket disconnection
    socket.current.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });

    // --- User Input Handling ---
    const movementSpeed = 0.1;
    const rotationSpeed = 0.05;

    const onKeyDown = (event) => {
      keysPressed.current[event.key.toLowerCase()] = true;
    };

    const onKeyUp = (event) => {
      keysPressed.current[event.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    // --- Animation Loop (Game Loop) ---
    const animate = () => {
      animationFrameId.current = requestAnimationFrame(animate); // Request the next frame

      let moved = false; // Flag to check if the local player has moved
      // Store old position and rotation to check if an update is needed
      const oldPosition = playerRef.current.position.clone();
      const oldRotation = playerRef.current.rotation.y;

      // Update player position/rotation based on keys pressed
      if (keysPressed.current['w']) { // Forward
        playerRef.current.translateZ(-movementSpeed);
        moved = true;
      }
      if (keysPressed.current['s']) { // Backward
        playerRef.current.translateZ(movementSpeed);
        moved = true;
      }
      if (keysPressed.current['a']) { // Strafe Left
        playerRef.current.translateX(-movementSpeed);
        moved = true;
      }
      if (keysPressed.current['d']) { // Strafe Right
        playerRef.current.translateX(movementSpeed);
        moved = true;
      }
      if (keysPressed.current['q']) { // Rotate Left
        playerRef.current.rotation.y += rotationSpeed;
        moved = true;
      }
      if (keysPressed.current['e']) { // Rotate Right
        playerRef.current.rotation.y -= rotationSpeed;
        moved = true;
      }

      // If the local player moved or rotated, emit their new state to the server
      if (moved) {
        socket.current.emit('playerMovement', {
          position: playerRef.current.position,
          rotation: { y: playerRef.current.rotation.y }
        });
      }

      // Make the camera follow the player in a third-person perspective
      camera.position.x = playerRef.current.position.x;
      camera.position.z = playerRef.current.position.z + 5; // Stay 5 units behind
      camera.position.y = playerRef.current.position.y + 3; // Stay 3 units above
      camera.lookAt(playerRef.current.position); // Make camera look at the player

      renderer.render(scene, camera); // Render the scene for the current frame
    };

    animate(); // Start the animation loop

    // Handle window resizing
    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onWindowResize);

    // --- Cleanup Function ---
    // This runs when the component unmounts to prevent memory leaks and stop processes.
    return () => {
      cancelAnimationFrame(animationFrameId.current); // Stop the animation loop
      window.removeEventListener('resize', onWindowResize);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);

      // Remove the renderer's canvas from the DOM
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      // Dispose of Three.js resources
      renderer.dispose();
      groundGeometry.dispose();
      groundMaterial.dispose();
      playerGeometry.dispose();
      playerMaterial.dispose();
      scene.remove(playerRef.current);

      // Clean up other players' meshes
      for (const id in otherPlayers.current) {
        const mesh = otherPlayers.current[id];
        if (mesh) {
          scene.remove(mesh);
          if (mesh.geometry) mesh.geometry.dispose();
          if (mesh.material) mesh.material.dispose();
        }
      }
      otherPlayers.current = {}; // Clear the ref

      // Disconnect the Socket.IO client
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, [username]); // The effect reruns if `username` changes to update socket with the correct username

  // Function to send chat messages from the ChatBox component
  const sendChatMessage = (message) => {
    if (socket.current && socket.current.connected && message.trim()) {
      // Emit 'chatMessage' event with sender's username and the message content
      socket.current.emit('chatMessage', { sender: username, message: message.trim() });
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <div ref={mountRef} className="absolute inset-0"></div> {/* Three.js canvas will render here */}

      {/* Top-right UI for user info and logout */}
      <div className="absolute top-4 right-4 bg-gray-800 p-3 rounded-lg shadow-md flex items-center space-x-2 z-10">
        <span className="text-sm font-medium text-gray-300">Welcome, {username}!</span>
        <button
          onClick={onLogout}
          className="bg-red-600 hover:bg-red-700 text-white text-sm font-bold py-1 px-3 rounded-md transition duration-300 ease-in-out"
        >
          Logout
        </button>
      </div>

      {/* Bottom-center info overlay */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-gray-800 p-4 rounded-xl shadow-lg w-11/12 max-w-xl flex flex-col items-center z-10">
        <h3 className="text-xl font-semibold mb-2 text-blue-400">Welcome to your Metaverse!</h3>
        <p className="text-sm text-gray-400 text-center">
          Use **W, A, S, D** for movement and **Q, E** for rotation.
        </p>
      </div>

      {/* ChatBox Component - handles chat display and input */}
      <ChatBox messages={chatMessages} onSendMessage={sendChatMessage} />
    </div>
  );
}

export default GameCanvas;