import React, { useState } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import ScratchCardPage from './ScratchCardPage';
//import ScratchCardShare from './ScratchCard';
import ScratchCard from './ScratchCard';
import LoginPage from './LoginPage';
import './App.css';

function AppRoutes({ isAuthenticated, setIsAuthenticated }) {
  const location = useLocation();
  
  // Public route for viewing shared scratch cards
  if (location.pathname.startsWith('/scratch-card/')) {
    return (
      <Routes>
        {/* Public Route: Accessible to Everyone */}        
        <Route path="/scratch-card/:id" element={<ScratchCard />} />        
      </Routes>
    );
  }

  return (
    <Routes>
      {/* Protected Routes */}
      <Route
        path="/"
        element={isAuthenticated ? <ScratchCardPage /> : <Navigate to="/login" />}
      />
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" /> : <LoginPage onLogin={() => setIsAuthenticated(true)} />}
      />
      {/* Catch-All Route */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <div className="App">
      <AppRoutes
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
      />
    </div>
  );
}

export default App;
