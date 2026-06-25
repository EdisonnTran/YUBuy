import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import ListingDetail from './pages/ListingDetails'
import SellerProfile from './pages/SellerProfile'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
         <Route path="/" element={<Register />} />
         <Route path="/login" element={<Login />} />
         <Route path="/register" element={<Register />} />
         <Route path="/listings/:id" element={<ListingDetail />} />
         <Route path="/profile" element={<SellerProfile />} />

      </Routes>
    </BrowserRouter>
  )
}