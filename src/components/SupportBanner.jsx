import { motion } from 'framer-motion'

export default function SupportBanner() {
  return (
    <motion.div
      className="mt-16 p-8 bg-white border-4 border-black shadow-[10px_10px_0px_#1B5CA8] flex flex-col md:flex-row items-center justify-between gap-8 relative"
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ type: 'spring', stiffness: 160, damping: 18 }}
    >
      {/* POW bubble */}
      <motion.div
        className="absolute -top-6 -left-6 action-bubble bg-secondary text-2xl border-4 -rotate-6"
        animate={{ rotate: [-6, -10, -3, -8, -6] }}
        transition={{ duration: 3, repeat: Infinity, repeatType: 'mirror' }}
      >
        FLAME ON!
      </motion.div>

      <div className="flex items-center gap-6">
        <motion.div
          className="w-16 h-16 border-4 border-black bg-primary flex items-center justify-center text-white rotate-3"
          animate={{ rotate: [3, -3, 4, -2, 3] }}
          transition={{ duration: 4, repeat: Infinity, repeatType: 'mirror' }}
          whileHover={{ scale: 1.15, rotate: 0 }}
        >
          <span className="material-symbols-outlined text-4xl">help</span>
        </motion.div>
        <div>
          <h4 className="text-accent font-display text-3xl uppercase tracking-wider">New Initiate?</h4>
          <p className="text-accent font-bold font-marker">
            OUR MENTORS WILL TRAIN YOU IN THE ARTS OF VIRTUAL REALITY!
          </p>
        </div>
      </div>

      <motion.button
        className="px-10 h-14 btn-comic bg-secondary text-accent font-black text-xl hover:bg-yellow-400"
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97, x: 4, y: 4 }}
      >
        SUMMON AN EXPERT
      </motion.button>
    </motion.div>
  )
}
