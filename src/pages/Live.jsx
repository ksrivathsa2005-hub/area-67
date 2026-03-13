import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { socket, api } from '../lib/socket'
import { CONFIG, FEST_DATES } from '../store/gameStore'

const TODAY = new Date().toISOString().slice(0, 10)

const TILTS = ['rotate-1', '-rotate-1', 'rotate-2', '-rotate-2', 'rotate-0', 'rotate-1', '-rotate-1', 'rotate-0', 'rotate-2', '-rotate-2', 'rotate-1', '-rotate-1', 'rotate-0']

export default function Live() {
  const [selectedDate, setDate] = useState(
    FEST_DATES.find(d => d.date >= TODAY)?.date || FEST_DATES[0].date
  )
  const [slots, setSlots] = useState([])
  const [selectedSlot, setSlot] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', email: '' })
  const [errors, setErrors] = useState({})
  const [done, setDone] = useState(false)
  const [showTerms, setShowTerms] = useState(false)
  const bookBtnRef = useRef(null)
  const formRef = useRef(null)
  const termsEndRef = useRef(null)

  // Load slots from server
  useEffect(() => {
    api(`/slots/${selectedDate}`).then(data => setSlots(data))
    setSlot(null)
    setShowForm(false)
    setDone(false)
  }, [selectedDate])

  // Real-time updates via Socket.IO
  useEffect(() => {
    function onSlotsUpdated({ date, slots: updated }) {
      if (date === selectedDate) setSlots(updated)
    }
    socket.on('slotsUpdated', onSlotsUpdated)
    return () => socket.off('slotsUpdated', onSlotsUpdated)
  }, [selectedDate])

  // Compute now playing & next
  const now = new Date()
  const nowMin = now.getHours() * 60 + now.getMinutes()
  const bookedSlots = slots.filter(s => s.status === 'booked')
  let nowPlaying = null
  let nextUp = null
  for (const slot of bookedSlots) {
    const [h, m] = slot.time.split(':').map(Number)
    const start = h * 60 + m
    if (nowMin >= start && nowMin < start + 15) nowPlaying = slot
    else if (nowMin < start && !nextUp) nextUp = slot
  }

  function selectSlot(slot) {
    if (slot.status !== 'open') return
    setSlot(slot.time === selectedSlot ? null : slot.time)
    setShowForm(false)
    if (slot.time !== selectedSlot) {
      setTimeout(() => bookBtnRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100)
    }
  }

  function handleNext() {
    if (selectedSlot) {
      setShowForm(true)
      setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 150)
    }
  }

  function validate() {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Name is required'
    if (!form.phone.trim()) errs.phone = 'Phone number is required'
    else if (!/^(\+91[\s-]?)?[6-9]\d{9}$/.test(form.phone.replace(/[\s-]/g, '')))
      errs.phone = 'Enter a valid Indian phone number'
    if (!form.email.trim()) errs.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = 'Enter a valid email address'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  function handleBookClick() {
    if (!validate()) return
    setShowTerms(true)
  }

  function goToWhatsApp() {
    if (!validate()) return
    const dateInfo = FEST_DATES.find(d => d.date === selectedDate)
    const msg = encodeURIComponent(
      `🎮 *AREA 67 — VR Slot Booking*\n\n` +
      `*Date:* ${dateInfo.label} (${dateInfo.day})\n` +
      `*Time Slot:* ${selectedSlot}\n` +
      `*Name:* ${form.name}\n` +
      `*Phone:* ${form.phone}\n` +
      `*Email:* ${form.email}\n\n` +
      `Please confirm my slot! 🙏`
    )
    window.open(`https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${msg}`, '_blank')
    setDone(true)
    setShowForm(false)
    setSlot(null)
  }

  const dateInfo = FEST_DATES.find(d => d.date === selectedDate)
  const openSlots = slots.filter(s => s.status === 'open')

  return (
    <div className="min-h-screen"
      style={{ background: '#EEF4FF', backgroundImage: 'radial-gradient(#1B5CA8 1px, transparent 0)', backgroundSize: '24px 24px' }}
    >
      {/* Header */}
      <motion.header
        className="flex items-center justify-between border-b-4 border-black px-4 md:px-10 py-4 bg-white sticky top-0 z-50"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <Link to="/" className="flex items-center gap-3">
          <motion.img
            src="/logo.png"
            alt="Area 67"
            className="h-10 w-10 object-contain"
            animate={{ rotate: [0, -10, 10, -5, 5, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 5 }}
          />
          <h2 className="text-accent text-2xl font-display leading-tight tracking-wider uppercase">Area 67</h2>
        </Link>
        <Link to="/">
          <motion.button
            className="btn-comic bg-primary text-white px-5 h-10 text-sm flex items-center gap-2"
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
          >
            <span className="material-symbols-outlined text-base">home</span>
            HOME
          </motion.button>
        </Link>
      </motion.header>

      <div className="max-w-5xl mx-auto px-4 md:px-10 py-8">
        {/* Title */}
        <motion.div className="text-center mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-4xl md:text-5xl uppercase italic tracking-tight text-accent">
            ⚡ Live &amp; Book
          </h1>
        </motion.div>

        {/* Two tiles: Playing Now + Next Up */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <motion.div
            className="bg-white border-4 border-black p-6"
            style={{ boxShadow: '8px 8px 0 #FF6B00' }}
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex items-center gap-2 mb-4">
              {nowPlaying && <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />}
              <h2 className="font-display text-xl uppercase text-accent">🎮 Playing Now</h2>
            </div>
            {nowPlaying ? (
              <div>
                <p className="font-display text-3xl uppercase text-primary">{nowPlaying.userName || 'Anonymous'}</p>
                <p className="text-sm text-slate-500 font-bold mt-1">Slot: {nowPlaying.time}</p>
              </div>
            ) : (
              <p className="font-display text-lg uppercase text-slate-300">No one right now</p>
            )}
          </motion.div>

          <motion.div
            className="bg-white border-4 border-black p-6"
            style={{ boxShadow: '8px 8px 0 #1B5CA8' }}
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
          >
            <h2 className="font-display text-xl uppercase text-accent mb-4">⏭️ Next Up</h2>
            {nextUp ? (
              <div>
                <p className="font-display text-3xl uppercase text-secondary">{nextUp.userName || 'Booked'}</p>
                <p className="text-sm text-slate-500 font-bold mt-1">Slot: {nextUp.time}</p>
              </div>
            ) : (
              <p className="font-display text-lg uppercase text-slate-300">No one in queue</p>
            )}
          </motion.div>
        </div>

        {/* ─── Slot Picker + Booking ─── */}
        <motion.div
          className="bg-white border-4 border-black p-6 md:p-10"
          style={{ boxShadow: '12px 12px 0 #000' }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          {/* Header row */}
          <div className="flex items-center gap-4 mb-8 flex-wrap">
            <div className="flex items-center bg-primary border-4 border-black px-3 py-2"
                 style={{ boxShadow: '4px 4px 0 #000' }}>
              <span className="material-symbols-outlined text-black text-4xl">calendar_month</span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl uppercase italic tracking-tight text-black">
              Book a Slot
            </h2>
            <div className="ml-auto flex items-center gap-2">
              <span className="bg-emerald-500 border-2 border-black text-white px-3 py-1 font-display text-sm" style={{ boxShadow: '3px 3px 0 #000' }}>
                {openSlots.length} Free
              </span>
            </div>
          </div>

          {/* Day Picker */}
          <div className="flex gap-4 mb-8 flex-wrap">
            {FEST_DATES.map((d, i) => {
              const isToday = d.date === TODAY
              const isSelected = d.date === selectedDate
              const tilt = i % 2 === 0 ? '-rotate-2' : 'rotate-1'
              return (
                <motion.button
                  key={d.date}
                  onClick={() => setDate(d.date)}
                  className={`flex flex-col items-center justify-center min-w-[90px] py-4 px-6 border-4 border-black font-display transition-all ${tilt} ${
                    isSelected
                      ? 'bg-secondary text-white'
                      : isToday
                        ? 'bg-yellow-300 text-black hover:bg-yellow-400'
                        : 'bg-white text-black hover:bg-yellow-300'
                  }`}
                  style={{ boxShadow: isSelected ? '6px 6px 0 #000' : '4px 4px 0 #000' }}
                  whileTap={{ scale: 0.95 }}
                  animate={{ scale: isSelected ? 1.06 : 1 }}
                >
                  <span className="text-sm uppercase tracking-widest">{d.day}</span>
                  <span className="text-4xl leading-none">{d.num}</span>
                  {isToday && !isSelected && (
                    <span className="text-[9px] font-black uppercase tracking-widest mt-1 text-red-600">TODAY</span>
                  )}
                </motion.button>
              )
            })}
          </div>

          {/* Slot grid */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 mb-8">
            {slots.map((slot, i) => {
              const isOpen = slot.status === 'open'
              const isSelected = selectedSlot === slot.time
              const tilt = TILTS[i % TILTS.length]

              return (
                <motion.button
                  key={slot.time}
                  onClick={() => selectSlot(slot)}
                  disabled={!isOpen}
                  className={`p-3 border-4 border-black font-display transition-all ${tilt} ${
                    isSelected
                      ? 'bg-yellow-300 text-black scale-110 z-10'
                      : !isOpen
                        ? 'bg-slate-200 text-slate-400 opacity-60 cursor-not-allowed'
                        : 'bg-emerald-400 text-black hover:-translate-y-1 cursor-pointer'
                  }`}
                  style={{
                    boxShadow: isSelected ? '6px 6px 0 #000' : isOpen ? '4px 4px 0 #000' : 'none',
                  }}
                  whileTap={isOpen ? { scale: 0.95 } : {}}
                  animate={isSelected ? { rotate: 3 } : {}}
                >
                  <span className="block text-lg uppercase italic">{slot.time}</span>
                  <span className={`block text-[10px] font-black uppercase tracking-tighter ${isSelected ? 'underline' : ''}`}>
                    {isSelected ? 'SELECTED!' : isOpen ? 'FREE!' : 'TAKEN'}
                  </span>
                </motion.button>
              )
            })}
          </div>

          {/* Legend */}
          <div className="pt-6 border-t-4 border-dashed border-black flex flex-wrap gap-6 justify-center mb-6">
            {[
              { color: 'bg-emerald-400', label: 'Available' },
              { color: 'bg-yellow-300', label: 'Selected' },
              { color: 'bg-slate-200', label: 'Booked' },
            ].map(l => (
              <div key={l.label} className="flex items-center gap-3">
                <div className={`w-6 h-6 border-4 border-black ${l.color}`}
                     style={{ boxShadow: '3px 3px 0 #000' }} />
                <span className="font-display text-lg uppercase italic">{l.label}</span>
              </div>
            ))}
          </div>

          {/* CTA — proceed to form */}
          {!showForm && !done && (
            <div ref={bookBtnRef} className="flex justify-center">
              <motion.button
                onClick={handleNext}
                disabled={!selectedSlot}
                className={`btn-comic px-10 h-16 text-2xl font-display uppercase italic flex items-center gap-3 ${
                  selectedSlot ? 'bg-secondary text-white' : 'bg-slate-200 text-slate-400 opacity-50 cursor-not-allowed'
                }`}
                style={{ boxShadow: selectedSlot ? '6px 6px 0 #000' : 'none' }}
                whileHover={selectedSlot ? { scale: 1.04 } : {}}
                whileTap={selectedSlot ? { scale: 0.96 } : {}}
              >
                <span className="material-symbols-outlined text-3xl">lock</span>
                BOOK THIS SLOT!
              </motion.button>
            </div>
          )}
        </motion.div>

        {/* ─── Booking form (slides in below) ─── */}
        <AnimatePresence>
          {showForm && !done && (
            <motion.div
              ref={formRef}
              key="form"
              className="mt-4 bg-white border-4 border-black p-6 md:p-8"
              style={{ boxShadow: '8px 8px 0 #FF6B00' }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: 'spring', stiffness: 250, damping: 22 }}
            >
              <h3 className="font-display text-3xl uppercase italic text-black mb-2">
                Mission Briefing
              </h3>

              {/* Summary */}
              <div className="flex flex-wrap gap-4 py-4 border-y-4 border-black mb-6">
                <div className="flex flex-col">
                  <span className="font-marker text-xs uppercase text-slate-500">DATE</span>
                  <span className="font-display text-xl uppercase text-secondary">{dateInfo?.day}, {dateInfo?.label}</span>
                </div>
                <div className="w-0.5 bg-black hidden md:block" />
                <div className="flex flex-col">
                  <span className="font-marker text-xs uppercase text-slate-500">DURATION</span>
                  <span className="font-display text-xl uppercase text-secondary">15 Minutes</span>
                </div>
                <div className="w-0.5 bg-black hidden md:block" />
                <div className="flex flex-col">
                  <span className="font-marker text-xs uppercase text-slate-500">START TIME</span>
                  <span className="font-display text-2xl uppercase text-secondary">{selectedSlot}</span>
                </div>
              </div>

              {/* How it works */}
              <div className="mb-6">
                <h4 className="font-display text-lg uppercase tracking-widest mb-3 text-black">How It Works</h4>
                <div className="flex flex-col gap-3">
                  {[
                    { icon: 'chat', step: '1', text: 'Click "Book via WhatsApp" — your slot request is sent to our team instantly.' },
                    { icon: 'payments', step: '2', text: 'Our team replies with the payment amount. Pay via UPI / cash as instructed.' },
                    { icon: 'photo_camera', step: '3', text: 'Send your payment confirmation screenshot back in the chat.' },
                    { icon: 'mark_email_read', step: '4', text: 'You\'ll receive an email confirmation from our team once verified.' },
                    { icon: 'check_circle', step: '5', text: 'Done! Your slot is confirmed. Show up at Area 67 at your booked time.' },
                  ].map(({ icon, step, text }) => (
                    <div key={step} className="flex items-start gap-3 border-2 border-black px-4 py-3 bg-white"
                         style={{ boxShadow: '3px 3px 0 #000' }}>
                      <div className="flex-shrink-0 w-8 h-8 bg-primary border-2 border-black flex items-center justify-center">
                        <span className="font-display text-white text-sm">{step}</span>
                      </div>
                      <div className="flex items-center gap-2 flex-1">
                        <span className="material-symbols-outlined text-primary text-xl flex-shrink-0">{icon}</span>
                        <p className="text-sm font-bold text-slate-700">{text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Form fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div className="flex flex-col gap-1">
                  <label className="font-display text-sm uppercase tracking-widest">Your Name *</label>
                  <input
                    value={form.name} onChange={e => { setForm(f => ({ ...f, name: e.target.value })); setErrors(er => ({ ...er, name: undefined })) }}
                    placeholder="Hero Name"
                    className={`border-4 px-4 py-3 font-bold uppercase text-accent bg-white focus:outline-none focus:border-secondary focus:bg-yellow-50 transition-all ${errors.name ? 'border-red-500' : 'border-black'}`}
                    style={{ boxShadow: '4px 4px 0 #000' }}
                  />
                  {errors.name && <span className="text-red-500 text-xs font-bold mt-1">{errors.name}</span>}
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-display text-sm uppercase tracking-widest">Phone Number *</label>
                  <input
                    value={form.phone} onChange={e => { setForm(f => ({ ...f, phone: e.target.value })); setErrors(er => ({ ...er, phone: undefined })) }}
                    placeholder="+91 XXXXX XXXXX" type="tel"
                    className={`border-4 px-4 py-3 font-bold uppercase text-accent bg-white focus:outline-none focus:border-secondary focus:bg-yellow-50 transition-all ${errors.phone ? 'border-red-500' : 'border-black'}`}
                    style={{ boxShadow: '4px 4px 0 #000' }}
                  />
                  {errors.phone && <span className="text-red-500 text-xs font-bold mt-1">{errors.phone}</span>}
                </div>
              </div>
              <div className="mb-6">
                <div className="flex flex-col gap-1">
                  <label className="font-display text-sm uppercase tracking-widest">Email Address *</label>
                  <input
                    value={form.email} onChange={e => { setForm(f => ({ ...f, email: e.target.value })); setErrors(er => ({ ...er, email: undefined })) }}
                    placeholder="hero@example.com" type="email"
                    className={`border-4 px-4 py-3 font-bold text-accent bg-white focus:outline-none focus:border-secondary focus:bg-yellow-50 transition-all ${errors.email ? 'border-red-500' : 'border-black'}`}
                    style={{ boxShadow: '4px 4px 0 #000' }}
                  />
                  {errors.email && <span className="text-red-500 text-xs font-bold mt-1">{errors.email}</span>}
                </div>
              </div>

              {/* Disclaimer */}
              <div className="mb-4 border-4 border-black bg-yellow-50 p-4 relative"
                   style={{ boxShadow: '4px 4px 0 #000' }}>
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-secondary text-2xl flex-shrink-0 mt-0.5">warning</span>
                  <p className="text-xs font-bold uppercase text-slate-800 leading-relaxed">
                    ⚠️ Sending a WhatsApp message does <u>not</u> confirm your booking. Your slot is tentatively held but <strong>remains unconfirmed</strong> until a team member replies with a <strong>confirmation code</strong>. Complete payment, send your screenshot, and wait for the <strong>email confirmation</strong> to finalise.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  onClick={handleBookClick}
                  className="flex-1 btn-comic h-16 text-2xl font-display uppercase italic flex items-center justify-center gap-3 bg-primary text-white"
                  style={{ boxShadow: '6px 6px 0 #000' }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <span className="material-symbols-outlined text-3xl">gavel</span>
                  REVIEW TERMS &amp; BOOK
                </motion.button>
                <motion.button
                  onClick={() => { setShowForm(false); setSlot(null) }}
                  className="btn-comic px-8 h-16 text-xl font-display uppercase italic bg-white text-black"
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                >
                  ← CHANGE SLOT
                </motion.button>
              </div>
            </motion.div>
          )}

          {done && (
            <motion.div
              key="success"
              className="mt-4 flex flex-col items-center gap-6 py-12 px-6 bg-white border-4 border-black text-center"
              style={{ boxShadow: '8px 8px 0 #FF6B00' }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <motion.div
                className="action-bubble bg-primary text-white text-4xl border-4 border-black px-10 py-3"
                animate={{ rotate: [0, -5, 5, -3, 3, 0] }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                FLAME ON!
              </motion.div>
              <p className="font-display text-3xl uppercase text-accent">Request Sent!</p>
              <p className="font-marker text-lg text-slate-600 max-w-md">
                Slot request for <strong>{dateInfo?.label}</strong> at <strong>{selectedSlot}</strong> sent to our team!
              </p>

              <div className="w-full max-w-md flex flex-col gap-2 text-left">
                {[
                  { icon: 'payments', text: 'Wait for our team to reply with the payment amount.' },
                  { icon: 'photo_camera', text: 'Pay & send your payment confirmation screenshot.' },
                  { icon: 'mark_email_read', text: 'You\'ll receive an email confirmation from our team once verified.' },
                  { icon: 'check_circle', text: 'Your booking is confirmed — show up at Area 67 on time!' },
                ].map(({ icon, text }, i) => (
                  <div key={i} className="flex items-center gap-3 border-2 border-black px-3 py-2 bg-white"
                       style={{ boxShadow: '2px 2px 0 #000' }}>
                    <span className="material-symbols-outlined text-primary text-xl flex-shrink-0">{icon}</span>
                    <p className="text-sm font-bold text-slate-700">{text}</p>
                  </div>
                ))}
              </div>

              <motion.button
                className="btn-comic bg-secondary text-black px-10 h-12 text-xl font-display uppercase italic"
                onClick={() => { setDone(false); setSlot(null); setForm({ name: '', phone: '', email: '' }) }}
                whileHover={{ scale: 1.04 }}
              >
                BOOK ANOTHER SLOT
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Back */}
        <div className="text-center mt-8">
          <Link to="/">
            <motion.button
              className="btn-comic bg-primary text-white px-8 h-12 text-lg font-display uppercase italic"
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
            >
              ← Back to Area 67
            </motion.button>
          </Link>
        </div>
      </div>

      {/* ─── Terms & Conditions Modal ─── */}
      <AnimatePresence>
        {showTerms && (
          <motion.div
            className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 px-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setShowTerms(false)}
          >
            <motion.div
              className="bg-white border-4 border-black w-full max-w-2xl max-h-[85vh] flex flex-col"
              style={{ boxShadow: '10px 10px 0 #FF6B00' }}
              initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.85, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b-4 border-black bg-primary">
                <h3 className="font-display text-2xl uppercase italic text-white tracking-wide">
                  ⚖️ Terms &amp; Conditions
                </h3>
                <button onClick={() => setShowTerms(false)} className="text-white hover:text-yellow-300 transition-colors">
                  <span className="material-symbols-outlined text-3xl">close</span>
                </button>
              </div>

              {/* Scrollable content */}
              <div className="flex-1 overflow-y-auto p-5 space-y-6 text-sm">
                {[
                  {
                    title: 'General Rules',
                    icon: 'rule',
                    items: [
                      'All participants must follow instructions given by Area 67 staff at all times.',
                      'Area 67 reserves the right to deny entry or remove any participant who poses a safety risk.',
                      'Food, drinks, and personal belongings must be kept outside the VR play area.',
                      'Participants are responsible for any damage caused to VR equipment due to misuse.',
                      'Photography and videography of the VR setup or other participants is not permitted without consent.',
                    ],
                  },
                  {
                    title: 'Health & Safety',
                    icon: 'health_and_safety',
                    items: [
                      'VR experiences are not recommended for individuals with epilepsy, serious heart conditions, or severe motion sickness.',
                      'Participants who feel dizzy, nauseous, or unwell must immediately stop and notify staff.',
                      'Children under 8 years of age are not permitted to use VR headsets.',
                      'Pregnant participants are advised not to use VR headsets.',
                      'Wrist straps must be attached to controllers at all times during play.',
                    ],
                  },
                  {
                    title: 'Booking Policy',
                    icon: 'event_available',
                    items: [
                      'Slot bookings are requests only — a booking is NOT confirmed until you receive a confirmation message from the Area 67 team.',
                      'The team will reply via WhatsApp with a payment amount and a unique confirmation code.',
                      'Payment must be completed and a screenshot sent back to the team to finalise your booking.',
                      'Booked slots not attended within 5 minutes of the scheduled time may be forfeited.',
                      'Refunds are not provided for no-shows or late cancellations (within 1 hour of the slot).',
                      'Area 67 reserves the right to reschedule or cancel slots in case of technical issues.',
                    ],
                  },
                  {
                    title: 'Liability',
                    icon: 'shield',
                    items: [
                      'Area 67 and Apoorv Fest / IIIT Kottayam are not liable for any physical injury sustained during VR experiences.',
                      'Participants use all VR equipment entirely at their own risk.',
                      'Area 67 is not responsible for loss of personal belongings on the premises.',
                      'By booking a slot, participants agree to all rules and policies listed here.',
                    ],
                  },
                ].map(({ title, icon, items }) => (
                  <div key={title}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="material-symbols-outlined text-primary text-xl">{icon}</span>
                      <h4 className="font-display text-lg uppercase tracking-widest text-black">{title}</h4>
                    </div>
                    <ul className="space-y-2 ml-1">
                      {items.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-secondary font-black mt-0.5">›</span>
                          <span className="text-slate-700 font-bold leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                <div ref={termsEndRef} />
              </div>

              {/* Accept + Book button */}
              <div className="p-5 border-t-4 border-black bg-yellow-50">
                <p className="text-xs font-bold text-slate-600 uppercase text-center mb-3">
                  By clicking below, you agree to all the terms &amp; conditions above.
                </p>
                <motion.button
                  onClick={() => { setShowTerms(false); goToWhatsApp() }}
                  className="w-full btn-comic h-14 text-xl font-display uppercase italic flex items-center justify-center gap-3 bg-primary text-white"
                  style={{ boxShadow: '6px 6px 0 #000' }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <span className="material-symbols-outlined text-2xl">chat</span>
                  I ACCEPT — BOOK VIA WHATSAPP!
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
