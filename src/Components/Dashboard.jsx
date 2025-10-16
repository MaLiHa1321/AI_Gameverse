import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Dashboard = ({ user }) => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('npcs') 

  const fakeNPCs = [
    {
      id: '1',
      name: 'Eldrin the Wise',
      title: 'Ancient Wizard',
      avatar: '🧙',
      personality: 'Wise and mysterious',
      backstory: 'A 500-year-old wizard',
      location: 'Mystic Tower',
      mood: 'contemplative',
      level: 5,
      relationship: 75
    },
    {
      id: '2',
      name: 'Seraphina',
      title: 'Forest Guardian', 
      avatar: '🌿',
      personality: 'Playful and protective',
      backstory: 'Spirit of the ancient forest',
      location: 'Whispering Woods',
      mood: 'curious',
      level: 3,
      relationship: 60
    }
  ]

  // Games Data
  const games = [
    {
      id: 'tic-tac-toe',
      name: 'Tic-Tac-Toe',
      avatar: '⭕',
      description: 'Classic 3-in-a-row game',
      players: '1 vs AI',
      difficulty: 'Easy'
    },
    {
      id: 'chess',
      name: 'Chess',
      avatar: '♟️',
      description: 'Strategic board game',
      players: '1 vs AI', 
      difficulty: 'Hard'
    },
    {
      id: 'ludo',
      name: 'Ludo',
      avatar: '🎲',
      description: 'Dice-based race game',
      players: '1-4 players',
      difficulty: 'Medium'
    }
  ]

  return (
    <div className="min-h-screen p-6 fantasy-bg">
      {/* Header */}
      <div className="glass-effect rounded-2xl p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">🧙 AI GameVerse</h1>
            <p className="text-white/80">Welcome, {user?.username}!</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mt-4">
          <button
            onClick={() => setActiveTab('npcs')}
            className={`px-6 py-3 rounded-lg font-semibold transition duration-200 ${
              activeTab === 'npcs' 
                ? 'bg-purple-600 text-white' 
                : 'bg-white/20 text-white/80 hover:bg-white/30'
            }`}
          >
            🧙 NPC Conversations
          </button>
          <button
            onClick={() => setActiveTab('games')}
            className={`px-6 py-3 rounded-lg font-semibold transition duration-200 ${
              activeTab === 'games' 
                ? 'bg-green-600 text-white' 
                : 'bg-white/20 text-white/80 hover:bg-white/30'
            }`}
          >
            🎮 Mini Games
          </button>
        </div>
      </div>

      {/* NPC Conversations Tab */}
      {activeTab === 'npcs' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {fakeNPCs.map((npc) => (
            <div 
              key={npc.id}
              className="glass-effect rounded-2xl p-6 cursor-pointer transform hover:scale-105 transition duration-300"
              onClick={() => navigate(`/chat/${npc.id}`)}
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="text-4xl">{npc.avatar}</div>
                <div>
                  <h3 className="text-xl font-bold text-white">{npc.name}</h3>
                  <p className="text-yellow-400">{npc.title}</p>
                </div>
              </div>
              <p className="text-white/80 text-sm mb-4">{npc.backstory.substring(0, 100)}...</p>
              <div className="flex justify-between text-sm">
                <span className="text-white/70">📍 {npc.location}</span>
                <span className="text-yellow-400">Level {npc.level}</span>
              </div>
              <button className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition duration-200">
                Start Conversation →
              </button>
            </div>
          ))}
          
          {/* Create NPC Button */}
          <div 
            className="glass-effect rounded-2xl p-6 cursor-pointer border-2 border-dashed border-white/30 hover:border-white/50 transition duration-300 flex flex-col items-center justify-center"
            onClick={() => navigate('/create-npc')}
          >
            <div className="text-4xl mb-4">➕</div>
            <h3 className="text-xl font-bold text-white text-center">Create New NPC</h3>
            <p className="text-white/70 text-center mt-2">Design your own character</p>
          </div>
        </div>
      )}

      {/* Mini Games Tab */}
      {activeTab === 'games' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            <div 
              key={game.id}
              className="glass-effect rounded-2xl p-6 cursor-pointer transform hover:scale-105 transition duration-300"
              onClick={() => navigate(`/game/${game.id}`)}
            >
              <div className="text-center">
                <div className="text-5xl mb-4">{game.avatar}</div>
                <h3 className="text-2xl font-bold text-white mb-2">{game.name}</h3>
                <p className="text-white/80 mb-4">{game.description}</p>
                
                <div className="flex justify-between text-sm mb-4">
                  <span className="text-white/70">👥 {game.players}</span>
                  <span className={`px-2 py-1 rounded ${
                    game.difficulty === 'Easy' ? 'bg-green-500' :
                    game.difficulty === 'Medium' ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}>
                    {game.difficulty}
                  </span>
                </div>
                
                <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition duration-200">
                  Play Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Dashboard