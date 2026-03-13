import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import LoadingScreen from './components/LoadingScreen'
import Home from './pages/Home'
import Admin from './pages/Admin'
import Live from './pages/Live'
import './index.css'

export default function App() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 3400)
    return () => clearTimeout(t)
  }, [])

  return (
    <BrowserRouter>
      <AnimatePresence>
        {loading && <LoadingScreen key="loader" />}
      </AnimatePresence>
      {!loading && (
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/live" element={<Live />} />
        </Routes>
      )}
    </BrowserRouter>
  )
}
