/**
 * Journey.tsx — "THE PATH OF KNOWLEDGE™"
 * Pixar/Apple-grade cinematic learning journey.
 * SVG curved path + energy orb + progressive illumination + Mr. Savvy milestones.
 *
 * Scroll architecture: window scrolls (body). sectionRef is 2200px tall.
 * useScroll(target=sectionRef, offset=['start start','end end']) gives 0→1
 * as the section enters and fully exits the viewport, meaning the orb
 * travels the full path during that window.
 *
 * Performance: orb position driven purely by MotionValues (no setState on
 * scroll). Only reachedIdx uses setState (integer, fires max 9 times total).
 */
import { useRef, useLayoutEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  useMotionValueEvent,
  AnimatePresence,
  type MotionValue,
} from 'framer-motion'
import {
  ChevronDown,
  CheckCircle2,
  Lock,
  Award,
  Star,
  Sparkles,
} from 'lucide-react'
import { GlassCard } from '../components/ui'
import { SavvySays } from '../components/MrSavvy'
import { JOURNEY, type JourneyStage } from '../data'
import { cn, ar } from '../lib/cn'

/* ─────────────────────────────────────────
   CONSTANTS & GEOMETRY
───────────────────────────────────────── */

const STAGE_COUNT = JOURNEY.length  // 9
const CYBER = '#1f8fff'
const SAVVY = '#00e58a'
const GOLD  = '#f5c451'

// SVG viewBox is 400 wide. Each stage occupies BAND px of vertical space.
const SVG_W = 400
const BAND  = 280
const SVG_H = BAND * (STAGE_COUNT - 1) + 160
const NODE_X = SVG_W / 2

const nodeY = (i: number) => 80 + i * BAND

/* Build smooth cubic-Bezier path through all 9 nodes, alternating wave side.
   Deeper waves (±130) make the S-curve more dramatic and cinematic. */
function buildPath(): string {
  const pts = JOURNEY.map((_, i) => ({ x: NODE_X, y: nodeY(i) }))
  let d = `M ${pts[0].x} ${pts[0].y}`
  for (let i = 1; i < pts.length; i++) {
    const prev = pts[i - 1]
    const curr = pts[i]
    const wave = i % 2 === 0 ? 130 : -130
    d += ` C ${prev.x + wave} ${prev.y + BAND * 0.42},`
       + ` ${curr.x - wave} ${curr.y - BAND * 0.42},`
       + ` ${curr.x} ${curr.y}`
  }
  return d
}

const PATH_D = buildPath()

/* Stage scroll-progress threshold (0..1) */
const stageThreshold = (i: number) => i / (STAGE_COUNT - 1)

/* ─────────────────────────────────────────
   PATH SAMPLE TABLE
───────────────────────────────────────── */

interface PathPoint { x: number; y: number }

function buildSampleTable(el: SVGPathElement, samples = 600): PathPoint[] {
  const total = el.getTotalLength()
  return Array.from({ length: samples + 1 }, (_, i) => {
    const pt = el.getPointAtLength((i / samples) * total)
    return { x: pt.x, y: pt.y }
  })
}

function sampleAt(table: PathPoint[], t: number): PathPoint {
  if (table.length === 0) return { x: NODE_X, y: 80 }
  const idx = Math.max(0, Math.min(table.length - 1, Math.round(t * (table.length - 1))))
  return table[idx]
}

/* ─────────────────────────────────────────
   STATIC STYLE MAPS  (no dynamic Tailwind class names)
───────────────────────────────────────── */

const NODE_FILL: Record<JourneyStage['status'], string> = {
  done:   SAVVY,
  active: CYBER,
  locked: '#141934',
}

const NODE_STROKE: Record<JourneyStage['status'], string> = {
  done:   SAVVY,
  active: CYBER,
  locked: '#2a3360',
}

/* ─────────────────────────────────────────
   TRAIL PARTICLES  (fixed offsets behind orb)
   These are rendered as circles trailing the orb on the path.
───────────────────────────────────────── */

