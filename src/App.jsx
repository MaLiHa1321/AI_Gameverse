import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Components/Login';
import ChatInterface from './Components/ChatInterface';
import NPCCreator from './Components/NPCCreator';
import Dashboard from './Components/Dashboard';
import GameInterface from './Components/GameInterface';


function App() {
  const [user, setUser] = useState(null)

  return (
    <div className="min-h-screen fantasy-bg">
      <Router>
        <Routes>
          <Route path="/" element={<Login setUser={setUser} />} />
          <Route path="/dashboard" element={<Dashboard user={user} />} />
          <Route path="/chat/:npcId" element={<ChatInterface user={user} />} />
          <Route path="/create-npc" element={<NPCCreator user={user} />} />
          <Route path="/game/:gameId" element={<GameInterface />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App;