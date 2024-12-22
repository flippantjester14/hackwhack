import React, { useState } from "react";
import Dashboard from "./Dashboard";
import Login from "./Login";
import Chatbot from "./Chatbot"; // Correct import for ChatBot

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status
  const [showChatBot, setShowChatBot] = useState(false); // State for ChatBot visibility

  // Handle login action
  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  // Handle logout action
  const handleLogout = () => {
    setIsLoggedIn(false);
    setShowChatBot(false); // Hide chatbot when logging out
  };

  return (
    <>
      {isLoggedIn ? (
        <div>
          {/* Dashboard Component */}
          <Dashboard
            onLogout={handleLogout} // Pass logout handler to Dashboard
            onChatBotToggle={() => setShowChatBot(!showChatBot)} // Pass ChatBot toggle handler
          />
          {/* Render Chatbot when toggled */}
          {showChatBot && <Chatbot onClose={() => setShowChatBot(false)} />} 
        </div>
      ) : (
        // Render Login Component
        <Login onLogin={handleLogin} />
      )}
    </>
  );
};

export default App;
