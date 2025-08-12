
// frontend/src/App.js
// This is the main component of your React application, handling routing for different pages.
import React, { useState, useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import GameCanvas from './pages/GameCanvas';

function App() {
  const [currentPage, setCurrentPage] = useState('login'); // State to manage current page view
  const [token, setToken] = useState(localStorage.getItem('token')); // Get token from local storage

  // Effect to check token and redirect to game if logged in
  useEffect(() => {
    if (token) {
      setCurrentPage('game');
    }
  }, [token]);

  // Function to handle successful login, storing token and navigating to game
  const handleLoginSuccess = (newToken) => {
    setToken(newToken);
    localStorage.setItem('token', newToken); // Store token in local storage
    setCurrentPage('game');
  };

  // Function to handle logout, clearing token and navigating to login
  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('token');
    setCurrentPage('login');
  };

  // Render different components based on currentPage state
  let content;
  switch (currentPage) {
    case 'login':
      content = <LoginPage onLoginSuccess={handleLoginSuccess} onNavigateToRegister={() => setCurrentPage('register')} />;
      break;
    case 'register':
      content = <RegisterPage onRegistrationSuccess={() => setCurrentPage('login')} onNavigateToLogin={() => setCurrentPage('login')} />;
      break;
    case 'game':
      content = <GameCanvas token={token} onLogout={handleLogout} />;
      break;
    default:
      content = <LoginPage onLoginSuccess={handleLoginSuccess} onNavigateToRegister={() => setCurrentPage('register')} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      {content}
    </div>
  );
}

export default App;