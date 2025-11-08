import React, { useState } from 'react'

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null))
  const [isPlayerTurn, setIsPlayerTurn] = useState(true)
  const [winner, setWinner] = useState(null)
  const [scores, setScores] = useState({ player: 0, ai: 0 })

  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ]
    
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i]
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a]
      }
    }
    return null
  }

  const handleClick = (index) => {
    if (board[index] || winner || !isPlayerTurn) return

    const newBoard = [...board]
    newBoard[index] = 'X'
    setBoard(newBoard)

    const gameWinner = calculateWinner(newBoard)
    if (gameWinner) {
      setWinner(gameWinner)
      if (gameWinner === 'X') {
        setScores(prev => ({ ...prev, player: prev.player + 1 }))
      }
    } else if (!newBoard.includes(null)) {
      setWinner('draw')
    } else {
      setIsPlayerTurn(false)
      setTimeout(() => makeAIMove(newBoard), 500)
    }
  }

  const makeAIMove = (currentBoard) => {
    const emptySquares = currentBoard
      .map((square, index) => square === null ? index : null)
      .filter(val => val !== null)

    if (emptySquares.length === 0) return

    const randomIndex = Math.floor(Math.random() * emptySquares.length)
    const aiMove = emptySquares[randomIndex]

    const newBoard = [...currentBoard]
    newBoard[aiMove] = 'O'
    setBoard(newBoard)
    setIsPlayerTurn(true)

    const gameWinner = calculateWinner(newBoard)
    if (gameWinner) {
      setWinner(gameWinner)
      if (gameWinner === 'O') {
        setScores(prev => ({ ...prev, ai: prev.ai + 1 }))
      }
    } else if (!newBoard.includes(null)) {
      setWinner('draw')
    }
  }

  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setWinner(null)
    setIsPlayerTurn(true)
  }
const renderSquare = (index) => {
  const isWinningSquare = winner && calculateWinner(board) === board[index]
  
  return (
    <button
      className={`
        w-24 h-24 text-5xl font-bold transition-all duration-300 
        ${!board[index] && !winner && isPlayerTurn 
          ? 'hover:translate-y-[-5px] hover:shadow-2xl cursor-pointer' 
          : 'cursor-not-allowed'
        }
        ${board[index] === 'X' ? 'text-red-400' : 'text-blue-400'}
        ${isWinningSquare ? 'bg-yellow-400 shadow-2xl scale-105' : 'bg-slate-700'}
        
        /* 3D Effects */
        border-2 border-slate-600
        rounded-lg
        shadow-lg
        transform
        perspective-1000
        preserve-3d
        
        /* Inner shadow for depth */
        shadow-inner
        
        flex items-center justify-center
        relative
        overflow-hidden
      `}
      onClick={() => handleClick(index)}
      disabled={!!board[index] || !!winner || !isPlayerTurn}
    >
      {/* 3D Bevel Effect */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
      
      {/* Bottom shadow for 3D effect */}
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-t from-black/30 to-transparent rounded-b-lg pointer-events-none" />
      
      {/* Top highlight */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-white/10 rounded-t-lg pointer-events-none" />
      
      {/* Content with depth */}
      <span className="relative z-10 drop-shadow-lg transform translate-z-10">
        {board[index]}
      </span>

      {/* Hover glow effect */}
      {!board[index] && !winner && isPlayerTurn && (
        <div className="absolute inset-0 bg-blue-500/10 rounded-lg pointer-events-none" />
      )}
    </button>
  )
}
  return (
    <div className="text-center max-w-2xl mx-auto">
      {/* Header */}
      <div className="glass-effect rounded-2xl p-6 mb-8">
        <h2 className="text-4xl font-bold text-white mb-2">⭕ Tic-Tac-Toe 🎮</h2>
        <p className="text-white/80">Play against AI</p>
        
        {/* Score Board */}
        <div className="flex justify-center space-x-8 mt-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-400">YOU</div>
            <div className="text-3xl font-bold text-white">{scores.player}</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-400">VS</div>
            <div className="text-xl text-white/70">Score</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">AI</div>
            <div className="text-3xl font-bold text-white">{scores.ai}</div>
          </div>
        </div>
      </div>

      {/* Game Status */}
      <div className="glass-effect rounded-xl p-4 mb-6">
        <p className="text-white text-xl font-semibold">
          {winner ? (
            winner === 'draw' ? (
              <span className="text-yellow-400">🤝 It's a draw!</span>
            ) : winner === 'X' ? (
              <span className="text-green-400">🎉 You win!</span>
            ) : (
              <span className="text-red-400">🤖 AI wins!</span>
            )
          ) : isPlayerTurn ? (
            <span className="text-black-400">✅ Your turn (X)</span>
          ) : (
            <span className="text-purple-400">🤔 AI thinking...</span>
          )}
        </p>
      </div>

      {/* Game Board */}
      <div className="glass-effect rounded-2xl p-8 mb-8">
        <div className="grid grid-cols-3 gap-3 w-80 mx-auto">
          {[0, 1, 2].map(row => (
            <React.Fragment key={row}>
              {[0, 1, 2].map(col => renderSquare(row * 3 + col))}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={resetGame}
          className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          🔄 New Game
        </button>
        
        <button
          onClick={() => {
            resetGame()
            setScores({ player: 0, ai: 0 })
          }}
          className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-6 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          🏁 Reset Score
        </button>
      </div>

      {/* Game Instructions */}
      <div className="glass-effect rounded-xl p-4 mt-8">
        <h3 className="text-white font-bold mb-2">How to Play:</h3>
        <p className="text-white/70 text-sm">
          • Click on any empty square to place your <span className="text-red-400">X</span><br/>
          • Get 3 in a row (horizontal, vertical, or diagonal) to win<br/>
          • AI will automatically play <span className="text-blue-400">O</span> after your move
        </p>
      </div>
    </div>
  )
}

export default TicTacToe