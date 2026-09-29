import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from './supabaseClient'

export default function Dashboard() {
  const navigate = useNavigate()
  
  const [technicianName, setTechnicianName] = useState('')
  const [client, setClient] = useState('')
  const [type, setType] = useState('Urgence / Bug critique')
  const [date, setDate] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [location, setLocation] = useState('À distance')
  const [description, setDescription] = useState('')
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [history, setHistory] = useState([])
  const [loadingHistory, setLoadingHistory] = useState(true)

  const fetchHistory = async () => {
    const { data, error } = await supabase
      .from('interventions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5)

    if (!error) {
      setHistory(data)
    }
    setLoadingHistory(false)
  }

  useEffect(() => {
    fetchHistory()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    const { error } = await supabase
      .from('interventions')
      .insert([
        { 
          technician_name: technicianName,
          client: client,
          incident_type: type,
          date: date,
          start_time: startTime,
          end_time: endTime,
          location: location,
          description: description
        }
      ])

    setIsSubmitting(false)

    if (error) {
      alert("Erreur lors de l'envoi : " + error.message)
    } else {
      alert("✅ Déclaration d'astreinte envoyée avec succès !")
      setClient('')
      setDate('')
      setStartTime('')
      setEndTime('')
      setDescription('')
      fetchHistory()
    }
  }

  return (
    <div className="min-h-screen bg-white p-6 md:p-12">
      <div className="max-w-3xl mx-auto space-y-12">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-gray-100 pb-6">
          <div>
            <img src="/logo.png" alt="VBEST Technologies" className="h-10 w-auto mb-4" />
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Portail des Astreintes</h1>
            <p className="text-sm text-gray-500 mt-2">Espace Collaborateur</p>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center text-red-600 hover:text-red-800 font-medium transition-colors text-sm pb-1"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Déconnexion
          </button>
        </div>

        <div>
          <div className="flex items-center mb-8">
            <svg className="w-6 h-6 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h2 className="text-xl font-bold text-gray-900">Déclarer une intervention</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Nom du technicien</label>
                <input type="text" required value={technicianName} onChange={(e) => setTechnicianName(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" placeholder="Ex: Jean Dupont" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Client / Projet</label>
                <input type="text" required value={client} onChange={(e) => setClient(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" placeholder="Ex: Banque Centrale, Serveur Interne..." />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Nature de l'incident</label>
                <select value={type} onChange={(e) => setType(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all cursor-pointer">
                  <option>Urgence / Bug critique</option>
                  <option>Maintenance serveur</option>
                  <option>Déploiement applicatif</option>
                  <option>Support utilisateur</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Date de l'astreinte</label>
                <input type="date" required value={date} onChange={(e) => setDate(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Heure de début (après 18h00)</label>
                <input type="time" required value={startTime} onChange={(e) => setStartTime(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Heure de fin (avant 06h00)</label>
                <input type="time" required value={endTime} onChange={(e) => setEndTime(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-900 mb-2">Mode d'intervention</label>
                <div className="flex space-x-6 mt-4">
                  <label className="flex items-center cursor-pointer group">
                    <input type="radio" name="location" value="À distance" checked={location === 'À distance'} onChange={(e) => setLocation(e.target.value)} className="w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-300" />
                    <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-900">À distance</span>
                  </label>
                  <label className="flex items-center cursor-pointer group">
                    <input type="radio" name="location" value="Sur site" checked={location === 'Sur site'} onChange={(e) => setLocation(e.target.value)} className="w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-300" />
                    <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-900">Sur site client</span>
                  </label>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Rapport d'intervention (Actions menées)</label>
              <textarea required rows="5" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none" placeholder="Décrivez précisément les actions correctives effectuées durant l'astreinte..."></textarea>
            </div>

            <div className="pt-4 flex justify-center">
              <button type="submit" disabled={isSubmitting} className="w-full md:w-auto md:min-w-[400px] py-4 px-8 bg-gray-900 hover:bg-black text-white rounded-xl shadow-lg hover:shadow-xl text-sm font-bold transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 flex justify-center items-center disabled:opacity-70">
                {isSubmitting ? 'Envoi en cours...' : 'Soumettre la déclaration'}
                {!isSubmitting && <span className="ml-3 px-2 py-1 bg-white/20 rounded text-xs font-normal">Prime : 15 000 FCFA</span>}
              </button>
            </div>
          </form>
        </div>

        <div className="pt-12 mt-12 border-t border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Vos dernières déclarations</h2>
          
          {loadingHistory ? (
            <p className="text-gray-500 text-sm">Chargement de votre historique...</p>
          ) : history.length === 0 ? (
            <div className="bg-gray-50 rounded-xl p-8 text-center border border-gray-100">
              <p className="text-gray-500 text-sm">Vous n'avez soumis aucune déclaration pour le moment.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((item) => (
                <div key={item.id} className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-gray-300 transition-colors">
                  <div>
                    <p className="font-bold text-gray-900">{item.client}</p>
                    <p className="text-xs text-gray-500 mt-1">{item.date} • {item.start_time} - {item.end_time} • {item.location}</p>
                  </div>
                  <div>
                    {item.status === 'En attente' && <span className="px-3 py-1.5 bg-yellow-100 text-yellow-800 rounded-full text-xs font-bold uppercase tracking-wide">En attente</span>}
                    {item.status === 'Approuvée' && <span className="px-3 py-1.5 bg-green-100 text-green-800 rounded-full text-xs font-bold uppercase tracking-wide">Approuvée</span>}
                    {item.status === 'Refusée' && <span className="px-3 py-1.5 bg-red-100 text-red-800 rounded-full text-xs font-bold uppercase tracking-wide">Refusée</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}