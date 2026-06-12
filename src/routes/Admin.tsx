import { motion } from 'framer-motion'
import {
  TrendingUp, TrendingDown, Minus,
  AlertTriangle, CheckCircle2,
  Target, Mail, BookOpen, ShieldAlert,
  Users, Award, Zap, ChevronLeft,
} from 'lucide-react'
import { GlassCard, SectionTitle, Pill, ScoreRing, ProgressBar } from '../components/ui'
import { ADMIN_METRICS, DEPARTMENTS } from '../data'
import { ar } from '../lib/cn'

// ── Static accent maps (no dynamic Tailwind class construction) ──────────────

const RISK_ACCENT = {
  low: 'savvy',
  med: 'gold',
  high: 'danger',
} as const satisfies Record<'low' | 'med' | 'high', 'savvy' | 'gold' | 'danger'>

const RISK_LABEL: Record<'low' | 'med' | 'high', string> = {
  low: 'منخفض',
  med: 'متوسط',
  high: 'مرتفع',
}

// KPI icons — positional, not dynamic
const KPI_ICONS = [Users, Award, AlertTriangle, CheckCircle2] as const

// Which KPI index has a "down is good" interpretation (high-risk users)
const DOWN_IS_GOOD_IDX = 2

// ── Faux high-risk employees ────────────────────────────────────────────────

const HIGH_RISK_USERS = [
  { name: 'عبدالله الشمري', dept: 'العمليات', reason: 'فشل في محاكاة تصيّد — ثلاث مرات' },
  { name: 'نورة الزهراني', dept: 'الموارد البشرية', reason: 'لم تكمل وحدة حماية الخصوصية' },
  { name: 'فيصل العتيبي', dept: 'المالية', reason: 'نقر على رابط احتيالي في اختبار BEC' },
  { name: 'ريم القحطاني', dept: 'العمليات', reason: 'تجاوزت ٦٠ يوماً دون تسجيل دخول' },
] as const

// ── Phishing simulation stats ───────────────────────────────────────────────

const PHISHING_STATS = [
  { label: 'معدّل النقر',      value: 18, accent: 'danger' as const },
  { label: 'معدّل الإبلاغ',    value: 62, accent: 'savvy'  as const },
  { label: 'معدّل الاكتشاف',   value: 74, accent: 'cyber'  as const },
]

// ── Cert status ─────────────────────────────────────────────────────────────

const CERT_STATUS = [
  { label: 'معتمد',        count: 312, accent: 'savvy'  as const, pct: 55 },
  { label: 'قيد التقدّم',  count: 148, accent: 'gold'   as const, pct: 26 },
  { label: 'لم يبدأ',      count: 108, accent: 'danger' as const, pct: 19 },
] as const

const TOTAL_EMPLOYEES = 568

// ── Recommendations ─────────────────────────────────────────────────────────

const RECOMMENDATIONS = [
  {
    icon: ShieldAlert,
    accent: 'danger' as const,
    title: 'ركّز على إدارة العمليات',
    body: 'أعلى مخاطرة في المؤسسة — درجة وعي ٦٤٪ وإكمال ٥٩٪ فقط.',
    cta: 'إطلاق خطة تصحيحية',
  },
  {
    icon: Mail,
    accent: 'gold' as const,
    title: 'أطلق حملة تصيّد محاكاة جديدة',
    body: 'آخر حملة قبل ٤٥ يوماً — معدّل النقر ما زال ١٨٪ فوق الهدف.',
    cta: 'جدوَل الحملة',
  },
  {
    icon: BookOpen,
    accent: 'cyber' as const,
    title: 'ذكّر ٢٣ موظفاً بالإكمال',
    body: 'وحدة حماية الخصوصية معلّقة — الموعد النهائي بعد أسبوعين.',
    cta: 'إرسال تذكير',
  },
] as const

// ── Animation variants ────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0,  transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] as const } },
}

const stagger = (i: number) => ({
  hidden: { opacity: 0, y: 18 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const, delay: i * 0.07 } },
})

// ── Donut arc helper (SVG) ─────────────────────────────────────────────────

