import { motion } from 'framer-motion'

export default function HeroSection() {
  return (
    <div className="flex flex-col gap-4 items-center md:items-start">
      {/* Title */}
      <motion.h1
        className="title-skew text-accent text-6xl md:text-8xl font-display leading-none tracking-tight uppercase italic bg-white border-4 border-black px-6 py-2"
        initial={{ opacity: 0, x: -100, rotate: -8 }}
        animate={{ opacity: 1, x: 0, rotate: -2 }}
        transition={{ type: 'spring', stiffness: 200, damping: 18, delay: 0.15 }}
        whileHover={{ rotate: -3, scale: 1.02, transition: { duration: 0.15 } }}
      >
        The Hero&apos;s <span className="text-primary">Catalog</span>
      </motion.h1>

      {/* Tagline quote */}
      <motion.div
        className="relative"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, type: 'spring', stiffness: 200 }}
      >
        <div className="absolute -left-4 -top-4 w-full h-full bg-secondary -z-10 border-2 border-black" />
        <motion.p
          className="bg-white border-[3px] border-black p-4 text-accent text-xl font-bold font-marker max-w-2xl relative"
          whileHover={{
            x: -4,
            transition: { duration: 0.1 },
          }}
        >
          &quot;CHOOSE YOUR DESTINY, HERO! GRAB YOUR HAPTIC GEAR AND STEP INTO THE FRAY. THE FANTASTIC FOUR AWAIT YOUR COMMAND!&quot;
        </motion.p>
      </motion.div>
    </div>
  )
}
