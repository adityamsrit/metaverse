🌐 Interactive Multiplayer Metaverse Environment
Welcome to the Interactive Multiplayer Metaverse Environment – a full-stack, real-time 3D web application designed to demonstrate the core components of a virtual world. Built with the MERN stack (MongoDB, Express.js, React, Node.js), Three.js, and Socket.IO, this project allows users to register, log in, navigate a shared 3D space, customize their avatars, place persistent objects, and communicate via in-game chat.

✨ Features
User Authentication: Secure registration and login system with JWT for session management.

Real-time Multiplayer:

Synchronized player movement across all connected clients.

Dynamic appearance and removal of other players' avatars as they connect/disconnect.

In-Game Chat: Real-time messaging system for communication between players.

3D Environment: A basic yet interactive 3D world built with Three.js, featuring a ground plane and dynamic objects.

Avatar Customization: Users can personalize their avatar's body and head colors, with changes reflecting in real-time for all other players and persisting across sessions.

Persistent World Objects: Users can "place" objects (e.g., cubes) in the 3D world that persist across server restarts and are visible/interactable by all players. Objects can also be moved in real-time.

🛠️ Technologies Used
Backend (Node.js/Express.js)
Node.js: JavaScript runtime environment.

Express.js: Web application framework for building RESTful APIs.

MongoDB: NoSQL database for flexible data storage (users, game objects).

Mongoose: ODM (Object Data Modeling) library for MongoDB and Node.js.

Socket.IO: Enables real-time, bidirectional, event-based communication.

JSON Web Tokens (JWT): For secure user authentication and authorization.

Bcrypt.js: For hashing passwords securely.

Dotenv: For managing environment variables.

CORS: Middleware for enabling Cross-Origin Resource Sharing.

Nodemon: Development utility for automatic server restarts.

Frontend (React.js)
React.js: JavaScript library for building user interfaces.

Three.js: JavaScript 3D library for rendering the 3D environment and objects.

Socket.IO-client: Client-side library for Socket.IO real-time communication.

Axios: Promise-based HTTP client for making API requests to the backend.

Tailwind CSS: Utility-first CSS framework for rapid UI development and styling.

🚀 Getting Started
Follow these instructions to set up and run the project locally on your machine.

Prerequisites
Node.js and npm (or Yarn): Ensure you have Node.js (v14 or higher recommended) and npm (comes with Node.js) installed.

MongoDB:

Local Installation: Download and install MongoDB Community Server. Ensure the MongoDB service is running (you can check/start it via Windows Services on Windows).

MongoDB Atlas (Cloud): Alternatively, you can use a free tier cluster from MongoDB Atlas. You'll need to update your MONGO_URI accordingly.

Installation
Clone the repository:

git clone https://github.com/adityamsrit/metaverse-project.git # Replace with your actual repo URL
cd metaverse-project

Backend Setup:
Navigate into the backend directory, install dependencies, and create your .env file.

cd backend
npm install

Create a .env file in the backend directory with the following content:

MONGO_URI="mongodb://localhost:27017/metaverse_game" # Or your MongoDB Atlas URI
JWT_SECRET="YOUR_VERY_STRONG_RANDOM_SECRET_KEY" # Generate a strong random key!
FRONTEND_URL="http://localhost:3000" # Or your deployed frontend URL

(Remember to replace YOUR_VERY_STRONG_RANDOM_SECRET_KEY with a unique, strong string.)

Frontend Setup:
Navigate into the frontend directory and install dependencies.

cd ../frontend # Go back to root and then into frontend
npm install

If you're using a deployed backend later, you'll update REACT_APP_BACKEND_URL in your deployment environment variables or a .env.development/.env.production file:

# frontend/.env.development (for local development)
REACT_APP_BACKEND_URL=http://localhost:5000

Running the Project
You will need two separate terminal windows for the backend and frontend.

Start the Backend Server:
In your first terminal, navigate to the backend directory and run:

cd backend
npm run dev

You should see messages indicating the server is running on port 5000 and connected to MongoDB.

Start the Frontend Application:
In your second terminal, navigate to the frontend directory and run:

cd frontend
npm start

This will compile the React app and open it in your web browser, typically at http://localhost:3000.

🎮 How to Play
Register/Login: Access the frontend in your browser. Create a new account or log in with existing credentials.

Navigate: Use W, A, S, D for movement and Q, E for rotation in the 3D world.

Multiplayer: Open multiple browser tabs/windows and log in with different accounts (or the same account for quick testing) to see other avatars move in real-time.

Chat: Use the chat box in the bottom-left to send messages to all connected players.

Customize Avatar: Click "Customize Avatar" in the top-right to change your avatar's colors. Changes will apply immediately and sync across all clients.

Place Objects: Click "Place Cube" to add persistent 3D objects to the world. They will appear for everyone and remain even after server restarts. You can also "Move Random Object" to observe real-time object synchronization