const TRAIL_PARTICLES: ReadonlyArray<{ dx: number; dy: number; r: number; delay: number; color: string }> = [
  { dx:  18, dy:  -6, r: 2.4, delay: 0.0, color: SAVVY },
  { dx: -16, dy:   8, r: 1.9, delay: 0.3, color: CYBER },
  { dx:   6, dy:  20, r: 1.6, delay: 0.7, color: SAVVY },
  { dx: -12, dy: -16, r: 2.1, delay: 1.0, color: CYBER },
  { dx:  22, dy:  12, r: 1.5, delay: 0.5, color: GOLD  },
  { dx:  -4, dy:  26, r: 1.3, delay: 1.4, color: SAVVY },
  { dx:  28, dy:  -2, r: 1.1, delay: 0.9, color: CYBER },
]

/* ─────────────────────────────────────────
   ENERGY ORB  — alive, layered, premium
───────────────────────────────────────── */

interface EnergyOrbProps {
  x: MotionValue<number>
  y: MotionValue<number>
}

function EnergyOrb({ x, y }: EnergyOrbProps) {
  return (
    <motion.g style={{ x: x as MotionValue<unknown>, y: y as MotionValue<unknown> }}>
      {/* Outermost diffuse corona */}
      <motion.circle
        cx={0} cy={0} r={36}
        fill="none"
        stroke={SAVVY}
        strokeWidth={1}
        animate={{ opacity: [0.06, 0.18, 0.06], r: [32, 42, 32] }}
        transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Outer glow ring */}
      <motion.circle
        cx={0} cy={0} r={24}
        fill="none"
        stroke={SAVVY}
        strokeWidth={1.5}
        animate={{ opacity: [0.18, 0.45, 0.18], r: [22, 28, 22] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Blue inner halo */}
      <circle cx={0} cy={0} r={16} fill={`${CYBER}20`} stroke={CYBER} strokeWidth={1} opacity={0.5} />
      {/* Savvy green mid shell */}
      <circle cx={0} cy={0} r={11} fill={`${SAVVY}28`} stroke={SAVVY} strokeWidth={1.5} opacity={0.75} />
      {/* Core — white-hot with blue tint */}
      <circle cx={0} cy={0} r={6.5} fill="white" opacity={0.96} filter="url(#orbGlow)" />
      {/* Inner colour dot */}
      <circle cx={0} cy={0} r={3.5} fill={SAVVY} opacity={0.8} />

      {/* Trailing sparkle particles */}
      {TRAIL_PARTICLES.map((p, i) => (
        <motion.circle
          key={i}
          cx={p.dx}
          cy={p.dy}
          r={p.r}
          fill={p.color}
          animate={{ opacity: [0.1, 0.85, 0.1], scale: [0.7, 1.5, 0.7] }}
          transition={{ duration: 2.4 + i * 0.15, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      {/* Rotating scan line */}
      <motion.line
        x1={0} y1={0} x2={18} y2={0}
        stroke={CYBER}
        strokeWidth={1}
        opacity={0.4}
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: 'linear' }}
      />
    </motion.g>
  )
}

/* ─────────────────────────────────────────
   STAGE STATUS ICON NODE  (on-path filled circle)
───────────────────────────────────────── */

interface NodeBadgeProps {
  stage: JourneyStage
  index: number
  isReached: boolean
}

function NodeBadge({ stage, index, isReached }: NodeBadgeProps) {
  const cx = NODE_X
  const cy = nodeY(index)
  const isCert = stage.code === 'CERT'

  const fill =
    isCert && isReached    ? 'url(#certGrad)'   :
    stage.status === 'done' ? 'url(#doneGrad)'   :
    isReached               ? 'url(#activeGrad)' :
    NODE_FILL[stage.status]

  const stroke =
    isCert && isReached ? GOLD :
    isReached           ? (stage.status === 'done' ? SAVVY : CYBER) :
    NODE_STROKE[stage.status]

  const r = isCert ? 20 : 13

  return (
    <g>
      {/* Outer glow halo — only when reached */}
      {isReached && (
        <motion.circle
          cx={cx} cy={cy}
          r={r + 10}
          fill="none"
          stroke={isCert && isReached ? GOLD : (stage.status === 'done' ? SAVVY : CYBER)}
          strokeWidth={1}
          animate={{ r: [r + 8, r + 20, r + 8], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: 'easeOut' }}
        />
      )}

      {/* Gold pulsing halo for cert node always visible */}
      {isCert && (
        <>
          <motion.circle
            cx={cx} cy={cy} r={36}
            fill="none" stroke={GOLD} strokeWidth={1.5}
            animate={{ opacity: [0.08, 0.35, 0.08], r: [30, 44, 30] }}
            transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.circle
            cx={cx} cy={cy} r={28}
            fill="none" stroke={GOLD} strokeWidth={0.8} strokeDasharray="4 6"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
            style={{ transformOrigin: `${cx}px ${cy}px` }}
          />
        </>
      )}

      {/* Main node circle */}
      <motion.circle
        cx={cx} cy={cy}
        r={r}
        fill={fill}
        stroke={stroke}
        strokeWidth={isReached ? 2.5 : 1}
        animate={isReached ? { scale: [1, 1.06, 1] } : { scale: 1 }}
        transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
        filter={isCert && isReached ? 'url(#goldGlow)' : isReached ? 'url(#nodeGlow)' : undefined}
      />

      {/* Stage number */}
      <text
        x={cx} y={cy + 1}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={isCert ? '10' : '8.5'}
        fontFamily="JetBrains Mono, monospace"
        fontWeight="700"
        fill={
          (isCert || stage.status === 'done') ? '#05060c' :
          isReached ? '#ffffff' :
          '#ffffff33'
        }
      >
        {ar(index + 1)}
      </text>
    </g>
  )
}

/* ─────────────────────────────────────────
   CERTIFICATE CELEBRATION  — gold flourish particles
───────────────────────────────────────── */

const CERT_PARTICLES = Array.from({ length: 12 }, (_, i) => ({
  angle: (i / 12) * 360,
  r: 48 + (i % 3) * 18,
  size: 2.2 + (i % 4) * 0.8,
  delay: i * 0.08,
  color: i % 3 === 0 ? GOLD : i % 3 === 1 ? SAVVY : CYBER,
}))

function CertCelebration({ active }: { active: boolean }) {
  if (!active) return null
  const cx = NODE_X
  const cy = nodeY(STAGE_COUNT - 1)
  return (
    <>
      {CERT_PARTICLES.map((p, i) => {
        const rad = (p.angle * Math.PI) / 180
        const tx = cx + Math.cos(rad) * p.r
        const ty = cy + Math.sin(rad) * p.r
        return (
          <motion.circle
            key={i}
            cx={tx}
            cy={ty}
            r={p.size}
            fill={p.color}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 1, 0.6, 0], scale: [0, 1.4, 1, 0] }}
            transition={{ duration: 2.8, delay: p.delay, repeat: Infinity, ease: [0.16, 1, 0.3, 1] as const }}
          />
        )
      })}
    </>
  )
}

