import { motion } from 'framer-motion'

const RULES = [
  {
    title: 'General Rules',
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
    items: [
      'Area 67 and Apoorv Fest / IIIT Kottayam are not liable for any physical injury sustained during VR experiences.',
      'Participants use all VR equipment entirely at their own risk.',
      'Area 67 is not responsible for loss of personal belongings on the premises.',
      'By booking a slot, participants agree to all rules and policies listed here.',
    ],
  },
]

export default function Footer() {
  return (
    <motion.footer
      className="bg-black text-white mt-10"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      {/* Rules & Legal */}
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-12 grid grid-cols-1 md:grid-cols-2 gap-8 border-b-4 border-white/10">
        {RULES.map((section) => (
          <div key={section.title}>
            <h4 className="font-display text-lg uppercase tracking-widest text-secondary mb-3 border-b-2 border-white/20 pb-2">
              {section.title}
            </h4>
            <ul className="flex flex-col gap-2">
              {section.items.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-white/70 leading-relaxed">
                  <span className="text-secondary mt-0.5 flex-shrink-0">›</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="px-6 md:px-10 py-6 flex flex-col items-center gap-3">
        <img src="/logo.png" alt="Area 67" className="h-12 w-12 object-contain" />
        <p className="font-display text-base uppercase tracking-widest text-white/60">
          © 2026 AREA 67 · APOORV FEST · IIIT KOTTAYAM — ALL RIGHTS RESERVED.
        </p>
        <p className="font-marker text-xs text-white/40 mt-1">
          By using this platform you agree to our booking policy, health & safety rules, and general terms listed above.
        </p>
      </div>
    </motion.footer>
  )
}
