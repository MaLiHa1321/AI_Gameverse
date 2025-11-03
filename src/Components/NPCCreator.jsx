import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const NPCCreator = ({ user }) => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    avatar: '🧙',
    personality: '',
    backstory: '',
    location: 'Mystic Tower'
  })

  const avatars = ['🧙', '🌿', '⚒️', '🐉', '🧝', '🦉', '⚔️', '🔮']

  const handleSubmit = (e) => {
    e.preventDefault()
    // For now, just go back to dashboard
    alert('NPC Creation will be implemented with backend!')
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="glass-effect rounded-2xl p-6 mb-6">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => navigate('/dashboard')}
              className="text-white hover:text-fantasy-secondary transition duration-200"
            >
              ← Back
            </button>
            <h1 className="text-2xl font-bold text-white">Create New NPC</h1>
          </div>
        </div>

        <div className="glass-effect rounded-2xl p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
   
            <div>
              <label className="block text-white font-semibold mb-3">Choose Avatar</label>
              <div className="grid grid-cols-4 gap-4">
                {avatars.map(avatar => (
                  <div
                    key={avatar}
                    className={`text-4xl p-4 rounded-2xl cursor-pointer text-center transition duration-200 ${
                      formData.avatar === avatar 
                        ? 'bg-fantasy-primary transform scale-110' 
                        : 'bg-white/20 hover:bg-white/30'
                    }`}
                    onClick={() => setFormData({...formData, avatar})}
                  >
                    {avatar}
                  </div>
                ))}
              </div>
            </div>

      
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white font-semibold mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/70 border border-white/30 focus:outline-none focus:ring-2 focus:ring-fantasy-secondary"
                  placeholder="Eldrin the Wise"
                  required
                />
              </div>
              <div>
                <label className="block text-white font-semibold mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/70 border border-white/30 focus:outline-none focus:ring-2 focus:ring-fantasy-secondary"
                  placeholder="Ancient Wizard"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/70 border border-white/30 focus:outline-none focus:ring-2 focus:ring-fantasy-secondary"
                placeholder="Mystic Tower"
                required
              />
            </div>

          
            <div>
              <label className="block text-white font-semibold mb-2">Personality</label>
              <textarea
                value={formData.personality}
                onChange={(e) => setFormData({...formData, personality: e.target.value})}
                className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/70 border border-white/30 focus:outline-none focus:ring-2 focus:ring-fantasy-secondary h-20"
                placeholder="Wise, mysterious, and knowledgeable about ancient secrets..."
                required
              />
            </div>

     
            <div>
              <label className="block text-white font-semibold mb-2">Backstory</label>
              <textarea
                value={formData.backstory}
                onChange={(e) => setFormData({...formData, backstory: e.target.value})}
                className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/70 border border-white/30 focus:outline-none focus:ring-2 focus:ring-fantasy-secondary h-32"
                placeholder="A 500-year-old wizard who has seen civilizations rise and fall..."
                required
              />
            </div>

  
            <button
              type="submit"
              className="w-full bg-fantasy-secondary hover:bg-amber-500 text-white font-bold py-4 px-6 rounded-lg transition duration-200 transform hover:scale-105 text-lg"
            >
              🪄 Create NPC
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default NPCCreator