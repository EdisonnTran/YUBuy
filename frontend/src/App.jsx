import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Wishlist from './pages/Wishlist'
import ListingDetail from './pages/ListingDetails'
import Listings from './pages/Listings'
import Checkout from './pages/Checkout'
import SellerProfile from './pages/SellerProfile'
import SellItem from './pages/SellItem'
import Admin from './pages/Admin'
import Inbox from './pages/Inbox'



export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/listings/:id" element={<ListingDetail />} />
        <Route path="/listings" element={<Listings />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/profile" element={<SellerProfile />} />
        <Route path="/sell" element={<SellItem />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/inbox" element={<Inbox />} />
      </Routes>
    </BrowserRouter>
  )
}

