
import React, { useState, useEffect } from 'react'

const Chess = () => {
  const [board, setBoard] = useState(initializeBoard())
  const [selectedPiece, setSelectedPiece] = useState(null)
  const [currentPlayer, setCurrentPlayer] = useState('white')
  const [gameStatus, setGameStatus] = useState('Select game mode')
  const [aiThinking, setAiThinking] = useState(false)
  const [gameMode, setGameMode] = useState('select')
  const [aiDifficulty, setAiDifficulty] = useState('easy')
  const [validMoves, setValidMoves] = useState([])

  function initializeBoard() {
    const board = Array(8).fill(null).map(() => Array(8).fill(null))
    
    // Setup pawns
    for (let i = 0; i < 8; i++) {
      board[1][i] = { type: 'pawn', color: 'black' }
      board[6][i] = { type: 'pawn', color: 'white' }
    }
    
    // Setup other pieces
    const backRow = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook']
    for (let i = 0; i < 8; i++) {
      board[0][i] = { type: backRow[i], color: 'black' }
      board[7][i] = { type: backRow[i], color: 'white' }
    }
    
    return board
  }

  // Get valid moves for a piece
  const getValidMoves = (row, col, piece) => {
    const moves = []
    
    switch (piece.type) {
      case 'pawn':
        // Pawn moves
        const direction = piece.color === 'white' ? -1 : 1
        const startRow = piece.color === 'white' ? 6 : 1
        
        // Move forward
        if (isInBounds(row + direction, col) && !board[row + direction][col]) {
          moves.push({ row: row + direction, col })
          // Double move from starting position
          if (row === startRow && !board[row + 2 * direction][col]) {
            moves.push({ row: row + 2 * direction, col })
          }
        }
        
        // Captures
        for (let dc of [-1, 1]) {
          if (isInBounds(row + direction, col + dc)) {
            const target = board[row + direction][col + dc]
            if (target && target.color !== piece.color) {
              moves.push({ row: row + direction, col: col + dc })
            }
          }
        }
        break
        
      case 'knight':
        // Knight moves (L-shape)
        const knightMoves = [
          [-2, -1], [-2, 1], [-1, -2], [-1, 2],
          [1, -2], [1, 2], [2, -1], [2, 1]
        ]
        knightMoves.forEach(([dr, dc]) => {
          const newRow = row + dr
          const newCol = col + dc
          if (isInBounds(newRow, newCol)) {
            const target = board[newRow][newCol]
            if (!target || target.color !== piece.color) {
              moves.push({ row: newRow, col: newCol })
            }
          }
        })
        break
        
      case 'bishop':
        // Bishop moves (diagonals)
        const bishopDirections = [[-1, -1], [-1, 1], [1, -1], [1, 1]]
        bishopDirections.forEach(([dr, dc]) => {
          let r = row + dr
          let c = col + dc
          while (isInBounds(r, c)) {
            const target = board[r][c]
            if (!target) {
              moves.push({ row: r, col: c })
            } else {
              if (target.color !== piece.color) {
                moves.push({ row: r, col: c })
              }
              break
            }
            r += dr
            c += dc
          }
        })
        break
        
      case 'rook':
        // Rook moves (straight lines)
        const rookDirections = [[-1, 0], [1, 0], [0, -1], [0, 1]]
        rookDirections.forEach(([dr, dc]) => {
          let r = row + dr
          let c = col + dc
          while (isInBounds(r, c)) {
            const target = board[r][c]
            if (!target) {
              moves.push({ row: r, col: c })
            } else {
              if (target.color !== piece.color) {
                moves.push({ row: r, col: c })
              }
              break
            }
            r += dr
            c += dc
          }
        })
        break
        
      case 'queen':
        // Queen moves (bishop + rook)
        const queenDirections = [
          [-1, -1], [-1, 1], [1, -1], [1, 1],
          [-1, 0], [1, 0], [0, -1], [0, 1]
        ]
        queenDirections.forEach(([dr, dc]) => {
          let r = row + dr
          let c = col + dc
          while (isInBounds(r, c)) {
            const target = board[r][c]
            if (!target) {
              moves.push({ row: r, col: c })
            } else {
              if (target.color !== piece.color) {
                moves.push({ row: r, col: c })
              }
              break
            }
            r += dr
            c += dc
          }
        })
        break
        
      case 'king':
        // King moves (one square in any direction)
        const kingMoves = [
          [-1, -1], [-1, 0], [-1, 1],
          [0, -1], [0, 1],
          [1, -1], [1, 0], [1, 1]
        ]
        kingMoves.forEach(([dr, dc]) => {
          const newRow = row + dr
          const newCol = col + dc
          if (isInBounds(newRow, newCol)) {
            const target = board[newRow][newCol]
            if (!target || target.color !== piece.color) {
              moves.push({ row: newRow, col: newCol })
            }
          }
        })
        break
    }
    
    return moves
  }

  const isInBounds = (row, col) => {
    return row >= 0 && row < 8 && col >= 0 && col < 8
  }

  // AI makes a move
  const makeAIMove = () => {
    setAiThinking(true)
    setGameStatus('AI thinking...')
    
    setTimeout(() => {
      const possibleMoves = []
      
      // Find all possible moves for black pieces with piece values
      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
          const piece = board[row][col]
          if (piece && piece.color === 'black') {
            const moves = getValidMoves(row, col, piece)
            moves.forEach(move => {
              const targetPiece = board[move.row][move.col]
              let score = 0
              
              // Piece values for smarter AI
              const pieceValues = {
                pawn: 1,
                knight: 3,
                bishop: 3,
                rook: 5,
                queen: 9,
                king: 0 // Don't capture king directly
              }
              
              // Add score for captures
              if (targetPiece) {
                score = pieceValues[targetPiece.type] || 0
              }
              
              // Prefer center control
              const centerBonus = (3.5 - Math.abs(move.row - 3.5)) + (3.5 - Math.abs(move.col - 3.5))
              score += centerBonus * 0.1
              
              possibleMoves.push({
                fromRow: row,
                fromCol: col,
                toRow: move.row,
                toCol: move.col,
                score: score
              })
            })
          }
        }
      }
      
      if (possibleMoves.length > 0) {
        // Choose move based on difficulty
        let selectedMove
        if (aiDifficulty === 'easy') {
          // Random but prefer captures
          const capturingMoves = possibleMoves.filter(move => move.score > 0)
          selectedMove = capturingMoves.length > 0 
            ? capturingMoves[Math.floor(Math.random() * capturingMoves.length)]
            : possibleMoves[Math.floor(Math.random() * possibleMoves.length)]
        } else {
          // Medium AI - choose best capture or random good move
          possibleMoves.sort((a, b) => b.score - a.score)
          const bestMoves = possibleMoves.slice(0, Math.max(3, Math.floor(possibleMoves.length * 0.3)))
          selectedMove = bestMoves[Math.floor(Math.random() * bestMoves.length)]
        }
        
        movePiece(selectedMove.fromRow, selectedMove.fromCol, selectedMove.toRow, selectedMove.toCol, true)
      }
      
      setAiThinking(false)
    }, aiDifficulty === 'easy' ? 800 : 1200)
  }

  // Check if it's AI's turn
  useEffect(() => {
    if (gameMode === 'pvai' && currentPlayer === 'black' && !aiThinking) {
      makeAIMove()
    }
  }, [currentPlayer, aiThinking, gameMode])

  const getPieceSymbol = (piece) => {
    if (!piece) return ''
    
    const symbols = {
      king: { white: '♔', black: '♚' },
      queen: { white: '♕', black: '♛' },
      rook: { white: '♖', black: '♜' },
      bishop: { white: '♗', black: '♝' },
      knight: { white: '♘', black: '♞' },
      pawn: { white: '♙', black: '♟' }
    }
    
    return symbols[piece.type]?.[piece.color] || ''
  }

  const handleSquareClick = (row, col) => {
    if (gameMode === 'select' || (gameMode === 'pvai' && currentPlayer === 'black') || aiThinking) return
    
    const clickedPiece = board[row][col]
    
    // If clicking on a piece of current player
    if (!selectedPiece && clickedPiece && clickedPiece.color === currentPlayer) {
      setSelectedPiece({ row, col, piece: clickedPiece })
      const moves = getValidMoves(row, col, clickedPiece)
      setValidMoves(moves)
      return
    }
    
    // If piece already selected
    if (selectedPiece) {
      // Check if the move is valid
      const isValid = validMoves.some(move => move.row === row && move.col === col)
      
      if (isValid) {
        movePiece(selectedPiece.row, selectedPiece.col, row, col)
      }
      
      // Always clear selection after click
      setSelectedPiece(null)
      setValidMoves([])
    }
  }

  const movePiece = (fromRow, fromCol, toRow, toCol, isAIMove = false) => {
    const newBoard = [...board.map(row => [...row])]
    const movingPiece = newBoard[fromRow][fromCol]
    
    // Move the piece
    newBoard[toRow][toCol] = movingPiece
    newBoard[fromRow][fromCol] = null
    
    setBoard(newBoard)
    
    // Switch player
    const nextPlayer = currentPlayer === 'white' ? 'black' : 'white'
    setCurrentPlayer(nextPlayer)
    
    if (gameMode === 'pvp') {
      setGameStatus(`${nextPlayer.charAt(0).toUpperCase() + nextPlayer.slice(1)} to move`)
    } else {
      setGameStatus(nextPlayer === 'white' ? 'Your turn (White)' : 'AI thinking...')
    }
  }

  const startGame = (mode) => {
    setGameMode(mode)
    setCurrentPlayer('white')
    setGameStatus(mode === 'pvp' ? 'White to move' : 'Your turn (White)')
    setSelectedPiece(null)
    setValidMoves([])
  }

  const resetGame = () => {
    setBoard(initializeBoard())
    setSelectedPiece(null)
    setCurrentPlayer('white')
    setGameMode('select')
    setGameStatus('Select game mode')
    setAiThinking(false)
    setValidMoves([])
  }

  const renderSquare = (row, col) => {
    const piece = board[row][col]
    const isSelected = selectedPiece && selectedPiece.row === row && selectedPiece.col === col
    const isValidMove = validMoves.some(move => move.row === row && move.col === col)
    const isLight = (row + col) % 2 === 0
    
    return (
      <div
        key={`${row}-${col}`}
        className={`
          w-12 h-12 md:w-16 md:h-16 flex items-center justify-center
          ${isLight ? 'bg-amber-200' : 'bg-amber-800'}
          ${isSelected ? 'ring-4 ring-blue-500 ring-inset' : ''}
          ${isValidMove ? 'ring-4 ring-green-500 ring-inset' : ''}
          ${piece && gameMode !== 'select' ? 'cursor-pointer' : 'cursor-default'}
          transition-all duration-200
          border border-amber-300
          relative
          shadow-md
          hover:shadow-lg
        `}
        onClick={() => handleSquareClick(row, col)}
      >
        <div className={`absolute inset-0 rounded-sm ${
          isLight 
            ? 'bg-gradient-to-br from-amber-100 to-amber-300' 
            : 'bg-gradient-to-br from-amber-700 to-amber-900'
        }`} />
        
        {/* Valid move indicator */}
        {isValidMove && !piece && (
          <div className="absolute inset-2 bg-green-500/30 rounded-full"></div>
        )}
        
        {piece && (
          <span className={`
            text-2xl md:text-3xl font-bold relative z-10
            ${piece.color === 'white' ? 'text-white drop-shadow-lg' : 'text-gray-900'}
            transform transition-transform duration-200
            ${gameMode !== 'select' ? 'hover:scale-110' : ''}
          `}>
            {getPieceSymbol(piece)}
          </span>
        )}
        
        <div className="absolute bottom-0 right-1 text-xs opacity-50 text-gray-700">
          {String.fromCharCode(97 + col)}{8 - row}
        </div>
      </div>
    )
  }

  // Game Mode Selection Screen
  if (gameMode === 'select') {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-4xl mx-auto">
          <div className="glass-effect rounded-2xl p-8 text-center">
            <h2 className="text-4xl font-bold text-white mb-4">♟️ Chess Master</h2>
            <p className="text-white/80 mb-8">Choose your game mode</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <div 
                className="glass-effect rounded-2xl p-6 cursor-pointer transform hover:scale-105 transition duration-300"
                onClick={() => startGame('pvp')}
              >
                <div className="text-5xl mb-4">👥</div>
                <h3 className="text-2xl font-bold text-white mb-2">Player vs Player</h3>
                <p className="text-white/70">Play with a friend locally</p>
              </div>
              
              <div 
                className="glass-effect rounded-2xl p-6 cursor-pointer transform hover:scale-105 transition duration-300"
                onClick={() => startGame('pvai')}
              >
                <div className="text-5xl mb-4">🤖</div>
                <h3 className="text-2xl font-bold text-white mb-2">Player vs AI</h3>
                <p className="text-white/70">Challenge the computer</p>
                
                <div className="mt-4 space-y-2">
                  <label className="text-white text-sm">AI Difficulty:</label>
                  <select 
                    value={aiDifficulty}
                    onChange={(e) => setAiDifficulty(e.target.value)}
                    className="w-full p-2 rounded bg-white/20 text-white border border-white/30"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <div className="glass-effect rounded-2xl p-6 mb-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-2">♟️ Chess Master</h2>
          <p className="text-white/80 mb-4">
            {gameMode === 'pvp' ? 'Player vs Player' : 'Player vs AI'}
          </p>
          
          <div className="bg-white/10 rounded-lg p-4 inline-block">
            <p className="text-white text-xl font-semibold">
              {aiThinking ? '🤖 AI thinking...' : gameStatus}
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <div className="glass-effect rounded-2xl p-6">
              <div className="bg-amber-900 p-4 rounded-xl shadow-2xl inline-block">
                <div className="border-4 border-amber-700 rounded-lg p-2 bg-amber-600">
                  {board.map((row, rowIndex) => (
                    <div key={rowIndex} className="flex">
                      <div className="w-6 md:w-8 flex items-center justify-center text-white font-bold">
                        {8 - rowIndex}
                      </div>
                      {row.map((_, colIndex) => renderSquare(rowIndex, colIndex))}
                    </div>
                  ))}
                  <div className="flex pl-6 md:pl-8">
                    {['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].map(letter => (
                      <div key={letter} className="w-12 h-6 md:w-16 flex items-center justify-center text-white font-bold">
                        {letter}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:w-80">
            <div className="glass-effect rounded-2xl p-6 space-y-6">
              <div className="text-center">
                <h3 className="text-white font-bold mb-2">Game Mode</h3>
                <div className="text-white bg-blue-600 py-2 rounded-lg">
                  {gameMode === 'pvp' ? '👥 PvP' : '🤖 vs AI'}
                </div>
                {gameMode === 'pvai' && (
                  <p className="text-white/70 text-sm mt-1">Difficulty: {aiDifficulty}</p>
                )}
              </div>

              <div className="text-center">
                <h3 className="text-white font-bold mb-2">Current Turn</h3>
                <div className={`text-2xl font-bold ${
                  currentPlayer === 'white' ? 'text-white bg-gray-700' : 'text-gray-800 bg-gray-300'
                } py-2 rounded-lg`}>
                  {currentPlayer === 'white' ? '⚪ White' : '⚫ Black'}
                  {gameMode === 'pvai' && currentPlayer === 'black' && ' (AI)'}
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={resetGame}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition duration-200"
                >
                  🔄 New Game
                </button>
                <button
                  onClick={() => setGameMode('select')}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold transition duration-200"
                >
                  ⚙️ Change Mode
                </button>
              </div>

              <div className="bg-white/10 rounded-lg p-4">
                <h4 className="text-white font-bold mb-2">Chess Rules:</h4>
                <ul className="text-white/70 text-sm space-y-1">
                  <li>• Click piece to see valid moves (green)</li>
                  <li>• Pawns move forward, capture diagonally</li>
                  <li>• Knights move in L-shape</li>
                  <li>• {gameMode === 'pvp' ? 'Take turns' : 'AI plays as Black'}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Chess