import { useRef } from 'react'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import LandingHero from '../components/LandingHero'
import GameGrid from '../components/GameGrid'
import Footer from '../components/Footer'

export default function Home() {
  const catalogueRef = useRef(null)

  const scrollTo = (ref) => ref.current?.scrollIntoView({ behavior: 'smooth' })

  return (
    <div className="relative flex flex-col min-h-screen overflow-x-hidden">
      <Navbar onCatalogue={() => scrollTo(catalogueRef)} />

      {/* Landing hero — full screen */}
      <LandingHero
        onExploreCatalogue={() => scrollTo(catalogueRef)}
      />

      {/* Catalogue */}
      <section ref={catalogueRef} className="flex flex-col p-4 md:p-10 max-w-7xl mx-auto w-full gap-8 pt-16">
        <motion.div
          className="flex flex-col gap-2"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 200 }}
        >
          <h2 className="font-display text-5xl md:text-7xl uppercase text-accent italic"
              style={{ textShadow: '3px 3px 0 #FFB703, 5px 5px 0 #000' }}>
            The Hero&apos;s <span className="text-primary">Catalog</span>
          </h2>
          <p className="font-marker text-accent text-lg max-w-2xl">
            &quot;CHOOSE YOUR DESTINY, HERO! GRAB YOUR HAPTIC GEAR AND STEP INTO THE FRAY.&quot;
          </p>
        </motion.div>

        <GameGrid />
      </section>

      <Footer />
    </div>
  )
}
