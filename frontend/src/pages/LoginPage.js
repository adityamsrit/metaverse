// frontend/src/pages/LoginPage.js
// This component handles user login.
import React, { useState } from 'react';
import { loginUser } from '../services/auth'; // Import login service

function LoginPage({ onLoginSuccess, onNavigateToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  // Handle form submission for login
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // This should explicitly call loginUser
      const data = await loginUser(email, password); // Call login service
      setMessage(data.msg); // Display success message from login
      onLoginSuccess(data.token); // Pass token to parent component
    } catch (error) {
      // It's crucial to correctly handle errors and display them.
      // error.response?.data?.msg accesses the error message from the backend if available.
      setMessage(error.response?.data?.msg || 'Login failed. Please check your credentials.'); // Display appropriate error
    }
  };

  return (
    <div className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md">
      <h2 className="text-3xl font-bold text-center mb-6 text-indigo-400">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
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
          Login
        </button>
      </form>
      {message && <p className="mt-4 text-center text-sm text-yellow-400">{message}</p>}
      <p className="mt-6 text-center text-gray-400">
        Don't have an account?{' '}
        <button
          onClick={onNavigateToRegister}
          className="text-indigo-400 hover:underline focus:outline-none"
        >
          Register
        </button>
      </p>
    </div>
  );
}

export default LoginPage;