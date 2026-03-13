import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FEST_DATES } from '../../store/gameStore'
import { socket, api, apiPost } from '../../lib/socket'

export default function SlotManager() {
  const [activeDate, setDate] = useState(FEST_DATES[0].date)
  const [slots, setSlots]     = useState([])
  const [newTime, setNewTime] = useState('')
  const [error, setError]     = useState('')
  
  // Booking modal state
  const [bookingSlot, setBookingSlot] = useState(null)
  const [bookingForm, setBookingForm] = useState({ userName: '', userEmail: '' })
  const [bookingResult, setBookingResult] = useState(null)
  const [bookingLoading, setBookingLoading] = useState(false)

  function refresh() {
    api(`/slots/${activeDate}`).then(data => setSlots(data))
  }

  useEffect(() => { 
    refresh()
    setNewTime('')
    setError('')
  }, [activeDate])

  // Real-time updates via Socket.IO
  useEffect(() => {
    function onSlotsUpdated({ date, slots: updatedSlots }) {
      if (date === activeDate) setSlots(updatedSlots)
    }
    socket.on('slotsUpdated', onSlotsUpdated)
    return () => socket.off('slotsUpdated', onSlotsUpdated)
  }, [activeDate])

  async function toggle(time) {
    const slot = slots.find(s => s.time === time)
    if (!slot) return

    // If slot is open, show booking modal instead of direct toggle
    if (slot.status === 'open') {
      setBookingSlot(time)
      setBookingForm({ userName: '', userEmail: '' })
      setBookingResult(null)
      return
    }

    // If booked, toggle back to open
    await apiPost(`/slots/${activeDate}/status`, { time, status: 'open' })
  }

  async function handleBook(e) {
    e.preventDefault()
    if (!bookingForm.userName || !bookingForm.userEmail) return
    setBookingLoading(true)

    const result = await apiPost(`/slots/${activeDate}/book`, {
      time: bookingSlot,
      userName: bookingForm.userName,
      userEmail: bookingForm.userEmail,
    })

    setBookingLoading(false)
    if (result.success) {
      setBookingResult(result)
    } else {
      setError(result.error || 'Booking failed')
      setBookingSlot(null)
    }
  }

  async function bulkSet(status) {
    await apiPost(`/slots/${activeDate}/bulk`, { status })
  }

  async function handleAddTime(e) {
    e.preventDefault()
    setError('')
    
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
    if (!timeRegex.test(newTime)) {
      setError('Invalid format. Use HH:MM (e.g., 14:30)')
      return
    }

    const result = await apiPost(`/slots/${activeDate}/add`, { time: newTime })
    if (result.error) {
      setError(result.error)
      return
    }
    setNewTime('')
  }

  async function handleRemoveTime(time) {
    if (confirm(`Remove ${time} from ${activeDate}?`)) {
      await apiPost(`/slots/${activeDate}/remove`, { time })
    }
  }

  async function handleReset() {
    if (confirm(`Reset ${activeDate} to default 15-min slots (10:00 - 17:00)?`)) {
      await apiPost(`/slots/${activeDate}/reset`)
    }
  }

  const openCount   = slots.filter(s => s.status === 'open').length
  const bookedCount = slots.filter(s => s.status === 'booked' || s.status === 'playing').length

  return (
    <div className="flex flex-col gap-6">
      {/* Info */}
      <div className="flex items-start gap-3 bg-secondary border-[3px] border-black p-4 text-white"
           style={{ boxShadow: '4px 4px 0 #000' }}>
        <span className="material-symbols-outlined text-white text-xl flex-shrink-0 mt-0.5">info</span>
        <p className="font-bold text-sm leading-relaxed">
          Click an <strong>open slot</strong> to book it — you'll be asked for user name & email. A confirmation email is sent automatically.
          Click a <strong>booked slot</strong> to release it back to open.
        </p>
      </div>

      {/* Day tabs */}
      <div className="flex gap-3 flex-wrap">
        {FEST_DATES.map((d, i) => {
          const isActive = d.date === activeDate
          const tilt     = i % 2 === 0 ? '-rotate-1' : 'rotate-1'
          return (
            <motion.button
              key={d.date}
              onClick={() => setDate(d.date)}
              className={`flex flex-col items-center justify-center min-w-[80px] py-3 px-5 border-4 border-black font-display ${tilt} transition-all ${
                isActive ? 'bg-primary text-black' : 'bg-white text-black hover:bg-secondary hover:text-white'
              }`}
              style={{ boxShadow: '4px 4px 0 #000' }}
              whileTap={{ scale: 0.96 }}
              animate={{ scale: isActive ? 1.06 : 1 }}
            >
              <span className="text-xs uppercase tracking-widest">{d.day}</span>
              <span className="text-3xl leading-none">{d.num}</span>
            </motion.button>
          )
        })}
      </div>

      {/* Stats + bulk + reset */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-4">
          <div className="flex items-center gap-2 bg-emerald-50 border-[3px] border-black px-4 py-2"
               style={{ boxShadow: '3px 3px 0 #000' }}>
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="font-display text-lg uppercase">{openCount} Open</span>
          </div>
          <div className="flex items-center gap-2 bg-red-50 border-[3px] border-black px-4 py-2"
               style={{ boxShadow: '3px 3px 0 #000' }}>
            <span className="w-3 h-3 rounded-full bg-red-500" />
            <span className="font-display text-lg uppercase">{bookedCount} Booked</span>
          </div>
        </div>
        <div className="flex gap-2">
          <motion.button
            onClick={() => bulkSet('open')}
            className="btn-comic bg-emerald-500 text-white px-4 h-10 text-sm"
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
          >OPEN ALL</motion.button>
          <motion.button
            onClick={handleReset}
            className="btn-comic bg-slate-600 text-white px-4 h-10 text-sm"
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
          >RESET TO DEFAULT</motion.button>
        </div>
      </div>

      {/* Add new time slot */}
      <div className="border-4 border-black bg-yellow-50 p-5" style={{ boxShadow: '4px 4px 0 #000' }}>
        <h4 className="font-display text-lg uppercase mb-3">Add New Time Slot for {activeDate}</h4>
        <form onSubmit={handleAddTime} className="flex gap-3 items-end">
          <div className="flex-1 max-w-xs flex flex-col gap-1">
            <label className="font-display text-xs uppercase tracking-widest">Time (24-hour format)</label>
            <input
              type="text"
              value={newTime}
              onChange={e => setNewTime(e.target.value)}
              placeholder="14:30"
              className="border-[3px] border-black bg-white px-4 py-2.5 font-bold text-accent focus:outline-none focus:border-primary transition-all"
              style={{ boxShadow: '3px 3px 0 #000' }}
            />
            {error && <p className="text-xs text-red-600 font-bold">{error}</p>}
          </div>
          <motion.button
            type="submit"
            className="btn-comic bg-primary text-white h-11 px-6 text-sm"
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
          >
            ADD TIME
          </motion.button>
        </form>
      </div>

      {/* Slot grid */}
      <div>
        <p className="text-xs uppercase font-display tracking-widest text-slate-500 mb-3">
          Time Slots ({slots.length}) — Click OPEN to book, click BOOKED to release, hover to delete
        </p>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
          <AnimatePresence>
            {slots.map((slot, i) => {
              const isOpen = slot.status === 'open'
              const tilt   = i % 3 === 0 ? 'rotate-1' : i % 3 === 1 ? '-rotate-1' : 'rotate-0'
              return (
                <motion.div
                  key={slot.time}
                  className="relative group"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  layout
                >
                  <motion.button
                    onClick={() => toggle(slot.time)}
                    className={`w-full flex flex-col items-center py-3 px-1 border-[3px] border-black font-display text-sm uppercase transition-all ${tilt} ${
                      isOpen ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800' : 'bg-red-100 text-red-800'
                    }`}
                    style={{ boxShadow: '3px 3px 0 #000' }}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95, y: 2 }}
                    title={isOpen ? `Book ${slot.time}` : `Release ${slot.time} (${slot.userName})`}
                  >
                    <span className="text-base mb-0.5">{isOpen ? '🟢' : '🔴'}</span>
                    <span className="text-xs font-black">{slot.time}</span>
                    <span className="text-[9px] uppercase font-bold">{isOpen ? 'OPEN' : 'BOOKED'}</span>
                    {!isOpen && slot.userName && (
                      <span className="text-[8px] font-bold truncate max-w-full px-1">{slot.userName}</span>
                    )}
                  </motion.button>
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRemoveTime(slot.time)
                    }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 border-2 border-black text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    title="Delete this time slot"
                  >
                    ×
                  </motion.button>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      </div>

      <p className="text-sm font-medium text-slate-500">
        💡 Click <strong>green slots</strong> to book (enter name + email). Click <strong>red slots</strong> to release. Hover to delete.
      </p>

      {/* ─── Booking Modal ─── */}
      <AnimatePresence>
        {bookingSlot && !bookingResult && (
          <motion.div
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setBookingSlot(null)}
          >
            <motion.div
              className="bg-white border-4 border-black p-6 md:p-8 w-full max-w-md"
              style={{ boxShadow: '10px 10px 0 #000' }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-primary border-3 border-black px-3 py-1" style={{ boxShadow: '3px 3px 0 #000' }}>
                  <span className="font-display text-white text-xl">{bookingSlot}</span>
                </div>
                <div>
                  <h3 className="font-display text-2xl uppercase text-accent">Book Slot</h3>
                  <p className="text-xs text-slate-500 font-bold">{activeDate}</p>
                </div>
              </div>

              <form onSubmit={handleBook} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label className="font-display text-xs uppercase tracking-widest">User Name *</label>
                  <input
                    value={bookingForm.userName}
                    onChange={e => setBookingForm(f => ({ ...f, userName: e.target.value }))}
                    placeholder="Hero Name"
                    className="border-[3px] border-black px-4 py-3 font-bold text-accent bg-white focus:outline-none focus:border-primary transition-all"
                    style={{ boxShadow: '3px 3px 0 #000' }}
                    autoFocus
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-display text-xs uppercase tracking-widest">User Email *</label>
                  <input
                    type="email"
                    value={bookingForm.userEmail}
                    onChange={e => setBookingForm(f => ({ ...f, userEmail: e.target.value }))}
                    placeholder="hero@example.com"
                    className="border-[3px] border-black px-4 py-3 font-bold text-accent bg-white focus:outline-none focus:border-primary transition-all"
                    style={{ boxShadow: '3px 3px 0 #000' }}
                    required
                  />
                </div>

                <div className="border-3 border-black bg-yellow-50 p-3" style={{ boxShadow: '3px 3px 0 #000' }}>
                  <p className="text-xs font-bold text-slate-600">
                    📧 A confirmation email will be sent automatically to the user with a unique confirmation code.
                  </p>
                </div>

                <div className="flex gap-3">
                  <motion.button
                    type="submit"
                    disabled={bookingLoading || !bookingForm.userName || !bookingForm.userEmail}
                    className={`flex-1 btn-comic h-12 text-lg font-display uppercase ${
                      bookingLoading ? 'bg-slate-300 text-slate-500' : 'bg-primary text-white'
                    }`}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {bookingLoading ? '⏳ SENDING...' : '📧 BOOK & SEND EMAIL'}
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={() => setBookingSlot(null)}
                    className="btn-comic bg-white text-black h-12 px-4 text-sm font-display uppercase"
                    whileHover={{ scale: 1.03 }}
                  >
                    CANCEL
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}

        {/* Booking success modal */}
        {bookingResult && (
          <motion.div
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => { setBookingSlot(null); setBookingResult(null) }}
          >
            <motion.div
              className="bg-white border-4 border-black p-8 w-full max-w-md text-center"
              style={{ boxShadow: '10px 10px 0 #FF6B00' }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <motion.div
                className="action-bubble bg-primary text-white text-3xl border-4 border-black px-8 mb-4 inline-block"
                animate={{ rotate: [0, -5, 5, -3, 3, 0] }}
                transition={{ duration: 0.6 }}
              >
                BOOKED!
              </motion.div>
              <p className="font-display text-2xl uppercase text-accent mb-2">Slot Confirmed!</p>
              
              <div className="bg-black border-4 border-secondary px-6 py-4 my-4 inline-block" style={{ boxShadow: '4px 4px 0 #1B5CA8' }}>
                <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">Confirmation Code</p>
                <p className="text-3xl font-mono font-black text-yellow-400 tracking-widest">
                  {bookingResult.confirmationCode}
                </p>
              </div>

              <p className="text-sm text-slate-600 mb-2">
                {bookingResult.emailSent 
                  ? `✅ Confirmation email sent to ${bookingForm.userEmail}` 
                  : `⚠️ Email failed to send. Share the code manually.`
                }
              </p>

              <motion.button
                onClick={() => { setBookingSlot(null); setBookingResult(null) }}
                className="btn-comic bg-secondary text-black px-8 h-12 text-lg font-display uppercase mt-4"
                whileHover={{ scale: 1.04 }}
              >
                DONE
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
