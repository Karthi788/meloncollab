import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Homepage from './pages/Homepage';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Meeting from './pages/Meeting';
import JoinMeeting from './pages/JoinMeeting';
import WaitingRoom from './pages/WaitingRoom';
import { AuthProvider } from './context/AuthContext';

const App = () => {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-white">
        <Navbar />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/meeting/:roomId?" element={<Meeting />} />
          <Route path="/meeting/join/:roomId" element={<JoinMeeting />} />
          <Route path="/meeting/:roomId/waiting" element={<WaitingRoom />} />
        </Routes>
      </div>
    </AuthProvider>
  );
};

export default App;