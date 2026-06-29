import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Professionals from './pages/Professionals'
import Profile from './pages/Profile'
import Register from './pages/Register'
import AdminDashboard from './pages/AdminDashboard'
import PaymentSuccess from './pages/PaymentSuccess'
import PaymentFailed from './pages/PaymentFailed'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profissionais" element={<Professionals />} />
        <Route path="/profissional/:id" element={<Profile />} />
        <Route path="/cadastro" element={<Register />} />
        <Route path="/cadastro/sucesso" element={<PaymentSuccess />} />
        <Route path="/cadastro/falhou" element={<PaymentFailed />} />
        <Route path="/cadastro/pendente" element={<PaymentFailed />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  )
}
