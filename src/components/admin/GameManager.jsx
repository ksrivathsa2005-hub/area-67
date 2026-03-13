import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getGames, addGame, updateGame, deleteGame } from '../../store/gameStore'

const EMPTY_FORM = {
  name: '', img: '', about: '', rules: '',
}

function GameForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial || EMPTY_FORM)
  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  function submit(e) {
    e.preventDefault()
    const rulesArr = form.rules
      .split('\n')
      .map(r => r.trim())
      .filter(Boolean)
    onSave({ ...form, rules: rulesArr })
  }

  const inputClass = "border-[3px] border-black bg-white px-4 py-2.5 font-bold text-accent focus:outline-none focus:border-primary focus:bg-yellow-50 transition-all w-full"
  const shadow = { boxShadow: '3px 3px 0 #000' }

  return (
    <motion.form
      onSubmit={submit}
      className="flex flex-col gap-4 border-4 border-black bg-white p-6"
      style={{ boxShadow: '8px 8px 0 #000' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h3 className="font-display text-2xl uppercase text-accent">
        {initial ? 'Edit Game' : 'Add New Game'}
      </h3>

      <div className="flex flex-col gap-1">
        <label className="font-display text-xs uppercase tracking-widest">Game Name *</label>
        <input name="name" value={form.name} onChange={handle} required className={inputClass} style={shadow} placeholder="Beat Saber" />
      </div>

      <div className="flex flex-col gap-1">
        <label className="font-display text-xs uppercase tracking-widest">Image URL</label>
        <input name="img" value={form.img} onChange={handle} className={inputClass} style={shadow} placeholder="https://..." />
        {form.img && (
          <img src={form.img} alt="preview" className="mt-2 h-32 object-cover border-2 border-black" onError={e => e.target.style.display='none'} />
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label className="font-display text-xs uppercase tracking-widest">About the Game</label>
        <textarea name="about" value={form.about} onChange={handle} rows={3}
          className={`${inputClass} resize-y`} style={shadow}
          placeholder="Describe the VR experience..." />
      </div>

      <div className="flex flex-col gap-1">
        <label className="font-display text-xs uppercase tracking-widest">Rules & Safety (one per line)</label>
        <textarea name="rules" value={typeof form.rules === 'string' ? form.rules : form.rules?.join('\n')} onChange={handle} rows={5}
          className={`${inputClass} resize-y`} style={shadow}
          placeholder={`One player at a time\nMinimum age: 10 years\nDuration: 15 minutes per session`} />
      </div>

      <div className="flex gap-3 pt-2">
        <motion.button type="submit" className="btn-comic bg-primary text-white px-8 h-12 text-lg"
          whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
          {initial ? 'SAVE CHANGES' : 'ADD GAME'}
        </motion.button>
        <motion.button type="button" onClick={onCancel} className="btn-comic bg-white text-accent px-8 h-12 text-lg"
          whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
          CANCEL
        </motion.button>
      </div>
    </motion.form>
  )
}

export default function GameManager() {
  const [games, setGames]     = useState([])
  const [editingId, setEdit]  = useState(null)
  const [isAdding, setAdding] = useState(false)

  const load = () => {
    setGames(getGames())
    window.dispatchEvent(new Event('gamesUpdated'))
  }

  useEffect(() => { load() }, [])

  function handleAdd(form) {
    addGame(form); setAdding(false); load()
  }

  function handleUpdate(form) {
    updateGame(editingId, form); setEdit(null); load()
  }

  function handleDelete(id) {
    if (confirm('Delete this game?')) {
      deleteGame(id); load()
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {!isAdding && !editingId && (
        <motion.button
          onClick={() => setAdding(true)}
          className="self-start btn-comic bg-primary text-white px-6 h-12 text-lg flex items-center gap-2"
          whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
        >
          <span className="material-symbols-outlined">add_circle</span>
          ADD NEW GAME
        </motion.button>
      )}

      <AnimatePresence>
        {isAdding && (
          <GameForm key="add" onSave={handleAdd} onCancel={() => setAdding(false)} />
        )}
      </AnimatePresence>

      <div className="flex flex-col gap-4">
        {games.map(game => (
          <AnimatePresence key={game.id}>
            {editingId === game.id ? (
              <GameForm
                key={`edit-${game.id}`}
                initial={{ ...game, rules: Array.isArray(game.rules) ? game.rules.join('\n') : game.rules }}
                onSave={handleUpdate}
                onCancel={() => setEdit(null)}
              />
            ) : (
              <motion.div
                layout
                className="flex items-center gap-4 border-[3px] border-black bg-white p-4"
                style={{ boxShadow: '4px 4px 0 #000' }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <div className="w-16 h-16 border-2 border-black overflow-hidden flex-shrink-0 bg-slate-100">
                  {game.img
                    ? <img src={game.img} alt={game.name} className="w-full h-full object-cover" onError={e => e.target.style.display='none'} />
                    : <span className="material-symbols-outlined text-3xl text-slate-300 block text-center pt-3">vrpano</span>
                  }
                </div>

                <div className="flex-1 min-w-0">
                  <span className="font-display text-xl uppercase">{game.name}</span>
                  <p className="text-sm text-slate-500 font-marker mt-0.5 truncate">{game.about}</p>
                  <p className="text-xs text-slate-400 mt-1">{Array.isArray(game.rules) ? game.rules.length : 0} rules</p>
                </div>

                <div className="flex gap-2 flex-shrink-0">
                  <motion.button
                    onClick={() => { setEdit(game.id); setAdding(false) }}
                    className="btn-comic bg-secondary text-accent h-10 px-4 text-sm flex items-center gap-1"
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  >
                    <span className="material-symbols-outlined text-base">edit</span>
                    EDIT
                  </motion.button>
                  <motion.button
                    onClick={() => handleDelete(game.id)}
                    className="btn-comic bg-red-500 text-white h-10 px-4 text-sm flex items-center gap-1"
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  >
                    <span className="material-symbols-outlined text-base">delete</span>
                    DEL
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        ))}
      </div>
    </div>
  )
}

