import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const FLOATING_WORDS = [
  { text: 'FLAME ON!',   x: '8%',  y: '12%', rotate: -15, color: '#FF6B00', delay: 0.3 },
  { text: 'FANTASTIC!',  x: '82%', y: '8%',  rotate: 12,  color: '#1B5CA8', delay: 0.8 },
  { text: 'CLOBBER!',    x: '75%', y: '70%', rotate: -8,  color: '#FF6B00', delay: 1.2 },
  { text: 'STRETCH!',    x: '5%',  y: '68%', rotate: 10,  color: '#1B5CA8', delay: 0.6 },
  { text: 'INVISIBLE!',  x: '88%', y: '40%', rotate: -5,  color: '#FF6B00', delay: 1.5 },
]


export default function LandingHero({ onExploreCatalogue }) {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4 py-24">
      {/* Grid bg */}
      <div className="absolute inset-0 pointer-events-none"
           style={{
             backgroundImage: 'radial-gradient(#00000015 1px, transparent 0)',
             backgroundSize: '24px 24px',
           }} />

      {/* Speed-line burst from center */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute origin-bottom"
            style={{
              width: 2,
              height: '50vmax',
              background: i % 3 === 0
                ? 'rgba(27,92,168,0.07)'
                : i % 3 === 1
                  ? 'rgba(255,107,0,0.08)'
                  : 'rgba(0,0,0,0.04)',
              rotate: `${i * 18}deg`,
              bottom: '50%',
              left: '50%',
              transformOrigin: 'bottom center',
              translateX: '-50%',
            }}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: i * 0.04, duration: 0.6, ease: 'easeOut' }}
          />
        ))}
      </div>

      {/* Floating comic words */}
      {FLOATING_WORDS.map((w, i) => (
        <motion.div
          key={i}
          className="absolute font-display text-3xl md:text-5xl font-black select-none pointer-events-none"
          style={{ left: w.x, top: w.y, color: w.color, rotate: `${w.rotate}deg`,
                   WebkitTextStroke: '2px #000', textShadow: '3px 3px 0 #000' }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: w.delay, type: 'spring', stiffness: 300 }}
        >
          <motion.span
            animate={{ y: [0, -8, 0], rotate: [w.rotate, w.rotate + 3, w.rotate] }}
            transition={{ duration: 3 + i * 0.4, repeat: Infinity, ease: 'easeInOut' }}
            style={{ display: 'block' }}
          >
            {w.text}
          </motion.span>
        </motion.div>
      ))}

      {/* Main content */}
      <div className="relative z-10 max-w-5xl w-full text-center flex flex-col items-center gap-8">

        {/* Event badge */}
        <motion.div
          className="inline-flex items-center gap-2 bg-black text-white font-display text-sm md:text-base px-5 py-2 tracking-widest uppercase"
          style={{ border: '3px solid #000', boxShadow: '4px 4px 0 #FFB703' }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <motion.span
            className="material-symbols-outlined text-primary text-base"
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >local_fire_department</motion.span>
          APOORV FEST · IIIT KOTTAYAM · FANTASTIC FOUR ZONE
        </motion.div>

        {/* Main headline */}
        <div className="relative">
          {/* Shadow block */}
          <div className="absolute inset-0 translate-x-3 translate-y-3 bg-primary opacity-30 border-4 border-primary" />
          <motion.h1
            className="relative font-display text-6xl sm:text-8xl md:text-[10rem] leading-none uppercase text-accent bg-white border-4 border-black px-6 py-4"
            style={{ textShadow: '4px 4px 0 #FFB703, 7px 7px 0 #000', letterSpacing: '-0.02em' }}
            initial={{ opacity: 0, scale: 0.7, rotate: -4 }}
            animate={{ opacity: 1, scale: 1, rotate: -2 }}
            transition={{ delay: 0.4, type: 'spring', stiffness: 220, damping: 16 }}
          >
            ENTER THE{' '}
            <span className="text-primary block sm:inline">FANTASTIC ZONE</span>
          </motion.h1>
        </div>

        {/* Tagline */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.65, type: 'spring', stiffness: 180 }}
        >
          <div className="absolute -left-3 -top-3 w-full h-full bg-secondary border-2 border-black -z-10" />
          <p className="bg-white border-[3px] border-black px-6 py-3 font-marker text-lg md:text-2xl text-accent max-w-3xl">
            10+ MIND-BENDING VR EXPERIENCES — BOOK A SLOT, STRAP IN, AND
            BECOME FANTASTIC. IT&apos;S CLOBBERIN&apos; TIME!
          </p>
        </motion.div>


        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 mt-2"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.05 }}
        >
          <Link to="/live">
            <motion.button
              className="px-10 h-16 btn-comic bg-primary text-white text-2xl font-display tracking-wider flex items-center gap-3"
              whileHover={{ scale: 1.04 }}
              whileTap={{ x: 4, y: 4 }}
            >
              <span className="material-symbols-outlined">calendar_clock</span>
              BOOK A SLOT
            </motion.button>
          </Link>

          <motion.button
            onClick={onExploreCatalogue}
            className="px-10 h-16 btn-comic bg-secondary text-accent text-2xl font-display tracking-wider flex items-center gap-3"
            whileHover={{ scale: 1.04 }}
            whileTap={{ x: 4, y: 4 }}
          >
            EXPLORE GAMES
            <motion.span
              className="material-symbols-outlined"
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            >arrow_downward</motion.span>
          </motion.button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.6, repeat: Infinity }}
      >
        <span className="font-display text-xs text-gray-400 tracking-widest uppercase">Scroll</span>
        <div className="w-0.5 h-10 bg-gradient-to-b from-black to-transparent" />
      </motion.div>
    </section>
  )
}
