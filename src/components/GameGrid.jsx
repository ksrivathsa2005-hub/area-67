import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { getGames } from '../store/gameStore'


const cardVariants = {
  hidden:  { opacity: 0, y: 50, scale: 0.95 },
  visible: (i) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { delay: i * 0.1, type: 'spring', stiffness: 220, damping: 18 },
  }),
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
}

function GamePopup({ game, onClose, onBook }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <motion.div
      className="fixed inset-0 z-[9998] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60" />

      <motion.div
        className="relative bg-white border-4 border-black max-w-lg w-full max-h-[90vh] overflow-y-auto"
        style={{ boxShadow: '10px 10px 0 #000' }}
        initial={{ scale: 0.8, rotate: -3 }}
        animate={{ scale: 1, rotate: 0 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 280, damping: 20 }}
        onClick={e => e.stopPropagation()}
      >
        {/* Image */}
        {game.img && (
          <div className="aspect-video w-full relative border-b-4 border-black overflow-hidden">
            <div className="halftone-overlay absolute inset-0 z-10 pointer-events-none opacity-30" />
            <img src={game.img} alt={game.name} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="p-6 flex flex-col gap-4">
          {/* Title */}
          <div>
            <h2 className="font-display text-4xl uppercase tracking-tight text-accent">{game.name}</h2>
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 bg-white border-2 border-black px-3 py-1"
                 style={{ boxShadow: '3px 3px 0 #000' }}>
              <span className="material-symbols-outlined text-primary text-lg">schedule</span>
              <span className="font-display text-sm uppercase">15 Min Session</span>
            </div>
          </div>

          {/* About */}
          {game.about && (
            <p className="text-sm text-slate-700 leading-relaxed border-l-4 border-primary pl-3">{game.about}</p>
          )}

          {/* Rules */}
          {game.rules?.length > 0 && (
            <div>
              <h4 className="font-display text-lg uppercase tracking-wide mb-2">Rules & Info</h4>
              <ul className="flex flex-col gap-1">
                {game.rules.map((rule, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm font-bold">
                    <span className="material-symbols-outlined text-primary text-base mt-0.5">chevron_right</span>
                    {rule}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* CTA buttons */}
          <div className="flex gap-3 mt-2">
            <motion.button
              onClick={() => { onBook(game); onClose() }}
              className="flex-1 h-14 btn-comic bg-primary text-white text-xl font-display uppercase"
              whileHover={{ scale: 1.02 }} whileTap={{ x: 4, y: 4 }}
            >
              BOOK THIS ZONE!
            </motion.button>
            <motion.button
              onClick={onClose}
              className="btn-comic h-14 px-5 bg-white text-black text-xl font-display uppercase"
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            >
              ✕
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

function GameCard({ game, index, onCardClick }) {
  const [imgError, setImgError] = useState(false)

  return (
    <motion.div
      layout
      className="comic-border group relative flex flex-col bg-white overflow-hidden cursor-pointer"
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      whileHover={{ y: -6, transition: { duration: 0.12 } }}
      onClick={() => onCardClick(game)}
    >
      {game.tag && (
        <motion.div
          className="absolute top-2 right-2 z-10"
          animate={{ rotate: [0, -5, 5, -3, 3, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
        >
          <div className={`action-bubble ${game.tagColor || 'bg-primary text-white'} text-xl`}>{game.tag}</div>
        </motion.div>
      )}

      <div className="aspect-video w-full relative border-b-4 border-black overflow-hidden bg-slate-200">
        <div className="halftone-overlay absolute inset-0 z-10 pointer-events-none opacity-30" />
        {imgError || !game.img ? (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
            <span className="material-symbols-outlined text-6xl text-slate-300">vrpano</span>
          </div>
        ) : (
          <motion.img
            src={game.img}
            alt={game.name}
            className="absolute inset-0 w-full h-full object-cover"
            whileHover={{ scale: 1.07 }}
            transition={{ duration: 0.3 }}
            onError={() => setImgError(true)}
          />
        )}
      </div>

      <div className="p-6 flex flex-col gap-4">
        <div>
          <h3 className="text-3xl font-display uppercase tracking-tight text-accent group-hover:text-primary transition-colors">
            {game.name}
          </h3>
        </div>

        <div className="flex items-center gap-2 py-2 border-y-2 border-black border-dashed">
          <span className="material-symbols-outlined text-primary text-xl">schedule</span>
          <span className="text-xs font-black uppercase italic">15 Min Session</span>
        </div>

        {game.about && (
          <p className="text-sm text-slate-600 leading-relaxed line-clamp-2">{game.about}</p>
        )}

        <div className="w-full h-14 btn-comic bg-accent text-white text-xl font-display uppercase flex items-center justify-center gap-2 group-hover:bg-primary transition-colors">
          <span className="material-symbols-outlined text-lg">info</span>
          VIEW DETAILS
        </div>
      </div>
    </motion.div>
  )
}

export default function GameGrid({ onBookGame }) {
  const [games, setGames] = useState([])
  const [activeGame, setActiveGame] = useState(null)

  useEffect(() => {
    const load = () => setGames(getGames())
    load()
    window.addEventListener('gamesUpdated', load)
    return () => window.removeEventListener('gamesUpdated', load)
  }, [])

  return (
    <>
      <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10" layout>
        <AnimatePresence>
          {games.map((game, i) => (
            <GameCard key={game.id} game={game} index={i} onCardClick={setActiveGame} />
          ))}
        </AnimatePresence>

        {games.length === 0 && (
          <motion.div
            className="col-span-3 flex flex-col items-center justify-center py-24 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <span className="material-symbols-outlined text-6xl text-slate-300">search_off</span>
            <p className="font-display text-2xl text-slate-400 uppercase">No games in this universe yet!</p>
          </motion.div>
        )}
      </motion.div>

      <AnimatePresence>
        {activeGame && (
          <GamePopup
            key={activeGame.id}
            game={activeGame}
            onClose={() => setActiveGame(null)}
            onBook={onBookGame}
          />
        )}
      </AnimatePresence>
    </>
  )
}


