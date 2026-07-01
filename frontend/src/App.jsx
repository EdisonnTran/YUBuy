import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Listings from './pages/Listings'
import Checkout from './pages/Checkout'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
         <Route path="/" element={<Register />} />
         <Route path="/login" element={<Login />} />
         <Route path="/register" element={<Register />} />
         <Route path="/listings" element={<Listings />} />
         <Route path="/checkout" element={<Checkout />} />
      </Routes>
    </BrowserRouter>
  )
}
