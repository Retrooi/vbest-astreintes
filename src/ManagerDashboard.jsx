import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from './supabaseClient'

export default function ManagerDashboard() {
  const navigate = useNavigate()
  const [interventions, setInterventions] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchInterventions = async () => {
    const { data, error } = await supabase
      .from('interventions')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error) setInterventions(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchInterventions()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  const updateStatus = async (id, newStatus) => {
    const { error } = await supabase
      .from('interventions')
      .update({ status: newStatus })
      .eq('id', id)

    if (!error) {
      setInterventions(interventions.map(inter => 
        inter.id === id ? { ...inter, status: newStatus } : inter
      ))
    }
  }

  return (
    <div className="min-h-screen bg-white p-6 md:p-12">
      <div className="max-w-3xl mx-auto space-y-12">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-gray-100 pb-6">
          <div>
            <img src="/logo.png" alt="VBEST Technologies" className="h-10 w-auto mb-4" />
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Portail des Astreintes</h1>
            <p className="text-sm text-gray-500 mt-2">Espace Manager</p>
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-xl font-bold text-gray-900">Demandes en attente de validation</h2>
          </div>
          
          {loading ? (
            <p className="text-gray-500 text-sm">Chargement des déclarations...</p>
          ) : interventions.length === 0 ? (
            <div className="bg-gray-50 rounded-xl p-8 text-center border border-gray-100">
              <p className="text-gray-500 text-sm">Aucune déclaration d'astreinte pour le moment.</p>
            </div>
          ) : (
            <div className="space-y-12">
              {interventions.map((inter) => (
                <div key={inter.id} className="bg-white border-2 border-gray-50 rounded-2xl p-8 shadow-sm relative">
                  
                  <div className="absolute top-8 right-8">
                    {inter.status === 'En attente' && <span className="px-3 py-1.5 bg-yellow-100 text-yellow-800 rounded-full text-xs font-bold uppercase tracking-wide">En attente</span>}
                    {inter.status === 'Approuvée' && <span className="px-3 py-1.5 bg-green-100 text-green-800 rounded-full text-xs font-bold uppercase tracking-wide">Approuvée</span>}
                    {inter.status === 'Refusée' && <span className="px-3 py-1.5 bg-red-100 text-red-800 rounded-full text-xs font-bold uppercase tracking-wide">Refusée</span>}
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-8 border-b border-gray-100 pb-4">{inter.technician_name}</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Client / Projet</label>
                      <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800">{inter.client}</div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Nature de l'incident</label>
                      <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800">{inter.incident_type}</div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Date de l'astreinte</label>
                      <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800">{inter.date}</div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">Début</label>
                        <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800">{inter.start_time}</div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">Fin</label>
                        <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800">{inter.end_time}</div>
                      </div>
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Mode d'intervention</label>
                      <div className="flex items-center space-x-6 mt-4">
                        <div className="flex items-center">
                          <span className={`w-5 h-5 rounded-full border-4 flex-shrink-0 ${inter.location === 'À distance' ? 'border-blue-600 bg-white' : 'border-gray-300 bg-white'}`}></span>
                          <span className="ml-2 text-sm font-medium text-gray-900">À distance</span>
                        </div>
                        <div className="flex items-center">
                          <span className={`w-5 h-5 rounded-full border-4 flex-shrink-0 ${inter.location === 'Sur site' ? 'border-blue-600 bg-white' : 'border-gray-300 bg-white'}`}></span>
                          <span className="ml-2 text-sm font-medium text-gray-900">Sur site client</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-8">
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Rapport d'intervention (Actions menées)</label>
                    <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 min-h-[120px] whitespace-pre-wrap">
                      {inter.description}
                    </div>
                  </div>

                  {inter.status === 'En attente' && (
                    <div className="pt-4 flex flex-col md:flex-row gap-4 justify-center">
                      <button 
                        onClick={() => updateStatus(inter.id, 'Approuvée')}
                        className="w-full md:w-auto md:min-w-[300px] py-4 px-8 bg-gray-900 hover:bg-black text-white rounded-xl shadow-lg hover:shadow-xl text-sm font-bold transition-all focus:outline-none flex justify-center items-center"
                      >
                        Approuver
                        <span className="ml-3 px-2 py-1 bg-white/20 rounded text-xs font-normal">Prime : 15 000 FCFA</span>
                      </button>
                      <button 
                        onClick={() => updateStatus(inter.id, 'Refusée')}
                        className="w-full md:w-auto md:min-w-[150px] py-4 px-8 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 rounded-xl text-sm font-bold transition-all focus:outline-none flex justify-center items-center"
                      >
                        Refuser
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}