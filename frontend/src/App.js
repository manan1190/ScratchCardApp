import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ScratchCardPage from './ScratchCardPage';
//import ScratchCardShare from './ScratchCard';
import ScratchCard from './ScratchCard';
import LoginPage from './LoginPage';
import HomePage from './HomePage';
import PrivateRoute from './PrivateRoute';
import './App.css';

function AppRoutes({ isAuthenticated, setIsAuthenticated }) {  
  
  return (    
    <Routes>      
        {/* Public Route: Accessible to Everyone */}        
        <Route path="/" element={<HomePage />} />
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage onLogin={() => setIsAuthenticated(true)} />}
        />
        <Route path="/scratch-card/:id" element={<ScratchCard />} />        

      {/* Protected Routes */}
      <Route element={<PrivateRoute isAuthenticated={isAuthenticated} />}>
        <Route
          path="/dashboard"
          element={<ScratchCardPage />} 
        />
      </Route>

      {/* Catch-All Route */}
      {/* Redirect unknown routes */}
      <Route path="*" element={<HomePage />} />
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
