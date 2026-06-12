/**
 * Journey.tsx — "THE PATH OF KNOWLEDGE™"
 * Scroll-animated cinematic learning journey.
 * SVG curved path + energy orb + progressive illumination + Mr. Savvy milestones.
 */
import { useRef, useLayoutEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from 'framer-motion'
import { ChevronDown, CheckCircle2, Lock, Zap, Award } from 'lucide-react'
import { GlassCard, SectionTitle } from '../components/ui'
import { SavvySays } from '../components/MrSavvy'
import { JOURNEY, type JourneyStage } from '../data'
import { cn, ar } from '../lib/cn'

/* ─────────────────────────────────────────
   CONSTANTS & GEOMETRY
───────────────────────────────────────── */

const STAGE_COUNT = JOURNEY.length   // 9
const CYBER = '#1f8fff'
const SAVVY = '#00e58a'
const GOLD  = '#f5c451'

// SVG viewBox is 400 wide. Each stage occupies BAND px of vertical space.
const SVG_W  = 400
const BAND   = 260
const SVG_H  = BAND * (STAGE_COUNT - 1) + 120
const NODE_X = SVG_W / 2  // all nodes centred horizontally

const nodeY = (i: number) => 60 + i * BAND

/* Build smooth cubic-Bezier path through all 9 nodes, alternating wave side */
function buildPath(): string {
  const pts = JOURNEY.map((_, i) => ({ x: NODE_X, y: nodeY(i) }))
  let d = `M ${pts[0].x} ${pts[0].y}`
  for (let i = 1; i < pts.length; i++) {
    const prev = pts[i - 1]
    const curr = pts[i]
    const wave = i % 2 === 0 ? 110 : -110
    d += ` C ${prev.x + wave} ${prev.y + BAND * 0.45},`
       + ` ${curr.x - wave} ${curr.y - BAND * 0.45},`
       + ` ${curr.x} ${curr.y}`
  }
  return d
}

const PATH_D = buildPath()

/* Stage scroll-progress threshold (0..1) */
const stageThreshold = (i: number) => i / (STAGE_COUNT - 1)

/* ─────────────────────────────────────────
   PATH SAMPLE TABLE
   Built once after mount from the hidden <path> element.
───────────────────────────────────────── */

interface PathPoint { x: number; y: number }

function buildSampleTable(el: SVGPathElement, samples = 400): PathPoint[] {
  const total = el.getTotalLength()
  return Array.from({ length: samples + 1 }, (_, i) => {
    const pt = el.getPointAtLength((i / samples) * total)
    return { x: pt.x, y: pt.y }
  })
}

function sampleAt(table: PathPoint[], t: number): PathPoint {
  if (table.length === 0) return { x: NODE_X, y: 60 }
  const idx = Math.max(0, Math.min(table.length - 1, Math.round(t * (table.length - 1))))
  return table[idx]
}

/* ─────────────────────────────────────────
   STATIC STYLE MAPS  (no dynamic Tailwind class names)
───────────────────────────────────────── */

const NODE_FILL: Record<JourneyStage['status'], string> = {
  done:   SAVVY,
  active: CYBER,
  locked: '#1e2440',
}

const NODE_STROKE: Record<JourneyStage['status'], string> = {
  done:   SAVVY,
  active: CYBER,
  locked: '#2a3360',
}

/* ─────────────────────────────────────────
   SPARKLE OFFSETS  (fixed static array)
───────────────────────────────────────── */

const SPARKLES: ReadonlyArray<{ dx: number; dy: number; r: number; delay: number }> = [
  { dx:  20, dy:  -8, r: 2.2, delay: 0.0 },
  { dx: -18, dy:   6, r: 1.8, delay: 0.4 },
  { dx:   8, dy:  22, r: 1.5, delay: 0.8 },
  { dx: -10, dy: -18, r: 2.0, delay: 1.1 },
  { dx:  24, dy:  14, r: 1.4, delay: 0.6 },
]

/* ─────────────────────────────────────────
   STAGE CARD
───────────────────────────────────────── */

interface StageCardProps {
  stage: JourneyStage
  index: number
  isReached: boolean
  isCurrentMilestone: boolean
}

function StageCard({ stage, index, isReached, isCurrentMilestone }: StageCardProps) {
  const isRight = index % 2 === 0   // even = right side (RTL start side)
  const isCert  = stage.code === 'CERT'
  const Icon    = stage.icon

  const glowColor  = (isCert && isReached) ? GOLD : (isReached || stage.status === 'done') ? SAVVY : CYBER
  const borderAlpha = (isCert && isReached) ? '44' : (isReached || stage.status === 'done') ? '44' : '12'
  const borderColor = `${glowColor}${borderAlpha}`

  const iconBg    = (isCert && isReached) ? `${GOLD}22` : (isReached || stage.status === 'done') ? `${SAVVY}22` : '#ffffff08'
  const iconColor = (isCert && isReached) ? GOLD : (isReached || stage.status === 'done') ? SAVVY : (stage.status === 'active') ? CYBER : '#ffffff33'

  return (
    <motion.div
      initial={{ opacity: 0, x: isRight ? 32 : -32 }}
      animate={{
        opacity: isReached || stage.status !== 'locked' ? 1 : 0.35,
        x: 0,
      }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] as const }}
      className={cn('absolute w-[calc(50%-36px)]', isRight ? 'right-0 text-right' : 'left-0 text-left')}
      style={{ top: nodeY(index) - 70 }}
    >
      <GlassCard
        hover={false}
        className={cn('p-4 transition-all duration-500', isCert && isReached ? 'shadow-glow-gold' : '')}
        style={{
          borderColor,
          boxShadow: isReached
            ? `0 0 0 1px ${borderColor}, 0 0 28px -6px ${glowColor}66`
            : undefined,
        }}
      >
        {isCert && (
          <div className="mb-3 flex justify-center">
            <span
              className="mono-caption text-[10px] px-2.5 py-1 rounded-full"
              style={{ color: GOLD, background: `${GOLD}18`, border: `1px solid ${GOLD}33` }}
            >
              DESTINATION
            </span>
          </div>
        )}

        {/* Icon + title row */}
        <div className={cn('flex items-center gap-3 mb-2.5', isRight ? 'flex-row-reverse' : '')}>
          <span
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl transition-colors duration-500"
            style={{ background: iconBg, border: `1px solid ${iconColor}33`, color: iconColor }}
          >
            {stage.status === 'done'
              ? <CheckCircle2 className="h-5 w-5" />
              : (stage.status === 'locked' && !isReached)
                ? <Lock className="h-4 w-4 opacity-60" />
                : <Icon className="h-5 w-5" />}
          </span>
          <div className="min-w-0 flex-1">
            <p className="mono-caption text-cyber-400">{stage.code}</p>
            <p className={cn(
              'text-sm font-bold leading-tight mt-0.5 transition-colors duration-500',
              isReached || stage.status !== 'locked' ? 'text-white' : 'text-white/40',
            )}>
              {stage.title}
            </p>
          </div>
        </div>

        <p className={cn(
          'text-xs leading-relaxed transition-colors duration-500',
          isReached || stage.status !== 'locked' ? 'text-white/65' : 'text-white/25',
        )}>
          {stage.desc}
        </p>

        {isCert && isReached && (
          <div className="mt-4 flex justify-center">
            <Link
              to="/certificate"
              className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-all duration-300 hover:scale-105"
              style={{
                background: `linear-gradient(135deg, ${GOLD}ee 0%, #e0a92e 100%)`,
                color: '#05060c',
                boxShadow: `0 0 20px ${GOLD}66`,
              }}
            >
              <Award className="h-4 w-4" />
              اعرض شهادتك
            </Link>
          </div>
        )}
      </GlassCard>

      {isCurrentMilestone && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="mt-3"
        >
          <SavvySays size={40} className={isRight ? 'flex-row-reverse' : ''}>
            {stage.savvy}
          </SavvySays>
        </motion.div>
      )}
    </motion.div>
  )
}

