import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { CheckCircle2, PlayCircle, Zap, BookOpen, GraduationCap, ArrowLeft } from 'lucide-react'
import { GlassCard, SectionTitle } from '../components/ui'
import { SavvySays } from '../components/MrSavvy'
import { PRODUCTS } from '../data'
import type { Product } from '../data'
import { cn, ar } from '../lib/cn'

// ── Static accent maps (no dynamic Tailwind class construction) ──────────────

const ICON_BG: Record<'cyber' | 'savvy' | 'violet', string> = {
  cyber:  'bg-cyber-500/15 border border-cyber-500/30 text-cyber-400',
  savvy:  'bg-savvy-500/15 border border-savvy-500/30 text-savvy-400',
  violet: 'bg-violet-500/15 border border-violet-500/30 text-violet-400',
}

const CHECK_COLOR: Record<'cyber' | 'savvy' | 'violet', string> = {
  cyber:  'text-cyber-400',
  savvy:  'text-savvy-400',
  violet: 'text-violet-400',
}

const BADGE_COLOR: Record<'cyber' | 'savvy' | 'violet', string> = {
  cyber:  'bg-cyber-500/10 text-cyber-300 border-cyber-500/20',
  savvy:  'bg-savvy-500/10 text-savvy-300 border-savvy-500/20',
  violet: 'bg-violet-500/10 text-violet-300 border-violet-500/20',
}

const DIVIDER_COLOR: Record<'cyber' | 'savvy' | 'violet', string> = {
  cyber:  'from-transparent via-cyber-500/40 to-transparent',
  savvy:  'from-transparent via-savvy-500/40 to-transparent',
  violet: 'from-transparent via-violet-500/40 to-transparent',
}

const MODULE_PILL: Record<'cyber' | 'savvy' | 'violet', string> = {
  cyber:  'text-cyber-400',
  savvy:  'text-savvy-400',
  violet: 'text-violet-400',
}

const CTA_BTN: Record<'cyber' | 'savvy' | 'violet', string> = {
  cyber:  'bg-cyber-500 hover:bg-cyber-400 shadow-glow-cyber text-white',
  savvy:  'bg-savvy-500 hover:bg-savvy-400 shadow-glow-savvy text-ink-950',
  violet: 'bg-violet-500 hover:bg-violet-400 shadow-[0_0_30px_-6px_rgba(124,92,255,0.45)] text-white',
}

const AFFORD_BTN: Record<'cyber' | 'savvy' | 'violet', string> = {
  cyber:  'border-cyber-500/30 text-cyber-300 hover:bg-cyber-500/10',
  savvy:  'border-savvy-500/30 text-savvy-300 hover:bg-savvy-500/10',
  violet: 'border-violet-500/30 text-violet-300 hover:bg-violet-500/10',
}

const HEADING_GRAD: Record<'cyber' | 'savvy' | 'violet', string> = {
  cyber:  'text-grad-cyber',
  savvy:  'text-grad-savvy',
  violet: 'bg-gradient-to-r from-violet-300 via-violet-400 to-cyber-400 bg-clip-text text-transparent',
}

// ── Affordance buttons (per card) ────────────────────────────────────────────

const AFFORDANCES = [
  { label: 'فيديوهات',       icon: PlayCircle },
  { label: 'عرض تفاعلي',    icon: Zap        },
  { label: 'دراسات حالة',   icon: BookOpen   },
]

// ── Framer variants ──────────────────────────────────────────────────────────

const fadeUp = {
  hidden:  { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.14, ease: [0.16, 1, 0.3, 1] as const },
  }),
}

// ── Product card ─────────────────────────────────────────────────────────────

