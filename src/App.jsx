import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './Login'
import Dashboard from './Dashboard'
import ManagerDashboard from './ManagerDashboard'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirection automatique de la racine vers le login */}
        <Route path="/" element={<Navigate to="/login" />} />
        
        {/* Tes 3 pages principales */}
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/manager" element={<ManagerDashboard />} />
      </Routes>
    </BrowserRouter>
  )
}