/* ─────────────────────────────────────────
   STAGE CARD  — premium glass, alternating layout
───────────────────────────────────────── */

interface StageCardProps {
  stage: JourneyStage
  index: number
  isReached: boolean
  isCurrentMilestone: boolean
}

function StageCard({ stage, index, isReached, isCurrentMilestone }: StageCardProps) {
  const isRight = index % 2 === 0
  const isCert  = stage.code === 'CERT'
  const Icon    = stage.icon

  const glowColor   = isCert ? GOLD : isReached ? SAVVY : (stage.status === 'active' ? CYBER : '#2a3360')
  const borderColor = `${glowColor}${isReached ? '55' : '14'}`

  const iconColor =
    isCert && isReached   ? GOLD :
    stage.status === 'done' ? SAVVY :
    isReached               ? SAVVY :
    stage.status === 'active' ? CYBER :
    '#ffffff28'

  const iconBg =
    isCert && isReached   ? `${GOLD}1a` :
    stage.status === 'done' ? `${SAVVY}18` :
    isReached               ? `${SAVVY}18` :
    stage.status === 'active' ? `${CYBER}18` :
    '#ffffff06'

  return (
    <motion.div
      initial={{ opacity: 0, x: isRight ? 40 : -40, scale: 0.95 }}
      animate={{
        opacity: isReached || stage.status !== 'locked' ? 1 : 0.28,
        x: 0,
        scale: isCurrentMilestone ? 1.015 : 1,
      }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
      className={cn('absolute w-[calc(50%-44px)]', isRight ? 'right-0 text-right' : 'left-0 text-left')}
      style={{ top: nodeY(index) - 80 }}
    >
      <GlassCard
        hover={false}
        className={cn(
          'p-4 transition-all duration-500 relative overflow-hidden',
          isCert && isReached ? 'shadow-glow-gold' : '',
          isCurrentMilestone && !isCert ? 'shadow-glow-savvy' : '',
        )}
        style={{
          borderColor,
          boxShadow: isReached
            ? `0 0 0 1px ${borderColor}, 0 0 40px -8px ${glowColor}55, inset 0 1px 0 rgba(255,255,255,0.08)`
            : undefined,
        }}
      >
        {/* Unlock flash once */}
        <AnimatePresence>
          {isReached && (
            <motion.div
              key={`flash-${index}`}
              className="pointer-events-none absolute inset-0 rounded-2xl"
              initial={{ opacity: 0.7 }}
              animate={{ opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              style={{ background: `radial-gradient(ellipse at center, ${glowColor}60, transparent 68%)` }}
            />
          )}
        </AnimatePresence>

        {/* Subtle noise texture overlay */}
        {isReached && (
          <div
            className="pointer-events-none absolute inset-0 rounded-2xl opacity-[0.035]"
            style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'80\' height=\'80\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'2\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")', mixBlendMode: 'overlay' }}
          />
        )}

        {/* Certificate destination badge */}
        {isCert && (
          <div className={cn('mb-3 flex', isRight ? 'justify-end' : 'justify-start')}>
            <motion.span
              className="mono-caption text-[10px] px-3 py-1 rounded-full"
              style={{ color: GOLD, background: `${GOLD}18`, border: `1px solid ${GOLD}44` }}
              animate={{ boxShadow: [`0 0 8px ${GOLD}00`, `0 0 14px ${GOLD}66`, `0 0 8px ${GOLD}00`] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
            >
              ✦ DESTINATION ✦
            </motion.span>
          </div>
        )}

        {/* Icon + title row */}
        <div className={cn('flex items-center gap-3 mb-2.5', isRight ? 'flex-row-reverse' : '')}>
          <motion.span
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl transition-colors duration-500"
            style={{
              background: iconBg,
              border: `1px solid ${iconColor}44`,
              color: iconColor,
              boxShadow: isReached ? `0 0 14px ${iconColor}44` : 'none',
            }}
            animate={isCurrentMilestone ? { scale: [1, 1.1, 1] } : { scale: 1 }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          >
            {stage.status === 'done'
              ? <CheckCircle2 className="h-5 w-5" />
              : (stage.status === 'locked' && !isReached)
                ? <Lock className="h-4 w-4 opacity-50" />
                : isCert
                  ? <Award className="h-5 w-5" />
                  : <Icon className="h-5 w-5" />}
          </motion.span>

          <div className="min-w-0 flex-1">
            <p className="mono-caption text-cyber-400">{stage.code}</p>
            <p className={cn(
              'text-sm font-bold leading-snug mt-0.5 transition-colors duration-500',
              isReached || stage.status !== 'locked' ? 'text-white' : 'text-white/35',
            )}>
              {stage.title}
            </p>
          </div>
        </div>

        {/* Description */}
        <p className={cn(
          'text-xs leading-relaxed transition-colors duration-500',
          isReached || stage.status !== 'locked' ? 'text-white/60' : 'text-white/22',
        )}>
          {stage.desc}
        </p>

        {/* Done check line */}
        {stage.status === 'done' && (
          <div className={cn('mt-2.5 flex items-center gap-1.5', isRight ? 'flex-row-reverse' : '')}>
            <CheckCircle2 className="h-3.5 w-3.5 shrink-0" style={{ color: SAVVY }} />
            <span className="text-[11px] font-medium" style={{ color: SAVVY }}>مكتمل</span>
          </div>
        )}

        {/* Active progress indicator */}
        {stage.status === 'active' && (
          <div className="mt-2.5">
            <div className="h-1 rounded-full overflow-hidden" style={{ background: `${CYBER}1a` }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: `linear-gradient(90deg, ${CYBER}, ${SAVVY})`, boxShadow: `0 0 8px ${CYBER}88` }}
                animate={{ width: ['30%', '55%', '30%'] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>
          </div>
        )}

        {/* Certificate CTA */}
        {isCert && isReached && (
          <div className="mt-4 flex justify-center">
            <Link
              to="/certificate"
              className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-all duration-300 hover:scale-105"
              style={{
                background: `linear-gradient(135deg, #ffe39a 0%, ${GOLD} 50%, #d4940a 100%)`,
                color: '#05060c',
                boxShadow: `0 0 28px ${GOLD}88, inset 0 1px 0 rgba(255,255,255,0.35)`,
              }}
            >
              <Award className="h-4 w-4" />
              اعرض شهادتك
            </Link>
          </div>
        )}
      </GlassCard>

      {/* Mr. Savvy milestone message */}
      <AnimatePresence>
        {isCurrentMilestone && (
          <motion.div
            key={`savvy-${index}`}
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ delay: 0.4, duration: 0.55, ease: [0.16, 1, 0.3, 1] as const }}
            className="mt-3"
          >
            <SavvySays size={38} className={cn(isRight ? 'flex-row-reverse' : '')}>
              {stage.savvy}
            </SavvySays>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/* ─────────────────────────────────────────
   HERO INTRO  — top of journey page
───────────────────────────────────────── */

function JourneyHero({ hintOpacity }: { hintOpacity: MotionValue<number> }) {
  return (
    <div className="px-6 pt-8 pb-10 text-center relative">
      {/* Ambient radial behind hero */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-64 opacity-40"
        style={{
          background: `radial-gradient(ellipse 80% 60% at 50% 0%, ${CYBER}33, transparent 70%)`,
        }}
      />

      <motion.p
        className="mono-caption text-cyber-400 mb-3"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        THE PATH OF KNOWLEDGE™
      </motion.p>

      <motion.h1
        className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-none mb-4"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] as const }}
      >
        <span className="text-grad-cyber">رحلة</span>{' '}
        <span className="text-white">المعرفة</span>
      </motion.h1>

      <motion.p
        className="text-sm text-white/50 max-w-sm mx-auto leading-relaxed mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.35 }}
      >
        من مبتدئ إلى بطل سيبراني معتمد — اتبع الضوء واكتشف طريقك
      </motion.p>

      {/* Scroll hint — fades on first scroll */}
      <motion.div
        className="flex flex-col items-center gap-1.5 text-white/35"
        style={{ opacity: hintOpacity }}
      >
        <span className="text-xs mono-caption">مرّر للأسفل لإضاءة الطريق</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="h-5 w-5" />
        </motion.div>
      </motion.div>
    </div>
  )
}

/* ─────────────────────────────────────────
   PROGRESS BAR  — sticky at top during scroll
───────────────────────────────────────── */

interface ProgressBarProps {
  barScaleX: MotionValue<number>
  reachedIdx: number
}

function JourneyProgressBar({ barScaleX, reachedIdx }: ProgressBarProps) {
  return (
    <div
      className="sticky top-16 z-20 px-5 sm:px-7 py-3 backdrop-blur-xl border-b border-white/5"
      style={{ background: 'linear-gradient(180deg, rgba(5,6,12,0.95) 0%, rgba(5,6,12,0.80) 100%)' }}
    >
      <div className="flex items-center gap-3 max-w-[1280px] mx-auto">
        <div className="flex items-center gap-1.5">
          <Star className="h-3.5 w-3.5" style={{ color: SAVVY }} />
          <span className="mono-caption text-white/40">المرحلة</span>
        </div>
        <div className="h-1.5 flex-1 overflow-hidden rounded-full" style={{ background: 'rgba(255,255,255,0.07)' }}>
          <motion.div
            className="h-full rounded-full"
            style={{
              background: `linear-gradient(90deg, ${SAVVY} 0%, ${CYBER} 60%, ${GOLD} 100%)`,
              boxShadow: `0 0 14px ${SAVVY}88`,
              scaleX: barScaleX,
              transformOrigin: 'right',
            }}
          />
        </div>
        <span className="mono-caption" style={{ color: SAVVY }}>
          {ar(reachedIdx + 1)}&nbsp;/&nbsp;{ar(STAGE_COUNT)}
        </span>
        <Sparkles className="h-3.5 w-3.5" style={{ color: reachedIdx === STAGE_COUNT - 1 ? GOLD : CYBER }} />
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   SVG DEFS  — all filters + gradients
───────────────────────────────────────── */

function SvgDefs({ totalLength }: { totalLength: number }) {
  return (
    <defs>
      {/* Orb core glow */}
      <filter id="orbGlow" x="-400%" y="-400%" width="900%" height="900%">
        <feGaussianBlur stdDeviation="6" result="blur" />
        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>

      {/* Path glow — green active segment */}
      <filter id="pathGlowGreen" x="-25%" y="-8%" width="150%" height="116%">
        <feGaussianBlur stdDeviation="4" result="blur" />
        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>

      {/* Softer glow for the cyan base path */}
      <filter id="pathGlowBase" x="-20%" y="-6%" width="140%" height="112%">
        <feGaussianBlur stdDeviation="2.5" result="blur" />
        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>

      {/* Node glow — green */}
      <filter id="nodeGlow" x="-250%" y="-250%" width="600%" height="600%">
        <feGaussianBlur stdDeviation="4" result="blur" />
        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>

      {/* Gold glow — certificate */}
      <filter id="goldGlow" x="-300%" y="-300%" width="700%" height="700%">
        <feGaussianBlur stdDeviation="8" result="blur" />
        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>

      {/* Active flow dash gradient */}
      <linearGradient id="flowGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"   stopColor={CYBER} stopOpacity="0.9" />
        <stop offset="50%"  stopColor={SAVVY} stopOpacity="1"   />
        <stop offset="100%" stopColor={GOLD}  stopOpacity="0.6" />
      </linearGradient>

      {/* Node fill gradients */}
      <radialGradient id="certGrad" cx="35%" cy="30%" r="70%">
        <stop offset="0%"   stopColor="#fff0b0" />
        <stop offset="60%"  stopColor={GOLD} />
        <stop offset="100%" stopColor="#c47a00" />
      </radialGradient>
      <radialGradient id="activeGrad" cx="30%" cy="25%" r="75%">
        <stop offset="0%"   stopColor="#a3d3ff" />
        <stop offset="100%" stopColor={CYBER} />
      </radialGradient>
      <radialGradient id="doneGrad" cx="30%" cy="25%" r="75%">
        <stop offset="0%"   stopColor="#8bffcd" />
        <stop offset="100%" stopColor={SAVVY} />
      </radialGradient>

      {/* Animated flow gradient along the active path — offset drives dash reveal */}
      <linearGradient id="activePathGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%"   stopColor={CYBER}  />
        <stop offset="100%" stopColor={SAVVY}  />
      </linearGradient>

      {/* Glowing background path gradient */}
      <linearGradient id="basePathGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%"   stopColor={CYBER} stopOpacity="0.35" />
        <stop offset="100%" stopColor="#2a3360" stopOpacity="0.45" />
      </linearGradient>

      {/* Clip path for the canvas area */}
      <clipPath id="svgClip">
        <rect x="0" y="0" width={SVG_W} height={totalLength || SVG_H} />
      </clipPath>
    </defs>
  )
}

/* ─────────────────────────────────────────
   CERTIFICATE FLOURISH PANEL
───────────────────────────────────────── */

function CertFlourishPanel({ visible }: { visible: boolean }) {
  return (
    <motion.div
      className="relative mx-auto max-w-md px-6 pb-20 pt-4 text-center"
      initial={{ opacity: 0, y: 32, scale: 0.96 }}
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 32, scale: visible ? 1 : 0.96 }}
      transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] as const }}
    >
      <div
        className="rounded-3xl p-8 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(20,15,5,0.92), rgba(8,6,2,0.88))',
          border: `1px solid ${GOLD}55`,
          boxShadow: `0 0 80px -16px ${GOLD}66, inset 0 1px 0 ${GOLD}22`,
        }}
      >
        {/* Gold shimmer sweep */}
        <motion.div
          className="absolute inset-0 rounded-3xl pointer-events-none"
          animate={{ backgroundPosition: ['200% 50%', '-200% 50%'] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'linear' }}
          style={{
            backgroundImage: `linear-gradient(105deg, transparent 30%, ${GOLD}22 50%, transparent 70%)`,
            backgroundSize: '300% 100%',
          }}
        />

        {/* Award icon */}
        <motion.div
          className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-2xl relative"
          style={{
            background: `linear-gradient(135deg, ${GOLD}28, ${GOLD}10)`,
            border: `2px solid ${GOLD}55`,
            boxShadow: `0 0 32px ${GOLD}55`,
          }}
          animate={{ rotate: [0, -3, 3, 0], scale: [1, 1.04, 1] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Award className="h-8 w-8" style={{ color: GOLD }} />
          {/* Sparkle dots around icon */}
          {[0, 60, 120, 180, 240, 300].map((deg, k) => (
            <motion.span
              key={k}
              className="absolute h-1.5 w-1.5 rounded-full"
              style={{
                background: GOLD,
                top: '50%',
                left: '50%',
                transform: `translate(-50%,-50%) rotate(${deg}deg) translateY(-26px)`,
              }}
              animate={{ opacity: [0.2, 1, 0.2], scale: [0.6, 1.3, 0.6] }}
              transition={{ duration: 2, delay: k * 0.18, repeat: Infinity, ease: 'easeInOut' }}
            />
          ))}
        </motion.div>

        <h3 className="text-xl font-extrabold text-grad-gold mb-2">وجهتك النهائية</h3>
        <p className="text-xs mono-caption text-gold-400 mb-3" style={{ letterSpacing: '0.18em' }}>
          CYBERXI SAVVY AI SERVICE CERTIFICATE
        </p>
        <p className="text-sm text-white/55 mb-6 leading-relaxed">
          أتممت رحلة المعرفة وأصبحت بطلاً سيبرانياً معتمداً من CyberXi Savvy
        </p>

        <Link
          to="/certificate"
          className="inline-flex items-center gap-2.5 rounded-xl px-7 py-3 text-sm font-bold transition-all duration-300 hover:scale-105"
          style={{
            background: `linear-gradient(135deg, #fff0a0 0%, ${GOLD} 45%, #c47a00 100%)`,
            color: '#05060c',
            boxShadow: `0 0 32px ${GOLD}88, inset 0 1px 0 rgba(255,255,255,0.4)`,
          }}
        >
          <Award className="h-4 w-4" />
          اعرض شهادتك الآن
        </Link>
      </div>
    </motion.div>
  )
}

/* ─────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────── */

export default function Journey() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const svgPathRef = useRef<SVGPathElement>(null)

  const [sampleTable, setSampleTable] = useState<PathPoint[]>([])
  const [totalLength, setTotalLength] = useState(0)

  useLayoutEffect(() => {
    const el = svgPathRef.current
    if (!el) return
    setSampleTable(buildSampleTable(el, 600))
    setTotalLength(el.getTotalLength())
  }, [])

  // Orb position — pure MotionValues, no setState on scroll
  const orbRawX = useMotionValue(NODE_X)
  const orbRawY = useMotionValue(80)
  const orbX = useSpring(orbRawX, { stiffness: 90, damping: 22, restDelta: 0.001 })
  const orbY = useSpring(orbRawY, { stiffness: 90, damping: 22, restDelta: 0.001 })

  // Reached stage — integer, fires at most 9 times
  const [reachedIdx, setReachedIdx] = useState<number>(() =>
    JOURNEY.reduce((acc, s, i) => (s.status !== 'locked' ? i : acc), 0),
  )

  // Scroll progress: window scrolls, section is the target
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    // Update orb position from sample table — no setState
    if (sampleTable.length > 0) {
      const pt = sampleAt(sampleTable, latest)
      orbRawX.set(pt.x)
      orbRawY.set(pt.y)
    }
    // Update reached stage — integer, max 9 changes total
    let idx = 0
    for (let i = 0; i < STAGE_COUNT; i++) {
      if (latest >= stageThreshold(i) - 0.01) idx = i
    }
    setReachedIdx(prev => (prev !== idx ? idx : prev))
  })

  // Stroke-dashoffset: drives the lit green overlay
  const dashOffset = useTransform(scrollYProgress, [0, 1], [totalLength, 0])

  // Animated flow dash offset — offset by 20px from the lit segment front
  // Use array form to preserve MotionValue<number> type
  const flowDashOffset = useTransform(dashOffset, [totalLength, 0], [totalLength - 20, -20])

  // Scroll hint fades after 6% scroll
  const hintOpacity = useTransform(scrollYProgress, [0, 0.06], [1, 0])

  // Progress bar
  const barScaleX = useTransform(scrollYProgress, [0, 1], [0, 1])

  const isCertReached = reachedIdx === STAGE_COUNT - 1

  const cardStates = useMemo(
    () => JOURNEY.map((stage, i) => ({
      isReached: i <= reachedIdx || stage.status === 'done',
      isCurrentMilestone: i === reachedIdx,
    })),
    [reachedIdx],
  )

  return (
    <div className="relative min-h-screen" dir="rtl">

      {/* ── HERO ─────────────────────────────────────── */}
      <JourneyHero hintOpacity={hintOpacity} />

      {/* ── PROGRESS BAR ─────────────────────────────── */}
      <JourneyProgressBar barScaleX={barScaleX} reachedIdx={reachedIdx} />

      {/* ── JOURNEY SECTION ──────────────────────────── */}
      {/*
        Height is explicit so the window scrolls over exactly SVG_H pixels
        of section content, giving smooth 0→1 scroll progress.
        The padding wrapper in AppLayout (p-5 sm:p-7) is accounted for —
        the section max-width is wider than the SVG viewBox so cards
        have room to the left/right of the path.
      */}
      <div
        ref={sectionRef}
        className="relative mx-auto"
        style={{ maxWidth: 960, height: SVG_H }}
      >

        {/* ── SVG PATH LAYER ─── */}
        <svg
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          preserveAspectRatio="xMidYMin meet"
          className="absolute inset-0 h-full w-full pointer-events-none"
          aria-hidden="true"
          style={{ overflow: 'visible' }}
        >
          <SvgDefs totalLength={totalLength} />

          {/* 1. Wide soft glow under the base path */}
          <path
            d={PATH_D}
            fill="none"
            stroke={CYBER}
            strokeWidth={12}
            strokeOpacity={0.06}
            strokeLinecap="round"
            filter="url(#pathGlowBase)"
          />

          {/* 2. Base path — gradient stroke, full route visible ahead */}
          <path
            d={PATH_D}
            fill="none"
            stroke="url(#basePathGrad)"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeDasharray="6 10"
          />

          {/* 3. Active (lit) overlay path — savvy green, scroll-revealed */}
          {totalLength > 0 && (
            <>
              {/* Glow layer */}
              <motion.path
                d={PATH_D}
                fill="none"
                stroke={SAVVY}
                strokeWidth={8}
                strokeOpacity={0.22}
                strokeLinecap="round"
                strokeDasharray={totalLength}
                style={{ strokeDashoffset: dashOffset }}
                filter="url(#pathGlowGreen)"
              />
              {/* Sharp stroke */}
              <motion.path
                d={PATH_D}
                fill="none"
                stroke="url(#activePathGrad)"
                strokeWidth={3.5}
                strokeLinecap="round"
                strokeDasharray={totalLength}
                style={{ strokeDashoffset: dashOffset }}
              />
              {/* Animated energy flow dash on the lit portion */}
              <motion.path
                d={PATH_D}
                fill="none"
                stroke="white"
                strokeWidth={1.5}
                strokeOpacity={0.35}
                strokeLinecap="round"
                strokeDasharray="14 40"
                style={{ strokeDashoffset: flowDashOffset }}
              />
            </>
          )}

          {/* 4. Hidden path for measurement only */}
          <path ref={svgPathRef} d={PATH_D} fill="none" stroke="none" strokeWidth={0} />

          {/* 5. Stage node badges */}
          {JOURNEY.map((stage, i) => (
            <NodeBadge
              key={stage.id}
              stage={stage}
              index={i}
              isReached={cardStates[i].isReached}
            />
          ))}

          {/* 6. Certificate celebration particles */}
          <CertCelebration active={isCertReached} />

          {/* 7. Energy Orb — only after sample table built */}
          {sampleTable.length > 0 && <EnergyOrb x={orbX} y={orbY} />}
        </svg>

        {/* ── STAGE CARDS (HTML over SVG) ─── */}
        {JOURNEY.map((stage, i) => (
          <StageCard
            key={stage.id}
            stage={stage}
            index={i}
            isReached={cardStates[i].isReached}
            isCurrentMilestone={cardStates[i].isCurrentMilestone}
          />
        ))}
      </div>

      {/* ── CERTIFICATE FLOURISH PANEL ───────────────── */}
      <CertFlourishPanel visible={isCertReached} />

    </div>
  )
}
