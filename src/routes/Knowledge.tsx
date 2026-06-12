import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, BookOpen, Sparkles, Brain, ChevronLeft } from 'lucide-react'
import { GlassCard, SectionTitle, Pill, ProgressBar } from '../components/ui'
import { SavvySays } from '../components/MrSavvy'
import { CENTERS } from '../data'
import { ar, cn } from '../lib/cn'
import type { Center } from '../data'

// ── Static accent maps (never dynamic Tailwind class names) ──────────────────

type Accent = 'cyber' | 'savvy' | 'violet' | 'gold' | 'danger'

const ICON_BG: Record<Accent, string> = {
  cyber:   'bg-cyber-900/60   text-cyber-400   border border-cyber-800/60',
  savvy:   'bg-savvy-900/60   text-savvy-400   border border-savvy-800/60',
  violet:  'bg-violet-500/10  text-violet-400  border border-violet-500/20',
  gold:    'bg-amber-950/50   text-gold-400    border border-gold-600/30',
  danger:  'bg-danger-500/10  text-danger-400  border border-danger-500/20',
}

const ICON_GLOW: Record<Accent, string> = {
  cyber:  'group-hover:shadow-glow-cyber',
  savvy:  'group-hover:shadow-glow-savvy',
  violet: 'group-hover:shadow-[0_0_0_1px_rgba(124,92,255,0.25),0_0_30px_-6px_rgba(124,92,255,0.45)]',
  gold:   'group-hover:shadow-glow-gold',
  danger: 'group-hover:shadow-[0_0_0_1px_rgba(255,51,102,0.25),0_0_30px_-6px_rgba(255,51,102,0.45)]',
}

const KICKER_COLOR: Record<Accent, string> = {
  cyber:  'text-cyber-400',
  savvy:  'text-savvy-400',
  violet: 'text-violet-400',
  gold:   'text-gold-400',
  danger: 'text-danger-400',
}

const FILTER_ACTIVE = 'bg-cyber-grad text-white shadow-glow-cyber'

// ── Filter chip definitions ──────────────────────────────────────────────────

const FILTERS = [
  { label: 'الكل',            key: 'all' },
  { label: 'الأساسيات',      key: 'fundamentals' },
  { label: 'التصيّد',         key: 'phishing' },
  { label: 'الاحتيال',        key: 'fraud' },
  { label: 'الذكاء الاصطناعي', key: 'ai' },
  { label: 'الخصوصية',        key: 'privacy' },
  { label: 'الهندسة الاجتماعية', key: 'social' },
] as const

type FilterKey = typeof FILTERS[number]['key']

// Centers that match a filter key (flexible: checks id prefix or topics)
function matchesFilter(c: Center, key: FilterKey): boolean {
  if (key === 'all') return true
  if (key === 'privacy') return c.topics.some(t => t.includes('PDPL') || t.includes('خصوصية') || t.includes('بيانات'))
  return c.id.startsWith(key)
}

// ── Featured AI security questions ──────────────────────────────────────────

const AI_QUESTIONS = [
  'هل يمكنني رفع مستندات الشركة؟',
  'ما البيانات التي يجب ألا تُشارك؟',
  'كيف أستخدم ChatGPT بأمان؟',
  'ما هو الذكاء الاصطناعي المسؤول؟',
]

// ── Stagger variants ─────────────────────────────────────────────────────────

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
}
const item = {
  hidden: { opacity: 0, y: 18 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] as const } },
}

// ── Sub-components ───────────────────────────────────────────────────────────

function CenterCard({ center }: { center: Center }) {
  const Icon = center.icon
  const accent = center.color as Accent

  return (
    <motion.div variants={item} className="group">
      <GlassCard
        glow={accent}
        className={cn('p-5 flex flex-col gap-4 h-full transition-all duration-300', ICON_GLOW[accent])}
      >
        {/* Header row */}
        <div className="flex items-start gap-3.5">
          <span className={cn('grid h-11 w-11 shrink-0 place-items-center rounded-xl', ICON_BG[accent])}>
            <Icon className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className={cn('mono-caption mb-0.5', KICKER_COLOR[accent])}>{center.titleEn}</p>
            <h3 className="font-bold text-white leading-snug line-clamp-2">{center.title}</h3>
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/50">التقدّم</span>
            <span className={cn('mono-caption', KICKER_COLOR[accent])}>{ar(center.progress)}٪</span>
          </div>
          <ProgressBar value={center.progress} accent={accent} />
        </div>

        {/* Lesson count */}
        <p className="text-sm text-white/65">
          <span className="font-semibold text-white">{ar(center.count)}</span> درس
        </p>

        {/* Topics */}
        <div className="flex flex-wrap gap-1.5 mt-auto">
          {center.topics.map(t => (
            <Pill key={t} accent={accent} className="text-[10px]">{t}</Pill>
          ))}
        </div>

        {/* Hover CTA */}
        <motion.div
          className="overflow-hidden"
          initial={{ height: 0, opacity: 0 }}
          whileHover={{ height: 'auto', opacity: 1 }}
          transition={{ duration: 0.25 }}
        >
          <button
            className={cn(
              'w-full mt-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-all',
              accent === 'cyber'   && 'bg-cyber-grad text-white shadow-glow-cyber',
              accent === 'savvy'   && 'bg-savvy-grad text-ink-950 shadow-glow-savvy',
              accent === 'violet'  && 'bg-gradient-to-r from-violet-500 to-cyber-500 text-white',
              accent === 'gold'    && 'bg-gold-grad text-ink-950',
              accent === 'danger'  && 'bg-gradient-to-r from-danger-500 to-violet-500 text-white',
            )}
          >
            ابدأ التعلّم
            <ChevronLeft className="h-4 w-4 flip-rtl" />
          </button>
        </motion.div>
      </GlassCard>
    </motion.div>
  )
}

