// frontend/src/pages/RegisterPage.js
// This component handles user registration.
import React, { useState } from 'react';
import { registerUser } from '../services/auth'; // Import registration service

function RegisterPage({ onRegistrationSuccess, onNavigateToLogin }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  // Handle form submission for registration
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // This should explicitly call registerUser
      const data = await registerUser(username, email, password); // Call registration service
      setMessage(data.msg + ' Please log in.'); // Display success message from registration
      setTimeout(() => onRegistrationSuccess(), 2000); // Redirect to login after 2 seconds
    } catch (error) {
      setMessage(error.response?.data?.msg || 'Registration failed.'); // Display appropriate error
    }
  };

  return (
    <div className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md">
      <h2 className="text-3xl font-bold text-center mb-6 text-indigo-400">Register</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-1" htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            aria-label="Username"
          />
        </div>
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-1" htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            aria-label="Email"
          />
        </div>
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-1" htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            aria-label="Password"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-md"
        >
          Register
        </button>
      </form>
      {message && <p className="mt-4 text-center text-sm text-yellow-400">{message}</p>}
      <p className="mt-6 text-center text-gray-400">
        Already have an account?{' '}
        <button
          onClick={onNavigateToLogin}
          className="text-indigo-400 hover:underline focus:outline-none"
        >
          Login
        </button>
      </p>
    </div>
  );
}

export default RegisterPage;