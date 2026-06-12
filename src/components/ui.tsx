import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import { cn, ar } from '../lib/cn'

type Accent = 'cyber' | 'savvy' | 'gold' | 'violet' | 'danger'

const HEX: Record<Accent, string> = {
  cyber: '#1f8fff', savvy: '#00e58a', gold: '#f5c451', violet: '#7c5cff', danger: '#ff3366',
}
export const accentHex = (a: Accent) => HEX[a]

const GLOW: Record<Accent, string> = {
  cyber: 'shadow-glow-cyber', savvy: 'shadow-glow-savvy', gold: 'shadow-glow-gold',
  violet: 'shadow-glow-cyber', danger: 'shadow-glow-gold',
}

/** Frosted glass surface used everywhere. */
export function GlassCard({ className, children, glow, hover = true, ...rest }:
  React.HTMLAttributes<HTMLDivElement> & { glow?: Accent; hover?: boolean }) {
  return (
    <div
      className={cn(
        'glass rounded-2xl shadow-card transition-all duration-300',
        hover && 'hover:-translate-y-0.5',
        glow && hover && `hover:${GLOW[glow]}`,
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
}

/** Small label/kicker + title block. */
export function SectionTitle({ kicker, title, subtitle, action }:
  { kicker?: string; title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-end justify-between gap-4 mb-5">
      <div>
        {kicker && <p className="mono-caption text-cyber-400 mb-1.5">{kicker}</p>}
        <h2 className="text-2xl font-bold text-white leading-tight">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-white/55">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

export function Pill({ children, accent = 'cyber', className }:
  { children: React.ReactNode; accent?: Accent; className?: string }) {
  const c = HEX[accent]
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 mono-caption', className)}
          style={{ color: c, background: `${c}1a`, border: `1px solid ${c}33` }}>
      {children}
    </span>
  )
}

/** Circular progress ring with centered value. */
export function ScoreRing({ value, label, accent = 'cyber', size = 120, stroke = 9, delay = 0 }:
  { value: number; label?: string; accent?: Accent; size?: number; stroke?: number; delay?: number }) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const off = c * (1 - value / 100)
  const col = HEX[accent]
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} />
          <motion.circle
            cx={size / 2} cy={size / 2} r={r} fill="none" stroke={col} strokeWidth={stroke} strokeLinecap="round"
            strokeDasharray={c} initial={{ strokeDashoffset: c }} whileInView={{ strokeDashoffset: off }}
            viewport={{ once: true }} transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] as const, delay }}
            style={{ filter: `drop-shadow(0 0 6px ${col}aa)` }}
          />
        </svg>
        <div className="absolute inset-0 grid place-items-center">
          <span className="text-2xl font-bold tabular-nums" style={{ color: col }}>{ar(value)}<span className="text-sm">٪</span></span>
        </div>
      </div>
      {label && <span className="text-xs text-white/60 text-center max-w-[120px]">{label}</span>}
    </div>
  )
}

/** Linear progress bar. */
export function ProgressBar({ value, accent = 'cyber', className, delay = 0 }:
  { value: number; accent?: Accent; className?: string; delay?: number }) {
  const col = HEX[accent]
  return (
    <div className={cn('h-2 rounded-full bg-white/8 overflow-hidden', className)}>
      <motion.div className="h-full rounded-full" style={{ background: col, boxShadow: `0 0 10px ${col}` }}
        initial={{ width: 0 }} whileInView={{ width: `${value}%` }} viewport={{ once: true }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] as const, delay }} />
    </div>
  )
}

/** Compact stat tile with icon. */
export function StatTile({ icon: Icon, label, value, sub, accent = 'cyber' }:
  { icon: LucideIcon; label: string; value: string; sub?: string; accent?: Accent }) {
  const col = HEX[accent]
  return (
    <GlassCard className="p-4 flex items-center gap-3.5">
      <span className="grid h-11 w-11 place-items-center rounded-xl shrink-0"
            style={{ color: col, background: `${col}1a`, border: `1px solid ${col}33` }}>
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-0">
        <p className="text-xl font-bold text-white leading-none">{value}</p>
        <p className="text-xs text-white/55 mt-1 truncate">{label}</p>
        {sub && <p className="text-[11px] text-white/40 mt-0.5">{sub}</p>}
      </div>
    </GlassCard>
  )
}

export { HEX as ACCENT_HEX }
