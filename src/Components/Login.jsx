
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Login = ({ setUser }) => {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({ username: '', password: '', email: '' })
    const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault()
    // Mock login for now
    setUser({ username: formData.username, id: '1' })
     navigate('/dashboard') 
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass-effect rounded-2xl p-8 w-full max-w-md animate-fade-in">
        <h1 className="text-3xl font-bold text-white text-center mb-2">
          🧙 AI GameVerse
        </h1>
        <p className="text-fantasy-light text-center mb-6">Enter the world of intelligent NPCs</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Username"
              className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/70 border border-white/30 focus:outline-none focus:ring-2 focus:ring-fantasy-secondary"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
            />
          </div>
          
          {!isLogin && (
            <div>
              <input
                type="email"
                placeholder="Email"
                className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/70 border border-white/30 focus:outline-none focus:ring-2 focus:ring-fantasy-secondary"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          )}
          
          <div>
            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/70 border border-white/30 focus:outline-none focus:ring-2 focus:ring-fantasy-secondary"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-fantasy-secondary hover:bg-amber-500 text-white font-bold py-3 px-4 rounded-lg transition duration-200 transform hover:scale-105"
          >
            {isLogin ? 'Enter World' : 'Create Account'}
          </button>
        </form>
        
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="w-full mt-4 text-white/80 hover:text-white transition duration-200"
        >
          {isLogin ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
        </button>
      </div>
    </div>
  )
}

export default Login;