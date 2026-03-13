import { motion } from 'framer-motion'

const COMICS_WORDS = ['POW!', 'ZAP!', 'BAM!', 'BOOM!', 'WOW!']

// Individual halftone dot for bg
const HalftoneDot = ({ x, y, delay, size }) => (
  <motion.div
    className="absolute rounded-full bg-black"
    style={{ left: x, top: y, width: size, height: size }}
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity: [0, 0.15, 0.08], scale: [0, 1, 0.9] }}
    transition={{ delay, duration: 0.4, repeat: Infinity, repeatDelay: Math.random() * 2 + 1 }}
  />
)

// Burst star shape
const BurstStar = ({ x, y, delay, color }) => (
  <motion.div
    className="absolute font-display text-4xl md:text-6xl font-black select-none pointer-events-none"
    style={{ left: x, top: y, color }}
    initial={{ opacity: 0, scale: 0, rotate: -20 }}
    animate={{
      opacity: [0, 1, 1, 0],
      scale: [0, 1.2, 1, 0.8],
      rotate: [-20, 5, 0, 10],
    }}
    transition={{
      delay,
      duration: 0.6,
      times: [0, 0.3, 0.7, 1],
      repeat: Infinity,
      repeatDelay: 2.5,
    }}
  >
    {COMICS_WORDS[Math.floor(Math.random() * COMICS_WORDS.length)]}
  </motion.div>
)

export default function LoadingScreen({ onDone }) {
  const burstPositions = [
    { x: '5%',  y: '10%', delay: 0.2,  color: '#1B5CA8' },
    { x: '80%', y: '5%',  delay: 0.6,  color: '#FF6B00' },
    { x: '70%', y: '75%', delay: 1.0,  color: '#1B5CA8' },
    { x: '10%', y: '70%', delay: 1.4,  color: '#000' },
    { x: '50%', y: '15%', delay: 0.9,  color: '#FF6B00' },
    { x: '85%', y: '45%', delay: 1.8,  color: '#1B5CA8' },
  ]

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
      style={{
        backgroundColor: '#EEF4FF',
        backgroundImage: 'radial-gradient(#000000 1px, transparent 0)',
        backgroundSize: '24px 24px',
      }}
      initial={{ opacity: 1 }}
      exit={{
        y: '-100%',
        transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] },
      }}
    >
      {/* Action word bursts */}
      {burstPositions.map((b, i) => (
        <BurstStar key={i} {...b} />
      ))}

      {/* Speed lines radiating out */}
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute origin-center bg-black"
          style={{
            width: 2,
            height: '55%',
            left: '50%',
            top: '0%',
            transformOrigin: 'bottom center',
            rotate: `${i * 30}deg`,
            translateX: '-50%',
          }}
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: [0, 1, 0], opacity: [0, 0.07, 0] }}
          transition={{
            delay: 0.1 * i,
            duration: 0.8,
            repeat: Infinity,
            repeatDelay: 1.4,
          }}
        />
      ))}

      {/* Main logo container */}
      <div className="relative flex flex-col items-center z-10">
        {/* Starburst behind title */}
        <motion.div
          className="absolute w-80 h-80 md:w-[28rem] md:h-[28rem]"
          style={{ zIndex: -1 }}
          initial={{ rotate: 0, scale: 0 }}
          animate={{ rotate: 360, scale: 1 }}
          transition={{ rotate: { duration: 20, repeat: Infinity, ease: 'linear' }, scale: { duration: 0.5 } }}
        >
          <svg viewBox="0 0 200 200" className="w-full h-full">
            {Array.from({ length: 16 }).map((_, i) => {
              const angle = (i * 360) / 16
              return (
                <polygon
                  key={i}
                  points="100,10 105,90 100,100 95,90"
                  fill={i % 2 === 0 ? '#FF6B00' : '#1B5CA8'}
                  transform={`rotate(${angle}, 100, 100)`}
                  opacity="0.85"
                />
              )
            })}
            <circle cx="100" cy="100" r="60" fill="#EEF4FF" stroke="#000" strokeWidth="4" />
          </svg>
        </motion.div>

        {/* Bolt icon */}
        <motion.div
          className="text-primary text-7xl md:text-9xl leading-none mb-2"
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 300, damping: 15 }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 'inherit', fontVariationSettings: "'FILL' 1, 'wght' 700" }}>
            local_fire_department
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          className="font-display text-5xl md:text-8xl uppercase tracking-wider text-center leading-none"
          style={{ textShadow: '4px 4px 0px #FF6B00, 7px 7px 0px #000' }}
          initial={{ scale: 0.3, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.35, type: 'spring', stiffness: 280, damping: 14 }}
        >
          Area
          <br />
          <span className="text-primary">67</span>
        </motion.h1>

        {/* Tagline bubble */}
        <motion.div
          className="mt-6 bg-white border-4 border-black px-6 py-2 font-marker text-lg md:text-2xl text-center relative"
          style={{ boxShadow: '5px 5px 0px #000' }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, type: 'spring', stiffness: 200 }}
        >
          <div className="absolute -top-4 -left-4 w-full h-full bg-secondary -z-10 border-2 border-black" />
          ASSEMBLING THE FANTASTIC FOUR...
        </motion.div>

        {/* Comic progress bar */}
        <motion.div
          className="mt-8 w-72 md:w-96 border-4 border-black bg-white overflow-hidden relative"
          style={{ height: 28, boxShadow: '4px 4px 0px #000' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <motion.div
            className="h-full bg-primary absolute left-0 top-0 flex items-center justify-end pr-3"
            style={{
              backgroundImage: 'repeating-linear-gradient(-45deg, #E63946 0px, #E63946 8px, #c0303a 8px, #c0303a 16px)',
            }}
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ delay: 1, duration: 2, ease: 'easeInOut' }}
          />
          <span className="absolute inset-0 flex items-center justify-center font-display text-sm uppercase tracking-widest z-10 text-black mix-blend-difference">
            FLAME ON!
          </span>
        </motion.div>

        {/* Percentage counter */}
        <PercentCounter />
      </div>
    </motion.div>
  )
}

function PercentCounter() {
  return (
    <motion.div
      className="mt-3 font-display text-2xl text-black tracking-widest"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.9 }}
    >
      <motion.span
        initial={{ textContent: 0 }}
        animate={{ textContent: 100 }}
        transition={{ delay: 1, duration: 2, ease: 'easeInOut' }}
        onUpdate={(latest) => {
          const el = document.getElementById('pct-counter')
          if (el) el.textContent = `${Math.round(latest.textContent)}%`
        }}
      >
        <span id="pct-counter">0%</span>
      </motion.span>
    </motion.div>
  )
}