// ── Empty state ──────────────────────────────────────────────────────────────

function EmptyState({ query }: { query: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="col-span-full flex flex-col items-center gap-4 py-20 text-center"
    >
      <span className="grid h-16 w-16 place-items-center rounded-2xl glass text-cyber-400">
        <BookOpen className="h-7 w-7" />
      </span>
      <p className="text-white/60 text-sm max-w-xs">
        لم نجد نتائج لـ <span className="text-white font-medium">"{query}"</span>.
        جرّب كلمة مختلفة أو اختر تصنيفاً من القائمة.
      </p>
    </motion.div>
  )
}

// ── Main screen ──────────────────────────────────────────────────────────────

export default function Knowledge() {
  const [query, setQuery]   = useState('')
  const [filter, setFilter] = useState<FilterKey>('all')

  const filtered = CENTERS.filter(c => {
    const passFilter = matchesFilter(c, filter)
    const passSearch = query.trim().length === 0
      || c.title.includes(query)
      || c.titleEn.toLowerCase().includes(query.toLowerCase())
      || c.topics.some(t => t.includes(query))
    return passFilter && passSearch
  })

  // The AI security center, for the featured strip
  const aiCenter = CENTERS.find(c => c.id === 'ai')

  return (
    <div className="space-y-8" dir="rtl">

      {/* ── Section header ───────────────────────────────────────────────── */}
      <SectionTitle
        kicker="KNOWLEDGE CENTER"
        title="مركز المعرفة"
        subtitle="مكتبة شاملة لمواضيع الأمن السيبراني — ابحث، تصفّح، وابدأ التعلّم."
      />

      {/* ── Mr. Savvy tip ────────────────────────────────────────────────── */}
      <SavvySays>
        ابحث بالعربي أو الإنجليزي، أو اختر تصنيفاً لتصفية المراكز. كل مركز يحتوي دروساً تفاعلية — ابدأ بما يناسب مستواك.
      </SavvySays>

      {/* ── Featured: AI Security strip ──────────────────────────────────── */}
      {aiCenter && (
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
        >
          <GlassCard
            glow="violet"
            className="p-6 relative overflow-hidden border-violet-500/20"
            hover={false}
          >
            {/* Background ambience */}
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -top-10 -left-10 h-48 w-48 rounded-full bg-violet-500/10 blur-3xl" />
              <div className="absolute -bottom-8 -right-8 h-40 w-40 rounded-full bg-cyber-500/10 blur-3xl" />
            </div>

            <div className="relative flex flex-col sm:flex-row sm:items-start gap-5">
              {/* Icon + label */}
              <div className="flex items-center gap-3 shrink-0">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-violet-500/15 text-violet-400 border border-violet-500/25">
                  <Brain className="h-6 w-6" />
                </span>
                <div>
                  <p className="mono-caption text-violet-400 mb-0.5">FEATURED</p>
                  <h3 className="font-bold text-white">{aiCenter.title}</h3>
                  <p className="text-xs text-white/50 mt-0.5">{aiCenter.titleEn}</p>
                </div>
              </div>

              {/* Divider */}
              <div className="hidden sm:block w-px self-stretch bg-white/8" />

              {/* Question pills */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="h-4 w-4 text-violet-400" />
                  <p className="text-sm text-white/65">أسئلة يطرحها موظفون كثيرون — هل تعرف الإجابة؟</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {AI_QUESTIONS.map(q => (
                    <motion.button
                      key={q}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="glass rounded-full px-3.5 py-2 text-sm text-white/80 hover:text-white hover:border-violet-400/40 transition-all cursor-pointer"
                    >
                      {q}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      )}

      {/* ── Search + filter bar ───────────────────────────────────────────── */}
      <div className="space-y-3">
        {/* Search input */}
        <div className="relative">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-white/40 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="ابحث عن موضوع أو مركز..."
            className={cn(
              'w-full glass rounded-xl py-3 pr-11 pl-4 text-sm text-white placeholder:text-white/35',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-cyber-500/60',
              'transition-all duration-200',
            )}
          />
        </div>

        {/* Filter chips */}
        <div className="flex flex-wrap gap-2">
          {FILTERS.map(f => {
            const isActive = filter === f.key
            return (
              <motion.button
                key={f.key}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilter(f.key)}
                className={cn(
                  'px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                  isActive
                    ? FILTER_ACTIVE
                    : 'glass text-white/65 hover:text-white hover:border-white/15',
                )}
              >
                {f.label}
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* ── Card grid ─────────────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${filter}-${query}`}
          variants={container}
          initial="hidden"
          animate="show"
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {filtered.length > 0
            ? filtered.map(c => <CenterCard key={c.id} center={c} />)
            : <EmptyState query={(query || FILTERS.find(f => f.key === filter)?.label) ?? ""} />
          }
        </motion.div>
      </AnimatePresence>

    </div>
  )
}
