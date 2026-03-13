import { motion } from 'framer-motion'
import { CATEGORIES } from './GameGrid'

export default function FilterBar({ active, setActive }) {
  return (
    <motion.div
      className="flex flex-wrap gap-3"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.2 }}
    >
      {CATEGORIES.map((f, i) => {
        const isActive = f === active
        return (
          <motion.button
            key={f}
            onClick={() => setActive(f)}
            className={`flex h-11 items-center justify-center gap-x-2 btn-comic px-5 text-base transition-colors ${
              isActive ? 'bg-primary text-white' : 'bg-white text-accent hover:bg-secondary'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.06 }}
            whileTap={{ scale: 0.93 }}
          >
            {f}
          </motion.button>
        )
      })}
    </motion.div>
  )
}
