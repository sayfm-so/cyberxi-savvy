import { motion } from 'framer-motion'
import { Crosshair, ShieldAlert, Send, Eye } from 'lucide-react'
import { GlassCard, SectionTitle, Pill, ScoreRing } from '../components/ui'

const SIMS = [
  { title: 'حملة تصيّد بريدي محاكاة', date: '٢٠٢٦/٠٥', detection: 78, reporting: 64, response: 71 },
  { title: 'مكالمة دعم فني مزيّفة', date: '٢٠٢٦/٠٤', detection: 85, reporting: 70, response: 80 },
  { title: 'رسالة OTP احتيالية', date: '٢٠٢٦/٠٣', detection: 69, reporting: 55, response: 62 },
]
const METRICS = [
  { key: 'detection', label: 'معدّل الاكتشاف', icon: Eye, accent: 'cyber' as const },
  { key: 'reporting', label: 'معدّل الإبلاغ', icon: Send, accent: 'savvy' as const },
  { key: 'response', label: 'معدّل الاستجابة', icon: ShieldAlert, accent: 'violet' as const },
]

export default function Simulations() {
  return (
    <div className="space-y-6">
      <SectionTitle kicker="SIMULATIONS" title="المحاكاة الواقعية" subtitle="سيناريوهات حيّة تقيس الاكتشاف والإبلاغ والاستجابة" />
      <div className="space-y-4">
        {SIMS.map((s, i) => (
          <motion.div key={s.title} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
            <GlassCard glow="cyber" className="p-5 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-cyber-500/15 text-cyber-400"><Crosshair className="h-6 w-6" /></span>
                  <div>
                    <h3 className="font-semibold text-white text-lg">{s.title}</h3>
                    <Pill className="mt-1">{s.date}</Pill>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  {METRICS.map(m => (
                    <div key={m.key} className="flex flex-col items-center">
                      <ScoreRing value={s[m.key as keyof typeof s] as number} accent={m.accent} size={74} stroke={6} />
                      <span className="text-[11px] text-white/55 mt-1 flex items-center gap-1"><m.icon className="h-3 w-3" />{m.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
