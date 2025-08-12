
// frontend/src/components/ChatBox.js
// A new component for the in-game chat interface.
import React, { useState, useEffect, useRef } from 'react';

function ChatBox({ messages, onSendMessage }) {
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null); // Ref to scroll to the latest message

  // Scroll to the bottom of the chat messages whenever a new message arrives
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      onSendMessage(inputMessage);
      setInputMessage(''); // Clear input after sending
    }
  };

  return (
    <div className="absolute bottom-4 left-4 bg-gray-800 p-4 rounded-xl shadow-lg w-full max-w-sm flex flex-col z-10">
      <h3 className="text-xl font-semibold mb-2 text-green-400">Chat</h3>
      <div className="flex-grow bg-gray-700 rounded-lg p-3 overflow-y-auto mb-3 h-40 custom-scrollbar"> {/* Fixed height for scroll */}
        {messages.length === 0 ? (
          <p className="text-gray-400 text-sm">No messages yet. Say hello!</p>
        ) : (
          messages.map((msg, index) => (
            <p key={index} className="text-sm text-gray-200 mb-1">
              {/* Display sender's name with potentially distinct color */}
              <span className="font-semibold" style={{ color: msg.color || '#fff' }}>{msg.sender}:</span> {msg.message}
            </p>
          ))
        )}
        <div ref={messagesEndRef} /> {/* Dummy div to scroll into view */}
      </div>
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <input
          type="text"
          className="flex-grow px-3 py-2 rounded-lg bg-gray-600 border border-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 text-white"
          placeholder="Type your message..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          aria-label="Chat input"
        />
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-md"
        >
          Send
        </button>
      </form>
      <style>{`
        /* Custom scrollbar for chat messages */
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #333;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #555;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #777;
        }
      `}</style>
    </div>
  );
}

export default ChatBox;