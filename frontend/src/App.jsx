import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Listings from './pages/Listings'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
         <Route path="/" element={<Register />} />
         <Route path="/login" element={<Login />} />
         <Route path="/register" element={<Register />} />
         <Route path="/listings" element={<Listings />} />
      </Routes>
    </BrowserRouter>
  )
}
