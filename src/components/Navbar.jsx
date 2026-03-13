import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export default function Navbar({ onCatalogue }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <motion.header
      className={`flex items-center justify-between whitespace-nowrap border-b-4 border-black px-4 md:px-10 py-4 bg-white sticky top-0 z-50 transition-shadow ${scrolled ? 'shadow-[0_4px_0_#000]' : ''}`}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
    >
      <div className="flex items-center gap-8">
        <Link to="/" className="flex items-center gap-3">
          <motion.img
            src="/logo.png"
            alt="Area 67"
            className="h-10 w-10 object-contain"
            animate={{ rotate: [0, -10, 10, -5, 5, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 5 }}
          />
          <h2 className="text-accent text-2xl font-display leading-tight tracking-wider uppercase">
            Area 67
          </h2>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {[
            { label: 'Home', action: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
            { label: 'Catalogue', action: onCatalogue },
            { label: '🔴 Live & Book', href: '/live', highlight: true },
          ].map(({ label, action, href, highlight }, i) => (
            href ? (
              <Link key={label} to={href}>
                <motion.span className={`font-display text-lg tracking-wide cursor-pointer ${highlight ? 'text-red-500 hover:text-red-600' : 'text-accent hover:text-primary'}`}
                  initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.07 }} whileHover={{ scale: 1.08 }}>
                  {label}
                </motion.span>
              </Link>
            ) : (
              <motion.button key={label} onClick={action} className="text-accent hover:text-primary font-display text-lg tracking-wide transition-colors bg-transparent border-none cursor-pointer"
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.07 }} whileHover={{ scale: 1.08 }}>
                {label}
              </motion.button>
            )
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-3">
        <Link to="/live">
          <motion.button
            className="hidden sm:flex h-10 items-center gap-2 btn-comic bg-primary text-white px-5 text-base"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
          >
            <span className="material-symbols-outlined text-lg">calendar_clock</span>
            BOOK SLOT
          </motion.button>
        </Link>

        <Link to="/admin">
          <motion.button
            className="flex items-center justify-center border-[3px] border-black h-10 w-10 bg-secondary hover:bg-yellow-400 transition-colors"
            whileHover={{ scale: 1.12, rotate: 10 }}
            whileTap={{ scale: 0.9 }}
            title="Admin Panel"
          >
            <span className="material-symbols-outlined text-xl text-black">admin_panel_settings</span>
          </motion.button>
        </Link>
      </div>
    </motion.header>
  )
}