/* ─────────────────────────────────────────
   ENERGY ORB  (receives plain numbers — inside SVG)
   Rendered inside the SVG so cx/cy are real SVG coordinates.
───────────────────────────────────────── */

interface EnergyOrbProps { x: number; y: number }

function EnergyOrb({ x, y }: EnergyOrbProps) {
  return (
    <g>
      {/* Outer glow ring */}
      <circle cx={x} cy={y} r={22} fill="none" stroke={SAVVY} strokeWidth={1.5} opacity={0.22} />
      {/* Mid */}
      <circle cx={x} cy={y} r={14} fill={`${SAVVY}18`} stroke={SAVVY} strokeWidth={1} opacity={0.55} />
      {/* Core — white hot */}
      <circle cx={x} cy={y} r={7} fill="white" opacity={0.92} filter="url(#orbGlow)" />
      {/* Sparkles — each at a fixed offset from orb centre */}
      {SPARKLES.map((s, i) => (
        <motion.circle
          key={i}
          cx={x + s.dx}
          cy={y + s.dy}
          r={s.r}
          fill={SAVVY}
          animate={{ opacity: [0.15, 0.9, 0.15], scale: [0.8, 1.4, 0.8] }}
          transition={{ duration: 2.2, delay: s.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </g>
  )
}

/* ─────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────── */

export default function Journey() {
  const sectionRef  = useRef<HTMLDivElement>(null)
  const svgPathRef  = useRef<SVGPathElement>(null)

  // Sample table — built after layout so the hidden <path> has a real length
  const [sampleTable, setSampleTable] = useState<PathPoint[]>([])
  const [totalLength,  setTotalLength] = useState(0)

  useLayoutEffect(() => {
    const el = svgPathRef.current
    if (!el) return
    setSampleTable(buildSampleTable(el, 400))
    setTotalLength(el.getTotalLength())
  }, [])

  // Orb position — plain state updated imperatively (no React re-render per px;
  // the orb re-renders only when the state object reference changes, which is
  // every scroll tick — acceptable because the SVG subtree is very small).
  const [orbPos, setOrbPos] = useState<PathPoint>({ x: NODE_X, y: 60 })

  // Reached stage index — drives card illumination
  const [reachedIdx, setReachedIdx] = useState<number>(() =>
    JOURNEY.reduce((acc, s, i) => (s.status !== 'locked' ? i : acc), 0)
  )

  // Scroll progress of the full section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  // Update orb + reached stage on every scroll tick
  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    if (sampleTable.length > 0) {
      setOrbPos(sampleAt(sampleTable, latest))
    }
    let idx = 0
    for (let i = 0; i < STAGE_COUNT; i++) {
      if (latest >= stageThreshold(i) - 0.01) idx = i
    }
    setReachedIdx(idx)
  })

  // Stroke-dashoffset: drives the green "revealed" overlay path
  const dashOffset = useTransform(scrollYProgress, [0, 1], [totalLength, 0])

  // Scroll hint opacity (fade out after first scroll)
  const hintOpacity = useTransform(scrollYProgress, [0, 0.06], [1, 0])

  // Progress bar scale (RTL: right-to-left fill via scaleX from right)
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
    <div className="ambient grain min-h-screen relative overflow-x-hidden">

      {/* ── HEADER ──────────────────────────────────────── */}
      <div
        className="sticky top-0 z-30 px-6 pt-8 pb-4 grid-faint"
        style={{ background: 'linear-gradient(180deg, #05060cee 82%, transparent)' }}
      >
        <SectionTitle
          kicker="THE PATH OF KNOWLEDGE™"
          title="رحلة المعرفة"
          subtitle="من مبتدئ إلى بطل سيبراني معتمد — اتبع الضوء واكتشف طريقك"
        />

        {/* Progress bar */}
        <div className="mt-3 flex items-center gap-3">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/8">
            <motion.div
              className="h-full rounded-full"
              style={{
                background: `linear-gradient(90deg, ${SAVVY}, ${CYBER})`,
                boxShadow: `0 0 12px ${SAVVY}88`,
                scaleX: barScaleX,
                transformOrigin: 'right',
              }}
            />
          </div>
          <span className="mono-caption text-savvy-400">
            {ar(reachedIdx + 1)}/{ar(STAGE_COUNT)}
          </span>
        </div>

        {/* Scroll hint */}
        <motion.div
          className="flex flex-col items-center gap-1 mt-3 text-white/35"
          style={{ opacity: hintOpacity }}
        >
          <span className="text-xs">مرّر للأسفل لإضاءة الطريق</span>
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ChevronDown className="h-4 w-4" />
          </motion.div>
        </motion.div>
      </div>

      {/* ── JOURNEY SECTION ─────────────────────────────── */}
      {/*
        The container has an explicit pixel height (SVG_H) so the window
        scroll drives the section progress from 0 → 1 over that distance.
        The SVG fills the container with preserveAspectRatio="xMidYMin meet"
        so all viewBox coords map 1:1 to our node positions.
      */}
      <div
        ref={sectionRef}
        className="relative mx-auto"
        style={{ maxWidth: 900, height: SVG_H }}
      >

        {/* ── SVG LAYER ─── */}
        <svg
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          preserveAspectRatio="xMidYMin meet"
          className="absolute inset-0 h-full w-full pointer-events-none"
          aria-hidden="true"
        >
          <defs>
            <filter id="orbGlow" x="-300%" y="-300%" width="700%" height="700%">
              <feGaussianBlur stdDeviation="5" result="glow" />
              <feMerge><feMergeNode in="glow" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>

            <filter id="pathGlow" x="-20%" y="-5%" width="140%" height="110%">
              <feGaussianBlur stdDeviation="3.5" result="glow" />
              <feMerge><feMergeNode in="glow" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>

            <filter id="goldGlow" x="-300%" y="-300%" width="700%" height="700%">
              <feGaussianBlur stdDeviation="7" result="glow" />
              <feMerge><feMergeNode in="glow" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>

            <radialGradient id="certGrad"   cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#ffe39a" /><stop offset="100%" stopColor={GOLD} />
            </radialGradient>
            <radialGradient id="activeGrad" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#6bb8ff" /><stop offset="100%" stopColor={CYBER} />
            </radialGradient>
            <radialGradient id="doneGrad"   cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#8bffcd" /><stop offset="100%" stopColor={SAVVY} />
            </radialGradient>
          </defs>

          {/* Base path — dim blue */}
          <path
            d={PATH_D}
            fill="none"
            stroke={CYBER}
            strokeWidth={2.5}
            strokeOpacity={0.16}
            strokeLinecap="round"
          />

          {/* Active overlay path — savvy green, scroll-revealed */}
          {totalLength > 0 && (
            <motion.path
              d={PATH_D}
              fill="none"
              stroke={SAVVY}
              strokeWidth={3}
              strokeLinecap="round"
              strokeDasharray={totalLength}
              style={{ strokeDashoffset: dashOffset }}
              filter="url(#pathGlow)"
            />
          )}

          {/* Hidden path used for getTotalLength + getPointAtLength sampling */}
          <path ref={svgPathRef} d={PATH_D} fill="none" stroke="none" strokeWidth={0} />

          {/* Node dots */}
          {JOURNEY.map((stage, i) => {
            const cx = NODE_X
            const cy = nodeY(i)
            const isCert   = stage.code === 'CERT'
            const isReached = i <= reachedIdx || stage.status === 'done'

            const fill =
              isCert && isReached    ? 'url(#certGrad)'   :
              stage.status === 'done' ? 'url(#doneGrad)'   :
              isReached               ? 'url(#activeGrad)' :
              NODE_FILL[stage.status]

            const stroke =
              isCert && isReached ? GOLD : NODE_STROKE[stage.status]

            const r = isCert ? 18 : stage.status === 'active' ? 13 : 11

            return (
              <g key={stage.id}>
                {/* Pulse ring for reached non-cert nodes */}
                {isReached && !isCert && (
                  <motion.circle
                    cx={cx} cy={cy}
                    r={r + 8}
                    fill="none"
                    stroke={stage.status === 'done' ? SAVVY : CYBER}
                    strokeWidth={1}
                    animate={{ r: [r + 6, r + 17, r + 6], opacity: [0.45, 0, 0.45] }}
                    transition={{ duration: 2.6, repeat: Infinity, ease: 'easeOut' }}
                  />
                )}

                {/* Gold halo for cert node */}
                {isCert && (
                  <motion.circle
                    cx={cx} cy={cy}
                    r={32}
                    fill="none"
                    stroke={GOLD}
                    strokeWidth={1.5}
                    animate={{ opacity: [0.12, 0.42, 0.12], r: [28, 38, 28] }}
                    transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
                  />
                )}

                {/* Main node */}
                <motion.circle
                  cx={cx} cy={cy}
                  r={r}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={isReached ? 2 : 1}
                  animate={{ scale: isReached ? [1, 1.07, 1] : 1 }}
                  transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
                  filter={isCert && isReached ? 'url(#goldGlow)' : undefined}
                />

                {/* Stage number inside node */}
                <text
                  x={cx} y={cy + 1}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="9"
                  fontFamily="JetBrains Mono, monospace"
                  fontWeight="700"
                  fill={
                    (isCert || stage.status === 'done') ? '#05060c' :
                    isReached ? '#ffffff' :
                    '#ffffff44'
                  }
                >
                  {ar(i + 1)}
                </text>
              </g>
            )
          })}

          {/* Energy Orb — only rendered once sample table is ready */}
          {sampleTable.length > 0 && (
            <EnergyOrb x={orbPos.x} y={orbPos.y} />
          )}
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

      {/* ── CERT FLOURISH (shown when scroll reaches stage 9) ── */}
      <motion.div
        className="relative mx-auto max-w-lg px-6 pb-20 text-center"
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: isCertReached ? 1 : 0, y: isCertReached ? 0 : 28 }}
        transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] as const }}
      >
        <div
          className="glass rounded-3xl p-8"
          style={{
            borderColor: `${GOLD}44`,
            boxShadow: `0 0 60px -10px ${GOLD}55`,
          }}
        >
          <motion.div
            className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl"
            style={{ background: `${GOLD}18`, border: `2px solid ${GOLD}44` }}
            animate={{ rotate: [0, -4, 4, 0], scale: [1, 1.05, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Zap className="h-8 w-8" style={{ color: GOLD }} />
          </motion.div>

          <h3 className="text-xl font-bold text-grad-gold mb-2">وجهتك النهائية</h3>
          <p className="text-sm text-white/60 mb-6 leading-relaxed">
            أتممت رحلة المعرفة وأصبحت بطلاً سيبرانياً معتمداً من CyberXi Savvy
          </p>

          <Link
            to="/certificate"
            className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold transition-all duration-300 hover:scale-105 hover:shadow-glow-gold"
            style={{
              background: `linear-gradient(135deg, ${GOLD}ee 0%, #e0a92e 100%)`,
              color: '#05060c',
              boxShadow: `0 0 24px ${GOLD}55`,
            }}
          >
            <Award className="h-4 w-4" />
            اعرض شهادتك الآن
          </Link>
        </div>
      </motion.div>

    </div>
  )
}
