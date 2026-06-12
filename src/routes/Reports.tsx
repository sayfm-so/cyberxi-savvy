import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus, Download } from 'lucide-react'
import { GlassCard, SectionTitle, ProgressBar, StatTile } from '../components/ui'
import { ADMIN_METRICS, DEPARTMENTS, SCORES } from '../data'
import { BarChart3, Activity, ShieldCheck, GraduationCap } from 'lucide-react'

const ICONS = [Activity, GraduationCap, ShieldCheck, BarChart3]

export default function Reports() {
  return (
    <div className="space-y-6">
      <SectionTitle kicker="REPORTS" title="التقارير والتحليلات" subtitle="ملخّص أداء التعلّم والوعي عبر المؤسسة"
        action={<button className="inline-flex items-center gap-2 rounded-xl glass px-4 py-2 text-sm text-white/80 hover:text-white"><Download className="h-4 w-4" />تصدير PDF</button>} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {ADMIN_METRICS.map((m, i) => (
          <motion.div key={m.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <StatTile icon={ICONS[i]} label={m.label} value={m.value} sub={m.sub}
              accent={m.trend === 'down' ? 'savvy' : 'cyber'} />
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <GlassCard className="p-5">
          <h3 className="font-semibold text-white mb-4">متوسط الدرجات حسب المجال</h3>
          <div className="space-y-3.5">
            {SCORES.map(s => (
              <div key={s.key}>
                <div className="flex justify-between text-sm mb-1.5"><span className="text-white/70">{s.label}</span><span className="text-white/90 tabular-nums">{s.value}٪</span></div>
                <ProgressBar value={s.value} accent={s.color} />
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <h3 className="font-semibold text-white mb-4">أداء الإدارات</h3>
          <div className="space-y-3">
            {DEPARTMENTS.map(d => (
              <div key={d.dept} className="flex items-center gap-3">
                <span className="text-sm text-white/70 w-32 truncate">{d.dept}</span>
                <ProgressBar value={d.score} accent={d.risk === 'high' ? 'danger' : d.risk === 'med' ? 'gold' : 'savvy'} className="flex-1" />
                <span className="text-sm text-white/90 tabular-nums w-10 text-left">{d.score}٪</span>
                {d.risk === 'high' ? <TrendingDown className="h-4 w-4 text-danger-400" /> : d.risk === 'med' ? <Minus className="h-4 w-4 text-gold-400" /> : <TrendingUp className="h-4 w-4 text-savvy-400" />}
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
