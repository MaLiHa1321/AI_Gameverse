import React, { useState, useEffect } from 'react'

const Ludo = () => {
  const [gameState, setGameState] = useState('select')
  const [players, setPlayers] = useState([])
  const [currentPlayer, setCurrentPlayer] = useState(0)
  const [diceValue, setDiceValue] = useState(0)
  const [diceRolling, setDiceRolling] = useState(false)
  const [gameMode, setGameMode] = useState('pvp')
  const [aiThinking, setAiThinking] = useState(false)
  const [message, setMessage] = useState('Select game mode')
  const [selectedMode, setSelectedMode] = useState('') 

  // Board configuration
  const BOARD_SIZE = 15
  const CELL_SIZE = 24

  // Initialize game based on selected mode
  const initializeGame = (mode) => {
    let playerConfigs = []
    
    if (mode === '2player') {
      playerConfigs = [
        { color: 'red', isAI: false },
        { color: 'green', isAI: false }
      ]
    } else if (mode === '4player') {
      playerConfigs = [
        { color: 'red', isAI: false },
        { color: 'green', isAI: false },
        { color: 'blue', isAI: false },
        { color: 'yellow', isAI: false }
      ]
    } else if (mode === 'vsai') {
      playerConfigs = [
        { color: 'red', isAI: false },
        { color: 'green', isAI: true },
        { color: 'blue', isAI: true },
        { color: 'yellow', isAI: true }
      ]
    }

    const newPlayers = playerConfigs.map((config, index) => ({
      id: index,
      color: config.color,
      pieces: Array(4).fill().map((_, pieceIndex) => ({
        id: pieceIndex,
        position: 'home',
        trackPosition: -1,
        isSafe: true
      })),
      isAI: config.isAI,
      startPosition: getStartPosition(config.color),
      homePositions: getHomePositions(config.color)
    }))

    setPlayers(newPlayers)
    setCurrentPlayer(0)
    setDiceValue(0)
    setGameState('playing')
    setGameMode(mode)
    setSelectedMode(mode)
    setMessage(`${newPlayers[0].color.toUpperCase()} to roll dice`)
  }

  // Get start position based on color
  const getStartPosition = (color) => {
    const startPositions = {
      'red': 0,
      'green': 13,
      'blue': 26,
      'yellow': 39
    }
    return startPositions[color]
  }

  // Get home positions for each color
  const getHomePositions = (color) => {
    const homePositions = {
      'red': [
        {row: 2, col: 2}, {row: 2, col: 3}, 
        {row: 3, col: 2}, {row: 3, col: 3}
      ],
      'green': [
        {row: 2, col: 11}, {row: 2, col: 12}, 
        {row: 3, col: 11}, {row: 3, col: 12}
      ],
      'blue': [
        {row: 11, col: 11}, {row: 11, col: 12}, 
        {row: 12, col: 11}, {row: 12, col: 12}
      ],
      'yellow': [
        {row: 11, col: 2}, {row: 11, col: 3}, 
        {row: 12, col: 2}, {row: 12, col: 3}
      ]
    }
    return homePositions[color]
  }

  // Roll dice function
  const rollDice = () => {
    if (diceRolling || gameState !== 'playing' || players[currentPlayer]?.isAI) return

    setDiceRolling(true)
    setDiceValue(0)

    let rolls = 0
    const rollInterval = setInterval(() => {
      setDiceValue(Math.floor(Math.random() * 6) + 1)
      rolls++
      if (rolls > 6) { // Reduced rolls for faster animation
        clearInterval(rollInterval)
        const finalValue = Math.floor(Math.random() * 6) + 1
        setDiceValue(finalValue)
        setDiceRolling(false)
        
        const currentPlayerObj = players[currentPlayer]
        if (currentPlayerObj.isAI) {
          setAiThinking(true)
          setTimeout(() => handleAITurn(finalValue), 300) // Faster AI response
        } else {
          setMessage(`Rolled ${finalValue}! Click a piece to move`)
        }
      }
    }, 80) // Faster animation
  }

  // Handle AI turn
  const handleAITurn = (diceRoll) => {
    const aiPlayer = players[currentPlayer]
    const movablePieces = aiPlayer.pieces.filter(piece => 
      canPieceMove(aiPlayer, piece, diceRoll)
    )

    if (movablePieces.length > 0) {
      let selectedPiece
      const capturingPieces = movablePieces.filter(piece => 
        canCapture(aiPlayer, piece, diceRoll)
      )
      
      if (capturingPieces.length > 0) {
        selectedPiece = capturingPieces[0]
      } else {
        const enteringPieces = movablePieces.filter(piece => 
          piece.position === 'home' && diceRoll === 6
        )
        selectedPiece = enteringPieces.length > 0 ? enteringPieces[0] : movablePieces[0]
      }

      // Immediate move for AI
      movePiece(aiPlayer, selectedPiece, diceRoll)
    }
    
    setAiThinking(false)
    nextTurn()
  }

  // Check if piece can move
  const canPieceMove = (player, piece, diceValue) => {
    if (piece.position === 'finished') return false
    if (piece.position === 'home' && diceValue !== 6) return false
    if (piece.position === 'track') {
      const newPosition = piece.trackPosition + diceValue
      if (newPosition > 51) return false
    }
    return true
  }

  // Check if piece can capture
  const canCapture = (player, piece, diceValue) => {
    if (piece.position !== 'track') return false
    const newPosition = piece.trackPosition + diceValue
    return players.some(opponent => 
      opponent.id !== player.id &&
      opponent.pieces.some(oppPiece => 
        oppPiece.position === 'track' && 
        oppPiece.trackPosition === newPosition &&
        !isSafePosition(newPosition)
      )
    )
  }

  // Safe positions on track
  const isSafePosition = (position) => {
    const safePositions = [0, 8, 13, 21, 26, 34, 39, 47]
    return safePositions.includes(position)
  }

  // Move piece function
  const movePiece = (player, piece, diceValue) => {
    const playerIndex = players.findIndex(p => p.id === player.id)
    const pieceIndex = player.pieces.findIndex(p => p.id === piece.id)
    
    const newPlayers = [...players]
    const newPiece = { ...newPlayers[playerIndex].pieces[pieceIndex] }

    if (newPiece.position === 'home' && diceValue === 6) {
      newPiece.position = 'track'
      newPiece.trackPosition = player.startPosition
      newPiece.isSafe = true
    } else if (newPiece.position === 'track') {
      const newPosition = newPiece.trackPosition + diceValue
      
      // Check for captures
      players.forEach((opponent, oppIndex) => {
        if (opponent.id !== player.id) {
          opponent.pieces.forEach((oppPiece, oppPieceIndex) => {
            if (oppPiece.position === 'track' && 
                oppPiece.trackPosition === newPosition &&
                !isSafePosition(newPosition)) {
              newPlayers[oppIndex].pieces[oppPieceIndex] = {
                ...oppPiece,
                position: 'home',
                trackPosition: -1,
                isSafe: true
              }
            }
          })
        }
      })

      newPiece.trackPosition = newPosition
      newPiece.isSafe = isSafePosition(newPosition)

      if (newPiece.trackPosition > 51) {
        newPiece.position = 'finished'
      }
    }

    newPlayers[playerIndex].pieces[pieceIndex] = newPiece
    setPlayers(newPlayers)

    checkWinner(newPlayers[playerIndex])
  }

  // Check winner
  const checkWinner = (player) => {
    if (player.pieces.every(piece => piece.position === 'finished')) {
      setGameState('finished')
      setMessage(`${player.color.toUpperCase()} wins the game! 🎉`)
    }
  }

  // Next turn
  const nextTurn = () => {
    if (diceValue !== 6 || gameState === 'finished') {
      const nextPlayer = (currentPlayer + 1) % players.length
      setCurrentPlayer(nextPlayer)
      const nextPlayerObj = players[nextPlayer]
      setMessage(`${nextPlayerObj.color.toUpperCase()} to roll dice${nextPlayerObj.isAI ? ' (AI)' : ''}`)
    } else {
      setMessage(`${players[currentPlayer].color.toUpperCase()} roll again!`)
    }
    setDiceValue(0)
  }

  // Handle piece click
  const handlePieceClick = (player, piece) => {
    if (gameState !== 'playing' || 
        player.id !== currentPlayer || 
        players[currentPlayer].isAI ||
        diceValue === 0 ||
        !canPieceMove(player, piece, diceValue)) {
      return
    }

    movePiece(player, piece, diceValue)
    nextTurn()
  }

  // Get piece position on board with proper alignment
  const getPiecePosition = (player, piece) => {
    if (piece.position === 'home') {
      const homePos = player.homePositions[piece.id]
      return {
        x: (homePos.col * CELL_SIZE) + (CELL_SIZE / 2),
        y: (homePos.row * CELL_SIZE) + (CELL_SIZE / 2)
      }
    } else if (piece.position === 'track') {
      const trackPos = piece.trackPosition
      let x, y
      
      // Proper track path calculation
      if (trackPos < 13) {
        // Top track (right to left)
        x = (13 - trackPos) * CELL_SIZE - (CELL_SIZE / 2)
        y = 1 * CELL_SIZE + (CELL_SIZE / 2)
      } else if (trackPos < 26) {
        // Right track (top to bottom)
        x = 13 * CELL_SIZE - (CELL_SIZE / 2)
        y = (trackPos - 11) * CELL_SIZE + (CELL_SIZE / 2)
      } else if (trackPos < 39) {
        // Bottom track (left to right)
        x = (trackPos - 24) * CELL_SIZE + (CELL_SIZE / 2)
        y = 13 * CELL_SIZE - (CELL_SIZE / 2)
      } else {
        // Left track (bottom to top)
        x = 1 * CELL_SIZE + (CELL_SIZE / 2)
        y = (52 - trackPos) * CELL_SIZE - (CELL_SIZE / 2)
      }
      
      return { x, y }
    }
    return { x: -100, y: -100 }
  }

  // Render game board with proper Ludo layout
  const renderBoard = () => {
    const board = []
    
    for (let row = 0; row < BOARD_SIZE; row++) {
      const rowCells = []
      for (let col = 0; col < BOARD_SIZE; col++) {
        let backgroundColor = 'bg-gray-200'
        let borderColor = 'border-gray-300'
        
        // Center cross (paths)
        if ((row === 7 && col >= 1 && col <= 13) || (col === 7 && row >= 1 && row <= 13)) {
          backgroundColor = 'bg-white'
        }
        
        // Colored home bases
        if (row >= 2 && row <= 4 && col >= 2 && col <= 4) backgroundColor = 'bg-red-300' // Red home
        if (row >= 2 && row <= 4 && col >= 10 && col <= 12) backgroundColor = 'bg-green-300' // Green home
        if (row >= 10 && row <= 12 && col >= 10 && col <= 12) backgroundColor = 'bg-blue-300' // Blue home
        if (row >= 10 && row <= 12 && col >= 2 && col <= 4) backgroundColor = 'bg-yellow-300' // Yellow home
        
        // Center home
        if (row >= 6 && row <= 8 && col >= 6 && col <= 8) {
          backgroundColor = 'bg-yellow-200'
        }

        // Starting positions (colored triangles)
        if ((row === 1 && col === 7) || (row === 7 && col === 13) || 
            (row === 13 && col === 7) || (row === 7 && col === 1)) {
          backgroundColor = 'bg-gray-400'
        }

        rowCells.push(
          <div
            key={`${row}-${col}`}
            className={`w-6 h-6 border ${borderColor} ${backgroundColor}`}
          />
        )
      }
      board.push(
        <div key={row} className="flex">
          {rowCells}
        </div>
      )
    }
    
    return board
  }

  // Render player pieces
  const renderPieces = () => {
    return players.flatMap((player, playerIndex) =>
      player.pieces.map((piece, pieceIndex) => {
        if (piece.position === 'finished') return null
        
        const position = getPiecePosition(player, piece)
        const isMovable = gameState === 'playing' && 
          player.id === currentPlayer && 
          !player.isAI &&
          diceValue > 0 &&
          canPieceMove(player, piece, diceValue)

        return (
          <div
            key={`piece-${playerIndex}-${pieceIndex}`}
            className={`absolute w-5 h-5 rounded-full border-2 border-white transition-all duration-200 ${
              isMovable ? 'cursor-pointer hover:scale-125 ring-2 ring-white animate-pulse' : 'cursor-default'
            } ${
              player.color === 'red' ? 'bg-red-500' :
              player.color === 'green' ? 'bg-green-500' :
              player.color === 'blue' ? 'bg-blue-500' : 'bg-yellow-500'
            } ${piece.isSafe ? 'ring-1 ring-white' : ''}`}
            style={{
              left: `${position.x - 10}px`,
              top: `${position.y - 10}px`
            }}
            onClick={() => handlePieceClick(player, piece)}
          />
        )
      })
    )
  }

  // Game mode selection
  if (gameState === 'select') {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-4xl mx-auto">
          <div className="glass-effect rounded-2xl p-8 text-center">
            <h2 className="text-4xl font-bold text-white mb-4">🎲 Ludo King</h2>
            <p className="text-white/80 mb-8">Choose your game mode</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div 
                className="glass-effect rounded-2xl p-6 cursor-pointer transform hover:scale-105 transition duration-300"
                onClick={() => initializeGame('2player')}
              >
                <div className="text-5xl mb-4">👥</div>
                <h3 className="text-2xl font-bold text-white mb-2">2 Players</h3>
                <p className="text-white/70">Red vs Green</p>
              </div>
              
              <div 
                className="glass-effect rounded-2xl p-6 cursor-pointer transform hover:scale-105 transition duration-300"
                onClick={() => initializeGame('4player')}
              >
                <div className="text-5xl mb-4">👥👥</div>
                <h3 className="text-2xl font-bold text-white mb-2">4 Players</h3>
                <p className="text-white/70">All colors</p>
              </div>
              
              <div 
                className="glass-effect rounded-2xl p-6 cursor-pointer transform hover:scale-105 transition duration-300"
                onClick={() => initializeGame('vsai')}
              >
                <div className="text-5xl mb-4">🤖</div>
                <h3 className="text-2xl font-bold text-white mb-2">vs AI</h3>
                <p className="text-white/70">You vs 3 AI</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="glass-effect rounded-2xl p-6 mb-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-2">🎲 Ludo King</h2>
          <p className="text-white/80 mb-4">
            {selectedMode === '2player' ? '2 Players' : 
             selectedMode === '4player' ? '4 Players' : 'You vs AI'}
          </p>
          
          <div className="bg-white/10 rounded-lg p-4 inline-block">
            <p className="text-white text-xl font-semibold">
              {aiThinking ? '🤖 AI thinking...' : message}
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Game Board */}
          <div className="flex-1 flex justify-center">
            <div className="glass-effect rounded-2xl p-6">
              <div className="bg-green-800 p-4 rounded-xl shadow-2xl">
                <div className="border-4 border-green-700 rounded-lg p-2 bg-green-600">
                  <div className="relative" style={{ width: `${BOARD_SIZE * CELL_SIZE}px`, height: `${BOARD_SIZE * CELL_SIZE}px` }}>
                    {renderBoard()}
                    {renderPieces()}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Game Controls */}
          <div className="lg:w-80">
            <div className="glass-effect rounded-2xl p-6 space-y-6">
              {/* Dice */}
              <div className="text-center">
                <h3 className="text-white font-bold mb-4">Dice</h3>
                <div 
                  className={`w-20 h-20 mx-auto bg-white rounded-xl flex items-center justify-center text-3xl font-bold transition-all duration-200 ${
                    diceRolling ? 'animate-bounce' : 'hover:scale-110'
                  } ${
                    (diceRolling || players[currentPlayer]?.isAI) ? 'cursor-not-allowed' : 'cursor-pointer'
                  }`}
                  onClick={rollDice}
                >
                  {diceValue > 0 ? diceValue : '🎲'}
                </div>
                <p className="text-white/70 mt-2">
                  {players[currentPlayer]?.isAI ? 'AI rolling...' : 'Click to roll'}
                </p>
              </div>

              {/* Current Player */}
              <div className="text-center">
                <h3 className="text-white font-bold mb-2">Current Turn</h3>
                <div className={`text-xl font-bold py-2 rounded-lg ${
                  players[currentPlayer]?.color === 'red' ? 'bg-red-500 text-white' :
                  players[currentPlayer]?.color === 'green' ? 'bg-green-500 text-white' :
                  players[currentPlayer]?.color === 'blue' ? 'bg-blue-500 text-white' :
                  'bg-yellow-500 text-gray-800'
                }`}>
                  {players[currentPlayer]?.color.toUpperCase()}
                  {players[currentPlayer]?.isAI && ' (AI)'}
                </div>
              </div>

              {/* Player Status */}
              <div className="space-y-3">
                <h3 className="text-white font-bold text-center">Players</h3>
                {players.map(player => (
                  <div key={player.id} className="flex items-center justify-between bg-white/10 p-2 rounded">
                    <div className="flex items-center">
                      <div className={`w-4 h-4 rounded-full mr-2 ${
                        player.color === 'red' ? 'bg-red-500' :
                        player.color === 'green' ? 'bg-green-500' :
                        player.color === 'blue' ? 'bg-blue-500' : 'bg-yellow-500'
                      }`} />
                      <span className="text-white">{player.color.toUpperCase()}</span>
                      {player.isAI && <span className="text-white/70 ml-1">(AI)</span>}
                    </div>
                    <span className="text-white">
                      {player.pieces.filter(p => p.position === 'finished').length}/4
                    </span>
                  </div>
                ))}
              </div>

              {/* Controls */}
              <div className="space-y-3">
                <button
                  onClick={() => setGameState('select')}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition duration-200"
                >
                  🔄 New Game
                </button>
              </div>

              {/* Instructions */}
              <div className="bg-white/10 rounded-lg p-4">
                <h4 className="text-white font-bold mb-2">How to Play:</h4>
                <ul className="text-white/70 text-sm space-y-1">
                  <li>• Roll 6 to move pieces from home</li>
                  <li>• Move pieces around the track</li>
                  <li>• Capture opponent pieces on unsafe spots</li>
                  <li>• First to get all 4 pieces home wins!</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Ludo