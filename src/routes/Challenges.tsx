import { motion } from 'framer-motion'
import { Target, Mail, MessageSquareWarning, Globe, Brain, Trophy } from 'lucide-react'
import { GlassCard, SectionTitle, Pill, ProgressBar } from '../components/ui'
import { SavvySays } from '../components/MrSavvy'
import { ar } from '../lib/cn'

const CH = [
  { icon: Mail, title: 'اكتشف بريد التصيّد', desc: 'حلّل ٥ رسائل وحدّد المزيّفة منها', xp: 120, done: 4, total: 5, accent: 'cyber' as const },
  { icon: MessageSquareWarning, title: 'اصطد الرسالة الاحتيالية', desc: 'رسائل SMS — أيّها فخّ؟', xp: 100, done: 5, total: 5, accent: 'savvy' as const },
  { icon: Globe, title: 'الموقع المشبوه', desc: 'افحص الروابط واكشف التزييف', xp: 140, done: 2, total: 5, accent: 'violet' as const },
  { icon: Brain, title: 'تحدّي أمان الذكاء الاصطناعي', desc: 'قرارات استخدام آمن للـAI', xp: 160, done: 0, total: 5, accent: 'gold' as const },
]
const ICONBG: Record<string, string> = {
  cyber: 'bg-cyber-500/15 text-cyber-400', savvy: 'bg-savvy-500/15 text-savvy-400',
  violet: 'bg-violet-500/15 text-violet-400', gold: 'bg-gold-500/15 text-gold-400',
}

export default function Challenges() {
  return (
    <div className="space-y-6">
      <SectionTitle kicker="CYBER CHALLENGES" title="التحديات التفاعلية" subtitle="طبّق معرفتك في سيناريوهات حقيقية واكسب نقاط XP" />
      <SavvySays>تحدّيات اليوم تمنحك حتى ٥٢٠ نقطة! أنصحك تبدأ بتحدّي «الموقع المشبوه» — أنت قريب من إكماله.</SavvySays>
      <div className="grid sm:grid-cols-2 gap-4">
        {CH.map((c, i) => (
          <motion.div key={c.title} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
            <GlassCard glow={c.accent} className="p-5">
              <div className="flex items-start justify-between">
                <span className={`grid h-12 w-12 place-items-center rounded-xl ${ICONBG[c.accent]}`}>
                  <c.icon className="h-6 w-6" />
                </span>
                <Pill accent="gold"><Trophy className="h-3 w-3" />{ar(c.xp)} XP</Pill>
              </div>
              <h3 className="mt-4 font-semibold text-white text-lg">{c.title}</h3>
              <p className="text-sm text-white/55 mt-1">{c.desc}</p>
              <div className="mt-4 flex items-center gap-3">
                <ProgressBar value={(c.done / c.total) * 100} accent={c.accent} className="flex-1" />
                <span className="text-xs text-white/60 tabular-nums">{ar(c.done)}/{ar(c.total)}</span>
              </div>
              <button className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-xl glass py-2.5 text-sm font-semibold text-white hover:bg-white/10">
                <Target className="h-4 w-4" /> {c.done === 0 ? 'ابدأ التحدّي' : c.done === c.total ? 'أعد المحاولة' : 'تابع'}
              </button>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
