
import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import TicTacToe from './games/TicTacToe'
import Chess from './games/Chess'
import Ludo from './games/Ludo'

const GameInterface = () => {
  const { gameId } = useParams()
  const navigate = useNavigate()

  const gameComponents = {
    'tic-tac-toe': <TicTacToe />,
    // 'chess': <Chess />,
    // 'ludo': <Ludo />
  }

  return (
    <div className="min-h-screen fantasy-bg p-6">
      <div className="glass-effect rounded-2xl p-6">
        <button 
          onClick={() => navigate('/dashboard')}
          className="mb-4 text-white hover:text-yellow-400 transition duration-200"
        >
          ← Back to Dashboard
        </button>
        
        {gameComponents[gameId] || (
          <div className="text-center text-white">
            <h2 className="text-2xl font-bold">Game Not Found</h2>
            <p>Select a game from the dashboard</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default GameInterface