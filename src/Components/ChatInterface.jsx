import React, { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { fakeNPCs, fakeConversations } from '../data/fakeData'

const ChatInterface = ({ user }) => {
  const { npcId } = useParams()
  const navigate = useNavigate()
  const messagesEndRef = useRef(null)
  
  const npc = fakeNPCs.find(n => n.id === npcId)
  const [messages, setMessages] = useState(fakeConversations[npcId] || [])
  const [inputMessage, setInputMessage] = useState('')

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!inputMessage.trim()) return

    // Add player message
    const newPlayerMessage = {
      id: messages.length + 1,
      type: 'player',
      message: inputMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, newPlayerMessage])
    setInputMessage('')

    // Simulate NPC response after delay
    setTimeout(() => {
      const npcResponses = [
        "That's an interesting thought...",
        "I remember you mentioned something similar before.",
        "Let me ponder on that for a moment.",
        "The ancient texts speak of such matters.",
        "Your wisdom grows with each conversation."
      ]
      
      const npcMessage = {
        id: messages.length + 2,
        type: 'npc',
        message: npcResponses[Math.floor(Math.random() * npcResponses.length)],
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, npcMessage])
    }, 1000)
  }

  if (!npc) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl text-white font-bold">NPC Not Found</h2>
          <button 
            onClick={() => navigate('/dashboard')}
            className="mt-4 bg-fantasy-primary text-white px-6 py-2 rounded-lg"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Chat Header */}
      <div className="glass-effect p-4">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate('/dashboard')}
            className="text-white hover:text-fantasy-secondary transition duration-200"
          >
            ← Back
          </button>
          <div className="text-3xl">{npc.avatar}</div>
          <div>
            <h2 className="text-xl font-bold text-white">{npc.name}</h2>
            <p className="text-fantasy-secondary text-sm">{npc.title} • {npc.location}</p>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.type === 'player' ? 'justify-end' : 'justify-start'} animate-fade-in`}
          >
            <div
              className={`max-w-xs lg:max-w-md rounded-2xl p-4 ${
                msg.type === 'player' 
                  ? 'bg-fantasy-primary text-white rounded-br-none' 
                  : 'glass-effect text-white rounded-bl-none'
              }`}
            >
              <p className="text-sm">{msg.message}</p>
              <p className={`text-xs mt-1 ${msg.type === 'player' ? 'text-purple-200' : 'text-white/60'}`}>
                {msg.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="glass-effect p-4">
        <form onSubmit={handleSendMessage} className="flex space-x-4">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={`Message ${npc.name}...`}
            className="flex-1 p-3 rounded-lg bg-white/20 text-white placeholder-white/70 border border-white/30 focus:outline-none focus:ring-2 focus:ring-fantasy-secondary"
          />
          <button
            type="submit"
            className="bg-fantasy-secondary hover:bg-amber-500 text-white px-6 py-3 rounded-lg transition duration-200 transform hover:scale-105"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  )
}

export default ChatInterface