import { useState } from 'react'
import { motion } from 'framer-motion'
import { PlayCircle, Clock, Star } from 'lucide-react'
import { GlassCard, SectionTitle, Pill } from '../components/ui'
import { ar } from '../lib/cn'

const LEVELS = ['الكل', 'مبتدئ', 'متوسط', 'متقدّم'] as const
type Level = typeof LEVELS[number]

interface Vid { title: string; level: Exclude<Level, 'الكل'>; mins: number; cat: string; watched?: boolean }
const VIDEOS: Vid[] = [
  { title: 'كيف تكتشف رسالة التصيّد في ٣٠ ثانية', level: 'مبتدئ', mins: 4, cat: 'التصيّد', watched: true },
  { title: 'المصادقة الثنائية: درعك الأقوى', level: 'مبتدئ', mins: 5, cat: 'الأساسيات', watched: true },
  { title: 'تشريح هجوم BEC على شركة حقيقية', level: 'متقدّم', mins: 9, cat: 'التصيّد' },
  { title: 'سرقة OTP عبر الهندسة الاجتماعية', level: 'متوسط', mins: 6, cat: 'Smishing' },
  { title: 'استخدام ChatGPT بأمان في العمل', level: 'متوسط', mins: 7, cat: 'الذكاء الاصطناعي' },
  { title: 'نظام PDPL في ١٠ دقائق', level: 'متوسط', mins: 10, cat: 'الخصوصية' },
  { title: 'مكالمات الدعم الفني المزيّفة', level: 'مبتدئ', mins: 4, cat: 'Vishing', watched: true },
  { title: 'الذكاء الاصطناعي المسؤول للمؤسسات', level: 'متقدّم', mins: 8, cat: 'الذكاء الاصطناعي' },
]
const COLOR: Record<string, 'cyber' | 'savvy' | 'violet'> = { 'مبتدئ': 'savvy', 'متوسط': 'cyber', 'متقدّم': 'violet' }

export default function Videos() {
  const [lvl, setLvl] = useState<Level>('الكل')
  const list = lvl === 'الكل' ? VIDEOS : VIDEOS.filter(v => v.level === lvl)
  return (
    <div className="space-y-6">
      <SectionTitle kicker="INTERACTIVE LEARNING" title="مكتبة الفيديو" subtitle="تعلّم مصغّر ودروس قصيرة من المبتدئ إلى المتقدّم" />
      <div className="flex flex-wrap gap-2">
        {LEVELS.map(l => (
          <button key={l} onClick={() => setLvl(l)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${lvl === l ? 'bg-cyber-grad text-white shadow-glow-cyber' : 'glass text-white/65 hover:text-white'}`}>
            {l}
          </button>
        ))}
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map((v, i) => (
          <motion.div key={v.title} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <GlassCard glow="cyber" className="overflow-hidden group">
              <div className="relative h-36 grid place-items-center bg-gradient-to-br from-cyber-900/60 to-violet-500/10">
                <PlayCircle className="h-12 w-12 text-white/80 group-hover:text-savvy-400 transition-colors" />
                {v.watched && <span className="absolute top-3 right-3"><Pill accent="savvy"><Star className="h-3 w-3" />تمّت</Pill></span>}
                <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 text-xs text-white/70"><Clock className="h-3.5 w-3.5" />{ar(v.mins)} د</span>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Pill accent={COLOR[v.level]}>{v.level}</Pill>
                  <span className="text-[11px] text-white/45">{v.cat}</span>
                </div>
                <h3 className="font-semibold text-white leading-snug">{v.title}</h3>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
