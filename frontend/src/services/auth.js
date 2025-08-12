// frontend/src/services/auth.js
// This file contains functions for making API calls to your backend's authentication routes.
import axios from 'axios';

// Define your backend API URL. Make sure it matches your server.js port.
// In a real application, this would be an environment variable.
const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000/api/auth';

// Function to register a new user
export const registerUser = async (username, email, password) => {
  try {
    const response = await axios.post(`${API_URL}/register`, {
      username,
      email,
      password
    });
    return response.data; // Returns token and message
  } catch (error) {
    throw error; // Re-throw error for handling in the component
  }
};

// Function to log in a user
export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      email,
      password
    });
    return response.data; // Returns token and message
  } catch (error) {
    throw error; // Re-throw error
  }
};