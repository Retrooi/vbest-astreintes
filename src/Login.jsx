import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from './supabaseClient'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setErrorMsg(error.message)
      setLoading(false)
    } else {
      const userEmail = data.user.email
      
      if (userEmail.trim().toLowerCase() === 'manager@vbest.ci') {
        navigate('/manager') 
      } else {
        navigate('/dashboard') 
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
        
        <div className="text-center mb-10 flex flex-col items-center">
          <img src="/logo.png" alt="VBEST Technologies" className="h-14 w-auto mb-6" />
          <p className="text-gray-500 font-medium">Portail de Gestion des Astreintes</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Email professionnel</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-vbestRed focus:border-transparent outline-none transition-all"
              placeholder="jean.dupont@vbest.ci"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Mot de passe</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-vbestRed focus:border-transparent outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100">
              {errorMsg}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3.5 px-4 bg-vbestRed hover:bg-red-700 text-white rounded-xl shadow-md hover:shadow-lg text-sm font-bold transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-vbestRed disabled:opacity-70"
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

      </div>
    </div>
  )
}