function DonutArc({ pct, accent, idx }: { pct: number; accent: 'savvy' | 'gold' | 'danger'; idx: number }) {
  const COLORS = { savvy: '#00e58a', gold: '#f5c451', danger: '#ff3366' }
  const col = COLORS[accent]
  const r = 52
  const cx = 64
  const cy = 64
  const circumference = 2 * Math.PI * r
  // gap between segments in degrees
  const GAP_DEG = 3
  const GAP_FRAC = GAP_DEG / 360

  // compute offset from prior segments
  let priorPct = 0
  const PCTS = [55, 26, 19]
  for (let j = 0; j < idx; j++) priorPct += PCTS[j] / 100 + GAP_FRAC

  const dashLen = (pct / 100 - GAP_FRAC) * circumference
  const dashOffset = circumference - priorPct * circumference

  return (
    <motion.circle
      cx={cx} cy={cy} r={r} fill="none"
      stroke={col} strokeWidth={12} strokeLinecap="butt"
      strokeDasharray={`${dashLen} ${circumference - dashLen}`}
      style={{ strokeDashoffset: dashOffset, filter: `drop-shadow(0 0 5px ${col}88)` }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: idx * 0.15 }}
    />
  )
}

// ── Main screen ───────────────────────────────────────────────────────────────

