import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  Flame,
  Lock,
  Medal,
  Trophy,
  Zap,
} from 'lucide-react'
import {
  GlassCard,
  SectionTitle,
  ScoreRing,
  ProgressBar,
  StatTile,
  accentHex,
} from '../components/ui'
import { SavvySays } from '../components/MrSavvy'
import { ar } from '../lib/cn'
import {
  USER,
  SCORES,
  OVERALL_SCORE,
  CERT_STATS,
  BADGES,
  LEADERBOARD,
} from '../data'

// ─── animation variants ──────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.52, delay: i * 0.09, ease: [0.16, 1, 0.3, 1] as const },
  }),
}

// ─── static accent class maps (no dynamic Tailwind strings) ──────────────────
const RANK_MEDALS: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' }

const certOverall = Math.round(
  CERT_STATS.reduce((acc, s) => acc + s.done / s.total, 0) / CERT_STATS.length * 100
)

// ─── component ───────────────────────────────────────────────────────────────
export default function Dashboard() {
  return (
    <div className="space-y-6">

      {/* ── 1. Welcome Hero ─────────────────────────────────────────────── */}
      <motion.div custom={0} variants={fadeUp} initial="hidden" animate="show">
        <GlassCard
          glow="cyber"
          className="relative overflow-hidden p-6 md:p-8"
        >
          {/* ambient orbs */}
          <div
            className="pointer-events-none absolute -top-20 -left-20 h-72 w-72 rounded-full blur-3xl"
            style={{ background: 'radial-gradient(circle, rgba(31,143,255,0.18), transparent 70%)' }}
          />
          <div
            className="pointer-events-none absolute -bottom-16 left-48 h-56 w-56 rounded-full blur-3xl"
            style={{ background: 'radial-gradient(circle, rgba(124,92,255,0.13), transparent 70%)' }}
          />

          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

            {/* left: text + CTA */}
            <div className="flex-1 min-w-0 space-y-5">

              {/* streak pill */}
              <div
                className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 mono-caption"
                style={{
                  color: accentHex('savvy'),
                  background: `${accentHex('savvy')}18`,
                  border: `1px solid ${accentHex('savvy')}30`,
                }}
              >
                <Flame className="h-3.5 w-3.5" />
                {ar(USER.streakDays)} يوم متواصل · المستوى {ar(USER.level)} — {USER.levelTitle}
              </div>

              <div>
                <h1 className="font-display text-3xl font-bold leading-snug text-white md:text-4xl">
                  أهلاً بعودتك،{' '}
                  <span className="text-grad-cyber">{USER.name}</span>{' '}
                  👋
                </h1>
                <p className="mt-1.5 text-sm text-white/55">{USER.role}</p>
                <p className="mt-3 text-base text-white/75 leading-relaxed">
                  أنت قريب من الشهادة — ركّز على الوحدتين المتبقّيتين وستُكمل المسار قبل نهاية الأسبوع.
                </p>
              </div>

              {/* next lesson CTA */}
              <Link
                to="/journey"
                className="inline-flex items-center gap-3 rounded-xl px-5 py-3 font-semibold text-ink-950 transition-all duration-200 hover:brightness-110 hover:shadow-glow-cyber active:scale-95"
                style={{ background: `linear-gradient(135deg, ${accentHex('cyber')}, #4fa8ff)` }}
              >
                <Zap className="h-4 w-4 shrink-0" />
                تابع: التصيّد النصّي والصوتي
                <ArrowLeft className="h-4 w-4 shrink-0 flip-rtl" />
              </Link>

              {/* Mr. Savvy bubble */}
              <SavvySays size={48}>
                جاهزيّتك للشهادة{' '}
                <span className="font-bold" style={{ color: accentHex('gold') }}>
                  {ar(USER.certReadiness)}٪
                </span>{' '}
                — إنجاز رائع! أكمل وحدة التصيّد النصّي وستقفز فوق ٩٠٪.
              </SavvySays>
            </div>

            {/* right: cert readiness ring */}
            <div className="flex shrink-0 flex-col items-center gap-3 lg:pr-4">
              <ScoreRing
                value={USER.certReadiness}
                accent="gold"
                size={148}
                stroke={11}
                label="جاهزية الشهادة"
              />
              <Link
                to="/certificate"
                className="mono-caption transition-colors hover:opacity-80"
                style={{ color: accentHex('gold') }}
              >
                اعرض الشهادة ←
              </Link>
            </div>

          </div>
        </GlassCard>
      </motion.div>

      {/* ── 2. Awareness Scores ─────────────────────────────────────────── */}
      <motion.div custom={1} variants={fadeUp} initial="hidden" animate="show">
        <GlassCard className="p-6 md:p-8">
          <SectionTitle
            kicker="SECURITY AWARENESS SCORE"
            title="درجات الوعي السيبراني"
            subtitle="تُحسَب من التعلّم والاختبارات والمحاكاة"
          />

          {/* rings row — large overall + 5 sub-scores */}
          <div className="flex flex-wrap items-end justify-center gap-6 md:justify-start">

            {/* overall — larger */}
            <div className="flex flex-col items-center gap-2">
              <div
                className="rounded-2xl p-1.5"
                style={{
                  background: `${accentHex('cyber')}12`,
                  border: `1px solid ${accentHex('cyber')}28`,
                  boxShadow: `0 0 28px -6px ${accentHex('cyber')}50`,
                }}
              >
                <ScoreRing
                  value={OVERALL_SCORE}
                  accent="cyber"
                  size={132}
                  stroke={11}
                />
              </div>
              <span className="text-xs font-semibold text-white/80">درجة CyberXi Savvy</span>
            </div>

            {/* divider */}
            <div
              className="hidden h-28 w-px self-center md:block"
              style={{ background: 'rgba(255,255,255,0.08)' }}
            />

            {/* sub-scores */}
            {SCORES.map((s) => (
              <div key={s.key} className="flex flex-col items-center gap-2">
                <ScoreRing
                  value={s.value}
                  accent={s.color}
                  size={92}
                  stroke={8}
                />
                <span className="text-[11px] text-white/55 text-center max-w-[88px] leading-tight">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </GlassCard>
      </motion.div>

      {/* ── 3. Certificate Readiness ─────────────────────────────────────── */}
      <motion.div custom={2} variants={fadeUp} initial="hidden" animate="show">
        <GlassCard
          glow="gold"
          className="p-6 md:p-8"
        >
          <SectionTitle
            kicker="CERTIFICATION PROGRESS"
            title="جاهزية الشهادة"
            subtitle="هدفك: شهادة CyberXi Savvy AI Service"
            action={
              <span
                className="mono-caption"
                style={{ color: accentHex('gold') }}
              >
                {ar(certOverall)}٪ مكتمل
              </span>
            }
          />

          {/* overall bar */}
          <div className="mb-6 space-y-2">
            <ProgressBar value={certOverall} accent="gold" />
            <p className="text-xs text-white/40">
              هدفك: شهادة{' '}
              <span style={{ color: accentHex('gold') }}>CyberXi Savvy AI Service</span>
            </p>
          </div>

          {/* 4 stat tiles */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {CERT_STATS.map((stat, i) => {
              const pct = Math.round((stat.done / stat.total) * 100)
              const accent = i % 2 === 0 ? 'gold' : 'savvy' as const
              return (
                <div key={stat.label} className="space-y-2">
                  <StatTile
                    icon={stat.icon}
                    label={stat.label}
                    value={`${ar(stat.done)} / ${ar(stat.total)}`}
                    sub={`${ar(pct)}٪ مكتمل`}
                    accent={accent}
                  />
                  <ProgressBar value={pct} accent={accent} />
                </div>
              )
            })}
          </div>
        </GlassCard>
      </motion.div>

      {/* ── 4. Two-column: Badges + Leaderboard ─────────────────────────── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

        {/* Badges */}
        <motion.div custom={3} variants={fadeUp} initial="hidden" animate="show">
          <GlassCard className="h-full p-6">
            <SectionTitle
              kicker="ACHIEVEMENTS"
              title="الشارات"
              subtitle={`${ar(BADGES.filter(b => b.earned).length)} من ${ar(BADGES.length)} مكتسبة`}
            />

            <div className="grid grid-cols-3 gap-4 sm:grid-cols-5 lg:grid-cols-3 xl:grid-cols-5">
              {BADGES.map((badge) => {
                const col = accentHex(badge.color)
                return (
                  <motion.div
                    key={badge.id}
                    whileHover={badge.earned ? { scale: 1.06 } : {}}
                    className="flex flex-col items-center gap-2"
                  >
                    <div
                      className="relative flex h-16 w-16 items-center justify-center rounded-2xl transition-all duration-300"
                      style={
                        badge.earned
                          ? {
                              background: `${col}18`,
                              border: `1px solid ${col}40`,
                              boxShadow: `0 0 20px -4px ${col}60`,
                            }
                          : {
                              background: 'rgba(255,255,255,0.04)',
                              border: '1px solid rgba(255,255,255,0.08)',
                              filter: 'grayscale(1)',
                              opacity: 0.45,
                            }
                      }
                    >
                      <badge.icon
                        className="h-7 w-7"
                        style={{ color: badge.earned ? col : 'rgba(255,255,255,0.3)' }}
                      />
                      {!badge.earned && (
                        <span className="absolute -bottom-1.5 -left-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-ink-800 border border-white/10">
                          <Lock className="h-2.5 w-2.5 text-white/40" />
                        </span>
                      )}
                    </div>
                    <span
                      className="text-center text-[10px] leading-tight"
                      style={{ color: badge.earned ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.3)' }}
                    >
                      {badge.name}
                    </span>
                  </motion.div>
                )
              })}
            </div>
          </GlassCard>
        </motion.div>

        {/* Leaderboard */}
        <motion.div custom={4} variants={fadeUp} initial="hidden" animate="show">
          <GlassCard className="h-full p-6">
            <SectionTitle
              kicker="LEADERBOARD"
              title="المتصدّرون"
              action={
                <div className="flex items-center gap-1.5" style={{ color: accentHex('cyber') }}>
                  <Trophy className="h-4 w-4" />
                  <span className="mono-caption">هذا الشهر</span>
                </div>
              }
            />

            <ul className="space-y-2">
              {LEADERBOARD.map((row) => {
                const isMe = !!row.me
                const medal = RANK_MEDALS[row.rank]
                return (
                  <li
                    key={row.rank}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200"
                    style={
                      isMe
                        ? {
                            background: `${accentHex('savvy')}12`,
                            border: `1px solid ${accentHex('savvy')}35`,
                            boxShadow: `0 0 18px -6px ${accentHex('savvy')}50`,
                          }
                        : {
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.07)',
                          }
                    }
                  >
                    {/* rank */}
                    <span className="w-7 shrink-0 text-center text-lg leading-none">
                      {medal ?? (
                        <span className="mono-caption text-white/35">{ar(row.rank)}</span>
                      )}
                    </span>

                    {/* avatar initial */}
                    <div
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                      style={
                        isMe
                          ? { background: accentHex('savvy'), color: '#05060c' }
                          : { background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)' }
                      }
                    >
                      {row.name.charAt(0)}
                    </div>

                    {/* name + dept */}
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-sm font-semibold truncate"
                        style={{ color: isMe ? accentHex('savvy') : 'rgba(255,255,255,0.9)' }}
                      >
                        {row.name}
                        {isMe && (
                          <span
                            className="mr-2 mono-caption"
                            style={{ color: accentHex('savvy'), opacity: 0.7 }}
                          >
                            أنت
                          </span>
                        )}
                      </p>
                      <p className="text-[11px] text-white/40 truncate">{row.dept}</p>
                    </div>

                    {/* xp */}
                    <div className="flex shrink-0 items-center gap-1">
                      <Zap
                        className="h-3.5 w-3.5"
                        style={{ color: isMe ? accentHex('savvy') : accentHex('cyber') }}
                      />
                      <span
                        className="mono-caption tabular-nums"
                        style={{ color: isMe ? accentHex('savvy') : accentHex('cyber') }}
                      >
                        {ar(row.xp)}
                      </span>
                      <Medal
                        className="h-3 w-3 text-white/25"
                      />
                    </div>
                  </li>
                )
              })}
            </ul>
          </GlassCard>
        </motion.div>

      </div>
    </div>
  )
}
