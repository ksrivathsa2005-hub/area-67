import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { CONFIG } from '../store/gameStore'
import SlotManager from '../components/admin/SlotManager'
import GameManager from '../components/admin/GameManager'

const TABS = [
  { id: 'slots',   icon: 'calendar_clock',        label: 'Slot Manager' },
  { id: 'games',   icon: 'videogame_asset',       label: 'Game Catalogue' },
  { id: 'wa',      icon: 'chat',                  label: 'WhatsApp Requests' },
]

function PasswordGate({ onUnlock }) {
  const [pw, setPw]     = useState('')
  const [error, setErr] = useState(false)

  function attempt(e) {
    e.preventDefault()
    if (pw === CONFIG.ADMIN_PASSWORD) { onUnlock() }
    else { setErr(true); setPw(''); setTimeout(() => setErr(false), 1500) }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: '#FDF0D5', backgroundImage: 'radial-gradient(#000 1px, transparent 0)', backgroundSize: '24px 24px' }}
    >
      <motion.div
        className="bg-white border-4 border-black p-10 flex flex-col items-center gap-8 w-full max-w-md"
        style={{ boxShadow: '10px 10px 0 #000' }}
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 280, damping: 18 }}
      >
        <motion.div
          className="action-bubble bg-primary text-white text-3xl border-4 border-black px-8"
          animate={{ rotate: [0, -5, 5, -3, 3, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        >
          ADMIN!
        </motion.div>
        <div className="flex flex-col items-center gap-1">
          <span className="material-symbols-outlined text-6xl text-primary">admin_panel_settings</span>
          <h1 className="font-display text-4xl uppercase tracking-wider text-accent">Admin Zone</h1>
          <p className="font-marker text-slate-500 text-sm">APOORV VR Portal · Area 67</p>
        </div>

        <form onSubmit={attempt} className="flex flex-col gap-4 w-full">
          <motion.input
            type="password"
            value={pw}
            onChange={e => setPw(e.target.value)}
            placeholder="ENTER SECRET CODE"
            className="border-[3px] border-black bg-white px-5 py-3 font-display text-xl uppercase tracking-widest text-center w-full focus:outline-none focus:border-primary focus:bg-yellow-50"
            style={{ boxShadow: error ? '3px 3px 0 #E63946' : '3px 3px 0 #000' }}
            animate={error ? { x: [-8, 8, -6, 6, -4, 4, 0] } : {}}
            transition={{ duration: 0.4 }}
          />
          {error && (
            <motion.p
              className="text-center text-primary font-display uppercase text-sm"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            >
              ✗ WRONG CODE — TRY AGAIN!
            </motion.p>
          )}
          <motion.button
            type="submit"
            className="btn-comic bg-primary text-white h-14 text-2xl"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
          >
            ENTER ZONE
          </motion.button>
        </form>

        <Link to="/" className="text-slate-400 font-display text-sm uppercase hover:text-primary transition-colors">
          ← Back to Portal
        </Link>
      </motion.div>
    </div>
  )
}

export default function Admin() {
  const [unlocked, setUnlocked] = useState(false)
  const [tab, setTab]           = useState('slots')

  if (!unlocked) return <PasswordGate onUnlock={() => setUnlocked(true)} />

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: '#FDF0D5', backgroundImage: 'radial-gradient(#000 1px, transparent 0)', backgroundSize: '24px 24px' }}
    >
      {/* Admin header */}
      <header className="flex items-center justify-between border-b-4 border-black px-6 py-4 bg-white sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <span className="material-symbols-outlined text-primary text-3xl">admin_panel_settings</span>
          <div>
            <h1 className="font-display text-2xl uppercase tracking-wider text-accent leading-none">Admin Dashboard</h1>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Area 67</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/">
            <motion.button
              className="btn-comic bg-secondary text-accent px-5 h-10 text-sm flex items-center gap-2"
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
            >
              <span className="material-symbols-outlined text-base">public</span>
              VIEW SITE
            </motion.button>
          </Link>
          <motion.button
            onClick={() => setUnlocked(false)}
            className="btn-comic bg-black text-white px-5 h-10 text-sm flex items-center gap-2"
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
          >
            <span className="material-symbols-outlined text-base">logout</span>
            LOGOUT
          </motion.button>
        </div>
      </header>

      <div className="flex flex-col md:flex-row flex-1">
        {/* Sidebar tabs */}
        <aside className="md:w-60 border-b-4 md:border-b-0 md:border-r-4 border-black bg-white flex md:flex-col flex-row flex-wrap gap-0">
          {TABS.map(t => (
            <motion.button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-3 px-6 py-4 border-b-4 border-black font-display text-left text-lg uppercase tracking-wide transition-colors w-full ${
                tab === t.id ? 'bg-primary text-white' : 'bg-white text-accent hover:bg-secondary'
              }`}
              whileTap={{ scale: 0.98 }}
            >
              <span className="material-symbols-outlined">{t.icon}</span>
              <span className="hidden md:inline">{t.label}</span>
            </motion.button>
          ))}
        </aside>

        {/* Content area */}
        <main className="flex-1 p-6 md:p-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ type: 'spring', stiffness: 250, damping: 22 }}
            >
              {tab === 'slots' && (
                <div className="flex flex-col gap-6">
                  <div>
                    <h2 className="font-display text-3xl uppercase text-accent">Slot Manager</h2>
                    <p className="font-marker text-slate-500 mt-1">Manage time slots per day — toggle status, add/remove times</p>
                  </div>
                  <SlotManager />
                </div>
              )}

              {tab === 'games' && (
                <div className="flex flex-col gap-6">
                  <div>
                    <h2 className="font-display text-3xl uppercase text-accent">Game Catalogue</h2>
                    <p className="font-marker text-slate-500 mt-1">Add, edit or remove VR experiences</p>
                  </div>
                  <GameManager />
                </div>
              )}

              {tab === 'wa' && (
                <div className="flex flex-col gap-6">
                  <div>
                    <h2 className="font-display text-3xl uppercase text-accent">WhatsApp Requests</h2>
                    <p className="font-marker text-slate-500 mt-1">Booking requests come via WhatsApp</p>
                  </div>
                  <div className="border-4 border-black bg-white p-8"
                       style={{ boxShadow: '8px 8px 0 #FFB703' }}>
                    <div className="flex flex-col md:flex-row items-center gap-6">
                      <div className="w-20 h-20 border-4 border-black bg-green-500 flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined text-white text-5xl">chat</span>
                      </div>
                      <div className="flex flex-col gap-2">
                        <h3 className="font-display text-2xl uppercase">Open WhatsApp to see requests</h3>
                        <p className="font-bold text-slate-600 leading-relaxed">
                          Users send booking requests directly to your WhatsApp number
                          (<strong>{CONFIG.WHATSAPP_NUMBER}</strong>). Open the chat to view, confirm, or deny requests manually.
                        </p>
                      </div>
                    </div>
                    <div className="mt-6 flex gap-3 flex-wrap">
                      <motion.a
                        href={`https://wa.me/${CONFIG.WHATSAPP_NUMBER}`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-comic bg-green-500 text-white px-8 h-12 text-xl flex items-center gap-3"
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                      >
                        <span className="material-symbols-outlined">open_in_new</span>
                        OPEN WHATSAPP
                      </motion.a>
                    </div>
                    <div className="mt-6 border-2 border-dashed border-black p-4 flex gap-3">
                      <span className="material-symbols-outlined text-primary flex-shrink-0 mt-0.5">lightbulb</span>
                      <div className="text-sm text-slate-600 font-medium leading-relaxed">
                        <strong>Workflow:</strong> User books → WhatsApp message arrives → You confirm manually → Mark the slot as <strong>Booked</strong> in the Slot Manager tab.
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