export default function Admin() {
  return (
    <div className="min-h-screen ambient grid-faint" dir="rtl">
      <div className="max-w-[1280px] mx-auto px-6 py-10">

        {/* Header */}
        <motion.div variants={fadeUp} initial="hidden" animate="show">
          <SectionTitle
            kicker="MANAGEMENT"
            title="لوحة الإدارة"
            subtitle="نظرة شاملة على نضج الوعي السيبراني في المؤسسة"
          />
        </motion.div>

        {/* KPI Row */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          initial="hidden" animate="show"
          variants={{ show: { transition: { staggerChildren: 0.07 } } }}
        >
          {ADMIN_METRICS.map((m, i) => {
            const isHighRisk = i === DOWN_IS_GOOD_IDX
            const accentIsGood = isHighRisk
              ? (m.trend === 'down' ? 'savvy' : 'danger')
              : (m.trend === 'up' ? 'savvy' : m.trend === 'down' ? 'danger' : 'cyber')
            const TrendIcon = m.trend === 'up'
              ? TrendingUp
              : m.trend === 'down'
                ? TrendingDown
                : Minus
            const Icon = KPI_ICONS[i]
            return (
              <motion.div key={m.label} variants={stagger(i)}>
                <GlassCard className="p-4 flex items-center gap-3.5" glow={accentIsGood}>
                  <span
                    className="grid h-11 w-11 place-items-center rounded-xl shrink-0"
                    style={{
                      color: accentIsGood === 'savvy' ? '#00e58a' : accentIsGood === 'danger' ? '#ff3366' : '#1f8fff',
                      background: accentIsGood === 'savvy' ? '#00e58a1a' : accentIsGood === 'danger' ? '#ff33661a' : '#1f8fff1a',
                      border: `1px solid ${accentIsGood === 'savvy' ? '#00e58a33' : accentIsGood === 'danger' ? '#ff336633' : '#1f8fff33'}`,
                    }}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <p className="text-xl font-bold text-white leading-none">{m.value}</p>
                      <TrendIcon
                        className="h-3.5 w-3.5 shrink-0"
                        style={{ color: accentIsGood === 'savvy' ? '#00e58a' : accentIsGood === 'danger' ? '#ff3366' : '#6bb8ff' }}
                      />
                    </div>
                    <p className="text-xs text-white/55 mt-1 truncate">{m.label}</p>
                    <p className="text-[11px] text-white/35 mt-0.5">{m.sub}</p>
                  </div>
                </GlassCard>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Main 2-col grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* ── Department Comparison ───────────────────────────────────── */}
          <motion.div
            className="lg:col-span-2"
            variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
          >
            <GlassCard className="p-6">
              <h3 className="text-lg font-bold text-white mb-5">مقارنة الإدارات</h3>
              <div className="space-y-4">
                {DEPARTMENTS.map((d, i) => (
                  <motion.div
                    key={d.dept}
                    variants={stagger(i)}
                    initial="hidden" whileInView="show" viewport={{ once: true }}
                    className="flex items-center gap-4"
                  >
                    {/* Rank */}
                    <span className="mono-caption text-white/30 w-5 text-center shrink-0">{ar(i + 1)}</span>

                    {/* Dept name */}
                    <span className="text-sm font-medium text-white/80 w-36 shrink-0 truncate">{d.dept}</span>

                    {/* Score bar */}
                    <div className="flex-1 min-w-0">
                      <ProgressBar value={d.score} accent={RISK_ACCENT[d.risk]} />
                    </div>

                    {/* Score value */}
                    <span
                      className="mono-caption w-10 text-center shrink-0"
                      style={{ color: d.risk === 'low' ? '#00e58a' : d.risk === 'med' ? '#f5c451' : '#ff3366' }}
                    >
                      {ar(d.score)}٪
                    </span>

                    {/* Completion */}
                    <span className="text-xs text-white/45 w-16 text-center shrink-0">
                      إكمال {ar(d.completion)}٪
                    </span>

                    {/* Risk pill */}
                    <Pill accent={RISK_ACCENT[d.risk]} className="shrink-0">
                      {RISK_LABEL[d.risk]}
                    </Pill>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </motion.div>

          {/* ── High-Risk Users ─────────────────────────────────────────── */}
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
          >
            <GlassCard className="p-6 h-full">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold text-white">المستخدمون عالي الخطورة</h3>
                <Pill accent="danger">{ar(HIGH_RISK_USERS.length)} موظفين</Pill>
              </div>
              <div className="space-y-3">
                {HIGH_RISK_USERS.map((u, i) => (
                  <motion.div
                    key={u.name}
                    variants={stagger(i)}
                    initial="hidden" whileInView="show" viewport={{ once: true }}
                  >
                    <GlassCard className="p-3.5 flex items-center gap-3" hover={false}>
                      {/* Avatar initials */}
                      <span
                        className="grid h-9 w-9 place-items-center rounded-xl shrink-0 text-sm font-bold"
                        style={{ background: '#ff33661a', border: '1px solid #ff336633', color: '#ff5c85' }}
                      >
                        {u.name.slice(0, 1)}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white leading-none">{u.name}</p>
                        <p className="text-[11px] text-white/45 mt-0.5">{u.dept}</p>
                        <p className="text-[11px] text-danger-400 mt-1 leading-snug">{u.reason}</p>
                      </div>
                      <button
                        className="shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 hover:brightness-110 active:scale-95"
                        style={{ background: '#1f8fff1a', border: '1px solid #1f8fff33', color: '#6bb8ff' }}
                        type="button"
                      >
                        تعيين تدريب
                      </button>
                    </GlassCard>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </motion.div>

          {/* ── Phishing Simulation Results ─────────────────────────────── */}
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
          >
            <GlassCard className="p-6 h-full">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white">نتائج محاكاة التصيّد</h3>
                <Pill accent="cyber">Q2 · 2026</Pill>
              </div>

              {/* Score rings row */}
              <div className="flex items-center justify-around gap-4 mb-6">
                {PHISHING_STATS.map((s) => (
                  <ScoreRing key={s.label} value={s.value} label={s.label} accent={s.accent} size={110} stroke={8} />
                ))}
              </div>

              {/* Insight callout */}
              <GlassCard className="p-3.5 flex items-start gap-2.5" hover={false}>
                <Target className="h-4 w-4 text-gold-400 shrink-0 mt-0.5" />
                <p className="text-xs text-white/60 leading-relaxed">
                  معدّل النقر انخفض من <span className="text-gold-400 font-semibold">{ar(28)}٪</span> في Q1
                  إلى <span className="text-danger-400 font-semibold">{ar(18)}٪</span> — تحسّن {ar(10)} نقاط.
                  الهدف السنوي: أقل من <span className="text-savvy-400 font-semibold">{ar(10)}٪</span>.
                </p>
              </GlassCard>
            </GlassCard>
          </motion.div>

          {/* ── Certificate Status ──────────────────────────────────────── */}
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
          >
            <GlassCard className="p-6 h-full">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white">حالة الشهادات</h3>
                <span className="mono-caption text-white/40">{ar(TOTAL_EMPLOYEES)} موظف</span>
              </div>

              <div className="flex items-center gap-6">
                {/* Donut */}
                <div className="relative shrink-0">
                  <svg width={128} height={128} className="-rotate-90">
                    {/* Track */}
                    <circle cx={64} cy={64} r={52} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={12} />
                    {CERT_STATUS.map((s, i) => (
                      <DonutArc key={s.label} pct={s.pct} accent={s.accent} idx={i} />
                    ))}
                  </svg>
                  <div className="absolute inset-0 grid place-items-center">
                    <div className="text-center">
                      <p className="text-lg font-bold text-white leading-none">{ar(55)}٪</p>
                      <p className="text-[10px] text-white/40 mt-0.5">معتمد</p>
                    </div>
                  </div>
                </div>

                {/* Legend */}
                <div className="flex-1 space-y-3">
                  {CERT_STATUS.map((s) => {
                    const COLORS = { savvy: '#00e58a', gold: '#f5c451', danger: '#ff3366' }
                    const col = COLORS[s.accent]
                    return (
                      <div key={s.label} className="flex items-center gap-2.5">
                        <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: col, boxShadow: `0 0 6px ${col}` }} />
                        <span className="text-sm text-white/70 flex-1">{s.label}</span>
                        <span className="mono-caption text-white/55">{ar(s.count)}</span>
                        <span className="mono-caption w-10 text-left" style={{ color: col }}>{ar(s.pct)}٪</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Overall org progress */}
              <div className="mt-5">
                <div className="flex justify-between mb-2">
                  <span className="text-xs text-white/55">تقدّم الشهادة — المؤسسة</span>
                  <span className="mono-caption text-savvy-400">{ar(55)}٪</span>
                </div>
                <ProgressBar value={55} accent="savvy" />
              </div>
            </GlassCard>
          </motion.div>

          {/* ── Recommendations ────────────────────────────────────────── */}
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
          >
            <GlassCard className="p-6 h-full">
              <div className="flex items-center gap-2 mb-5">
                <Zap className="h-4 w-4 text-gold-400" />
                <h3 className="text-lg font-bold text-white">توصيات</h3>
              </div>
              <div className="space-y-3">
                {RECOMMENDATIONS.map((r, i) => {
                  const COLORS = { danger: '#ff3366', gold: '#f5c451', cyber: '#1f8fff' }
                  const col = COLORS[r.accent]
                  const Icon = r.icon
                  return (
                    <motion.div
                      key={r.title}
                      variants={stagger(i)}
                      initial="hidden" whileInView="show" viewport={{ once: true }}
                    >
                      <GlassCard className="p-4" hover={false} glow={r.accent}>
                        <div className="flex items-start gap-3">
                          <span
                            className="grid h-9 w-9 place-items-center rounded-xl shrink-0 mt-0.5"
                            style={{ color: col, background: `${col}1a`, border: `1px solid ${col}33` }}
                          >
                            <Icon className="h-4 w-4" />
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-white leading-snug">{r.title}</p>
                            <p className="text-xs text-white/50 mt-1 leading-relaxed">{r.body}</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          className="mt-3 w-full flex items-center justify-between rounded-lg px-3.5 py-2 text-xs font-medium transition-all duration-200 hover:brightness-110 active:scale-[0.98]"
                          style={{ background: `${col}14`, border: `1px solid ${col}28`, color: col }}
                        >
                          {r.cta}
                          <ChevronLeft className="h-3.5 w-3.5" />
                        </button>
                      </GlassCard>
                    </motion.div>
                  )
                })}
              </div>
            </GlassCard>
          </motion.div>

        </div>
      </div>
    </div>
  )
}