function ProductCard({ product, index }: { product: Product; index: number }) {
  const Icon = product.icon
  const isEven = index % 2 === 0

  return (
    <motion.div
      custom={index}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
    >
      <GlassCard
        glow={product.color === 'violet' ? undefined : product.color}
        hover
        className={cn(
          'p-0 overflow-hidden group',
          // violet glow applied manually since GlassCard only maps to 'cyber'/'savvy' shadow keys
        )}
      >
        {/* top accent bar */}
        <div className={cn('h-[3px] w-full bg-gradient-to-r', DIVIDER_COLOR[product.color])} />

        <div className={cn(
          'flex flex-col lg:flex-row gap-0',
          !isEven && 'lg:flex-row-reverse',
        )}>

          {/* ── Left panel: identity ────────────────────────── */}
          <div className={cn(
            'flex flex-col justify-between gap-6 p-7 lg:w-[42%] shrink-0',
            'border-b lg:border-b-0 border-white/6',
            isEven ? 'lg:border-l lg:border-r-0' : 'lg:border-r lg:border-l-0',
          )}>
            {/* icon + name */}
            <div className="flex items-start gap-4">
              <span className={cn(
                'grid place-items-center h-14 w-14 rounded-2xl shrink-0 transition-transform duration-300 group-hover:scale-105',
                ICON_BG[product.color],
              )}>
                <Icon className="h-7 w-7" strokeWidth={1.6} />
              </span>
              <div>
                <h3 className={cn('text-2xl font-bold font-display tracking-tight', HEADING_GRAD[product.color])}>
                  {product.name}
                </h3>
                <p className="mt-1 text-sm text-white/55 leading-relaxed">{product.tagline}</p>
              </div>
            </div>

            {/* module count pill */}
            <div className="flex items-center gap-2">
              <GraduationCap className={cn('h-4 w-4 shrink-0', MODULE_PILL[product.color])} strokeWidth={1.8} />
              <span className={cn('mono-caption', MODULE_PILL[product.color])}>
                {ar(product.modules)} وحدات تعليمية
              </span>
            </div>

            {/* affordances */}
            <div className="flex flex-wrap gap-2">
              {AFFORDANCES.map(({ label, icon: AfIcon }) => (
                <button
                  key={label}
                  type="button"
                  className={cn(
                    'flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs transition-all duration-200',
                    AFFORD_BTN[product.color],
                  )}
                >
                  <AfIcon className="h-3.5 w-3.5" strokeWidth={1.8} />
                  {label}
                </button>
              ))}
            </div>

            {/* CTA */}
            <button
              type="button"
              className={cn(
                'flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold',
                'transition-all duration-200 active:scale-95',
                CTA_BTN[product.color],
              )}
            >
              ابدأ الوحدة
              <ArrowLeft className="h-4 w-4 flip-rtl" strokeWidth={2} />
            </button>
          </div>

          {/* ── Right panel: curriculum ─────────────────────── */}
          <div className="flex flex-col gap-6 p-7 flex-1">

            {/* "what you'll learn" heading */}
            <div>
              <p className="mono-caption text-white/40 mb-3">ماذا ستتعلّم</p>
              <ul className="flex flex-col gap-2.5">
                {product.teaches.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <CheckCircle2
                      className={cn('h-4 w-4 mt-0.5 shrink-0', CHECK_COLOR[product.color])}
                      strokeWidth={2}
                    />
                    <span className="text-sm text-white/80 leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* mini topic badges */}
            <div>
              <p className="mono-caption text-white/40 mb-3">المحتوى الأساسي</p>
              <div className="flex flex-wrap gap-2">
                {product.teaches.map((item) => (
                  <span
                    key={item}
                    className={cn(
                      'rounded-full border px-3 py-1 text-xs',
                      BADGE_COLOR[product.color],
                    )}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* progress placeholder */}
            <div className="mt-auto pt-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-white/40">تقدّمك في هذا المنتج</span>
                <span className={cn('mono-caption', MODULE_PILL[product.color])}>
                  {ar(0)} / {ar(product.modules)}
                </span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-white/8 overflow-hidden">
                <div className="h-full w-0 rounded-full"
                     style={{ background: 'currentColor', width: '0%' }} />
              </div>
            </div>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  )
}

// ── Main screen ──────────────────────────────────────────────────────────────

export default function Products() {
  return (
    <div className="space-y-10">

      {/* header */}
      <motion.div
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
      >
        <SectionTitle
          kicker="CYBERXI PRODUCTS ACADEMY"
          title="أكاديمية منتجات CyberXi"
          subtitle="تعرّف على قدرات سايبر اكس — تعليمي، لا تسويقي"
        />
      </motion.div>

      {/* Mr. Savvy intro */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] as const }}
      >
        <SavvySays>
          هنا ستتعرّف على كيفية عمل أدوات الأمن المؤسسية — وليس لبيعها لك، بل لتفهم كيف تحمي هذه التقنيات الشركات الكبرى.
          كل وحدة مبنية على أمثلة حقيقية وعروض تفاعلية تقرّب المفهوم من واقعك اليومي.
        </SavvySays>
      </motion.div>

      {/* product cards */}
      <div className="flex flex-col gap-6">
        {PRODUCTS.map((product, i) => (
          <ProductCard key={product.id} product={product} index={i} />
        ))}
      </div>

      {/* closing strip */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
      >
        <GlassCard className="p-6 flex flex-col sm:flex-row items-center gap-5 text-center sm:text-start">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-cyber-grad text-white shadow-glow-cyber">
            <GraduationCap className="h-6 w-6" strokeWidth={1.8} />
          </span>
          <p className="flex-1 text-sm text-white/75 leading-relaxed">
            كل ما تتعلّمه هنا يُحتسب ضمن رحلتك نحو{' '}
            <span className="text-grad-cyber font-semibold">شهادة CyberXi Savvy</span>
            {' '}— أتمّ الوحدات وتابع تقدّمك في رحلتك.
          </p>
          <Link
            to="/certificate"
            className={cn(
              'shrink-0 flex items-center gap-2 rounded-xl border border-cyber-500/30 px-5 py-2.5',
              'text-sm font-semibold text-cyber-300 hover:bg-cyber-500/10 transition-all duration-200',
            )}
          >
            عرض الشهادة
            <ArrowLeft className="h-4 w-4 flip-rtl" strokeWidth={2} />
          </Link>
        </GlassCard>
      </motion.div>

    </div>
  )
}
