import React, { useState } from 'react';
import Dashboard from './Dashboard'; // Rename your current App.jsx to Dashboard.jsx
import Login from './Login';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return isLoggedIn ? <Dashboard /> : <Login onLogin={handleLogin} />;
};

export default App;