import { motion } from 'framer-motion'
import {
  CheckCircle2, Circle, BadgeCheck, Download, Share2, Eye,
  Shield, Award, Flame,
} from 'lucide-react'
import { GlassCard, SectionTitle, Pill, ProgressBar, ScoreRing } from '../components/ui'
import { MrSavvy, SavvySays } from '../components/MrSavvy'
import { cn, ar } from '../lib/cn'
import { CERTIFICATE, USER, CERT_STATS } from '../data'

// ─── Requirement checklist derived from CERT_STATS + USER ────────────────────
interface Requirement {
  label: string
  done: boolean
}

function buildRequirements(): Requirement[] {
  // CERT_STATS drives dynamic done/pending; final two always pending (score < 100%)
  const [modules, videos, quizzes, challenges] = CERT_STATS
  return [
    { label: 'إكمال الدورات المطلوبة', done: modules.done >= Math.ceil(modules.total * 0.8) },
    { label: 'مشاهدة المحتوى', done: videos.done >= Math.ceil(videos.total * 0.8) },
    { label: 'اجتياز الاختبارات', done: quizzes.done >= Math.ceil(quizzes.total * 0.75) },
    { label: 'تحدّي التصيّد', done: challenges.done >= 3 },
    { label: 'تحدّي أمان الذكاء الاصطناعي', done: challenges.done >= 5 },
    { label: 'وحدة الخصوصية', done: false },
    { label: 'الاختبار النهائي', done: false },
    { label: 'قبول سياسة الذكاء الاصطناعي', done: USER.certReadiness >= 80 },
  ]
}

// ─── Faux QR grid (CSS/SVG, not a real QR) ───────────────────────────────────
function FauxQR({ size = 72 }: { size?: number }) {
  // Static deterministic pattern — a 7×7 grid with finder-pattern corners + random fill
  const cells: boolean[] = [
    1,1,1,1,1,1,1,
    1,0,0,0,0,0,1,
    1,0,1,0,1,0,1,
    1,0,0,1,0,0,1,
    1,0,1,1,1,0,1,
    1,0,0,0,0,0,1,
    1,1,1,1,1,1,1,
  ].map(Boolean)

  const inner: boolean[] = [
    0,1,1,0,1,0,1,0,0,1,0,1,0,1,
    1,0,0,1,0,1,0,1,0,0,1,0,1,0,
    0,1,0,0,1,0,1,0,1,1,0,1,0,1,
    1,0,1,1,0,1,0,0,1,0,0,0,1,0,
    0,1,0,0,1,0,1,1,0,1,1,1,0,1,
    1,1,1,0,0,1,0,0,1,0,0,0,1,1,
    0,0,1,1,1,0,1,1,0,1,0,1,0,0,
    1,1,0,0,0,1,0,0,1,1,1,0,1,1,
    0,0,1,0,1,0,1,0,0,0,0,1,0,0,
    1,0,0,1,0,1,0,1,1,0,1,0,1,0,
    0,1,1,0,1,0,0,0,0,1,0,1,0,1,
    1,0,0,1,0,1,1,1,0,0,1,0,1,0,
    0,1,0,0,1,0,0,0,1,1,0,1,0,1,
    1,0,1,1,0,1,1,0,0,0,1,0,1,0,
  ].map(Boolean)

  const COLS = 7
  const INNER_COLS = 14

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* 7×7 finder corners — top-left */}
      {cells.map((on, i) => {
        const col = i % COLS
        const row = Math.floor(i / COLS)
        const s = size / 21
        return (
          <rect
            key={`c${i}`}
            x={col * s} y={row * s} width={s - 0.5} height={s - 0.5}
            fill={on ? '#f5c451' : 'transparent'}
            opacity={on ? 0.9 : 0}
          />
        )
      })}
      {/* inner data cells */}
      {inner.map((on, i) => {
        const col = i % INNER_COLS
        const row = Math.floor(i / INNER_COLS)
        const s = size / 21
        const ox = 8 * s
        const oy = 8 * s
        return (
          <rect
            key={`d${i}`}
            x={ox + col * s} y={oy + row * s} width={s - 0.5} height={s - 0.5}
            fill={on ? '#f5c451' : 'transparent'}
            opacity={on ? 0.75 : 0}
          />
        )
      })}
      {/* bottom-left finder */}
      {cells.map((on, i) => {
        const col = i % COLS
        const row = Math.floor(i / COLS)
        const s = size / 21
        return (
          <rect
            key={`bl${i}`}
            x={col * s} y={(14 + row) * s} width={s - 0.5} height={s - 0.5}
            fill={on ? '#f5c451' : 'transparent'}
            opacity={on ? 0.9 : 0}
          />
        )
      })}
    </svg>
  )
}

// ─── Riyadh skyline line-art (faint inline SVG) ───────────────────────────────
function RiyadhSkyline() {
  return (
    <svg
      className="absolute bottom-0 left-0 right-0 w-full opacity-[0.045] pointer-events-none"
      viewBox="0 0 900 160" preserveAspectRatio="xMidYMax meet"
      fill="none"
    >
      {/* Kingdom Tower */}
      <path d="M440 160 L440 40 L448 40 L452 20 L456 40 L464 40 L464 160Z" fill="#f5c451" />
      {/* Sky bridge cutout */}
      <rect x="441" y="55" width="22" height="10" fill="#f5c451" />
      <rect x="444" y="45" width="16" height="14" fill="#05060c" />
      {/* Al Faisaliyah Tower */}
      <path d="M530 160 L530 60 L538 60 L545 45 L552 60 L560 60 L560 160Z" fill="#f5c451" />
      <polygon points="545,35 540,55 550,55" fill="#f5c451" />
      {/* Generic towers */}
      <rect x="320" y="90" width="30" height="70" fill="#f5c451" />
      <rect x="360" y="110" width="22" height="50" fill="#f5c451" />
      <rect x="390" y="100" width="28" height="60" fill="#f5c451" />
      <rect x="580" y="95" width="35" height="65" fill="#f5c451" />
      <rect x="625" y="105" width="25" height="55" fill="#f5c451" />
      <rect x="660" y="115" width="20" height="45" fill="#f5c451" />
      <rect x="690" y="90" width="30" height="70" fill="#f5c451" />
      <rect x="730" y="118" width="18" height="42" fill="#f5c451" />
      <rect x="758" y="100" width="28" height="60" fill="#f5c451" />
      <rect x="800" y="110" width="22" height="50" fill="#f5c451" />
      <rect x="830" y="125" width="16" height="35" fill="#f5c451" />
      <rect x="200" y="100" width="32" height="60" fill="#f5c451" />
      <rect x="240" y="115" width="20" height="45" fill="#f5c451" />
      <rect x="270" y="105" width="26" height="55" fill="#f5c451" />
      <rect x="140" y="118" width="18" height="42" fill="#f5c451" />
      <rect x="100" y="125" width="22" height="35" fill="#f5c451" />
      <rect x="60" y="110" width="28" height="50" fill="#f5c451" />
    </svg>
  )
}

// ─── Guilloché corner ornament ────────────────────────────────────────────────
function GuillocheCorner({ className }: { className?: string }) {
  return (
    <svg
      className={cn('absolute opacity-30 pointer-events-none', className)}
      width="80" height="80" viewBox="0 0 80 80"
    >
      <defs>
        <radialGradient id="gc" cx="0%" cy="0%" r="100%">
          <stop offset="0%" stopColor="#ffe39a" />
          <stop offset="100%" stopColor="#e0a92e" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="0" cy="0" r="76" fill="none" stroke="url(#gc)" strokeWidth="0.8" />
      <circle cx="0" cy="0" r="64" fill="none" stroke="url(#gc)" strokeWidth="0.6" />
      <circle cx="0" cy="0" r="52" fill="none" stroke="url(#gc)" strokeWidth="0.5" />
      <circle cx="0" cy="0" r="40" fill="none" stroke="url(#gc)" strokeWidth="0.5" />
      <circle cx="0" cy="0" r="28" fill="none" stroke="url(#gc)" strokeWidth="0.4" />
      <path d="M0,0 L80,0 M0,0 L0,80 M0,0 L56,56 M0,0 L72,24 M0,0 L24,72" stroke="url(#gc)" strokeWidth="0.4" />
    </svg>
  )
}

// ─── Format date to Arabic ────────────────────────────────────────────────────
function formatDateAr(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' })
}

// ─── Main screen ──────────────────────────────────────────────────────────────
export default function Certificate() {
  const requirements = buildRequirements()
  const doneCount = requirements.filter(r => r.done).length
  const totalCount = requirements.length

  return (
    <div className="space-y-8 pb-10" dir="rtl">
      {/* Page header */}
      <SectionTitle
        kicker="CERT · CXS-2026"
        title="الشهادات والاعتماد"
        subtitle="مسار اعتماد CyberXi Savvy الرسمي — تتبّع متطلباتك وأَطلق شهادتك"
      />

      {/* ── PART 1: Certification System ──────────────────────────────────── */}
      <GlassCard className="p-6" glow="gold">
        {/* Header row */}
        <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
          <div>
            <p className="mono-caption text-gold-400 mb-1">متطلبات الاعتماد</p>
            <h3 className="text-lg font-bold text-white">
              شهادة خدمة الذكاء الاصطناعي من CyberXi Savvy
            </h3>
            <p className="text-sm text-white/50 mt-1">
              {ar(doneCount)} من {ar(totalCount)} متطلبات مكتملة
            </p>
          </div>
          {/* Pills: passing score + validity */}
          <div className="flex flex-wrap gap-2 items-center">
            <Pill accent="gold">
              <Award className="h-3 w-3" />
              درجة النجاح ٨٠٪
            </Pill>
            <Pill accent="cyber">
              <Shield className="h-3 w-3" />
              صلاحية ١٢ شهراً
            </Pill>
          </div>
        </div>

        {/* Readiness progress */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-white/70">مستوى الاستعداد للشهادة</span>
            <span className="mono-caption text-gold-400">{ar(USER.certReadiness)}٪</span>
          </div>
          <ProgressBar value={USER.certReadiness} accent="gold" />
        </div>

        {/* Checklist grid */}
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {requirements.map((req) => (
            <li
              key={req.label}
              className={cn(
                'flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200',
                req.done
                  ? 'bg-savvy-500/10 border border-savvy-500/20'
                  : 'bg-white/4 border border-white/8',
              )}
            >
              {req.done ? (
                <CheckCircle2 className="h-5 w-5 shrink-0 text-savvy-400" />
              ) : (
                <Circle className="h-5 w-5 shrink-0 text-white/25" />
              )}
              <span className={cn(
                'text-sm font-medium',
                req.done ? 'text-white/90' : 'text-white/45',
              )}>
                {req.label}
              </span>
              {req.done && (
                <span className="mr-auto mono-caption text-savvy-500">مكتمل</span>
              )}
            </li>
          ))}
        </ul>
      </GlassCard>

      {/* ── PART 2: Certificate Preview ──────────────────────────────────── */}
      <div>
        <p className="mono-caption text-gold-400 mb-4">معاينة الشهادة</p>

        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as const, delay: 0.1 }}
        >
          {/* Certificate card — landscape, gold + blue, glassmorphism */}
          <div
            className="relative overflow-hidden rounded-3xl shadow-glow-gold"
            style={{
              background: 'linear-gradient(135deg, rgba(14,18,38,0.97) 0%, rgba(8,12,28,0.98) 55%, rgba(16,20,44,0.96) 100%)',
              border: '1px solid rgba(245,196,81,0.25)',
              minHeight: '420px',
            }}
          >
            {/* Riyadh skyline faint background */}
            <RiyadhSkyline />

            {/* Guilloché corners */}
            <GuillocheCorner className="top-0 right-0" />
            <GuillocheCorner className="bottom-0 left-0 rotate-180" />

            {/* Top gold border stripe */}
            <div
              className="absolute top-0 left-0 right-0 h-[3px]"
              style={{ background: 'linear-gradient(90deg, transparent, #f5c451 30%, #ffe39a 50%, #f5c451 70%, transparent)' }}
            />
            {/* Bottom gold border stripe */}
            <div
              className="absolute bottom-0 left-0 right-0 h-[3px]"
              style={{ background: 'linear-gradient(90deg, transparent, #e0a92e 30%, #f5c451 50%, #e0a92e 70%, transparent)' }}
            />

            {/* ── Certificate content ── */}
            <div className="relative z-10 p-8 lg:p-10">

              {/* Header: branding + MrSavvy seal */}
              <div className="flex items-start justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                  <MrSavvy size={56} float={false} />
                  <div>
                    <p className="text-grad-gold font-bold text-lg leading-tight">CyberXi Savvy</p>
                    <p className="text-white/50 text-xs mt-0.5 mono-caption tracking-widest">CERTIFIED PROGRAM</p>
                  </div>
                </div>

                {/* Top-left: digital verification badge */}
                <div className="flex flex-col items-end gap-2">
                  <div
                    className="flex items-center gap-2 rounded-xl px-3 py-2"
                    style={{
                      background: 'rgba(0,229,138,0.08)',
                      border: '1px solid rgba(0,229,138,0.25)',
                    }}
                  >
                    <BadgeCheck className="h-4 w-4 text-savvy-400" />
                    <span className="mono-caption text-savvy-400">تحقّق رقمي</span>
                  </div>
                  <span className="mono-caption text-white/30">معتمد رقمياً</span>
                </div>
              </div>

              {/* Decorative divider */}
              <div
                className="mb-7 h-px"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(245,196,81,0.3) 40%, rgba(245,196,81,0.3) 60%, transparent)' }}
              />

              {/* Main body: two-column on wide screens */}
              <div className="flex flex-col lg:flex-row gap-8 items-start">

                {/* Left column: title block + holder + skills */}
                <div className="flex-1 min-w-0">
                  {/* "هذه الشهادة تُقرّ بأن" */}
                  <p className="text-white/45 text-sm mb-2">هذه الشهادة تُقرّ بأنّ</p>

                  {/* Holder name — the hero */}
                  <motion.h1
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.35, ease: [0.16, 1, 0.3, 1] as const }}
                    className="text-grad-gold font-bold mb-1"
                    style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', lineHeight: 1.15 }}
                  >
                    {CERTIFICATE.holder}
                  </motion.h1>
                  <p className="text-white/40 font-mono text-sm mb-5 tracking-wide">{CERTIFICATE.holderEn}</p>

                  {/* Certificate title */}
                  <div className="mb-5">
                    <p className="text-white/90 font-semibold text-base leading-snug">{CERTIFICATE.titleAr}</p>
                    <p className="text-white/40 text-xs mt-1 font-mono">{CERTIFICATE.title}</p>
                  </div>

                  {/* Skills pills */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {CERTIFICATE.skills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
                        style={{
                          color: '#f5c451',
                          background: 'rgba(245,196,81,0.1)',
                          border: '1px solid rgba(245,196,81,0.25)',
                        }}
                      >
                        <Flame className="h-3 w-3" />
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Date + serial row */}
                  <div className="flex flex-wrap gap-6 text-xs text-white/45">
                    <div>
                      <p className="mono-caption text-white/30 mb-0.5">تاريخ الإصدار</p>
                      <p className="text-white/70">{formatDateAr(CERTIFICATE.issue)}</p>
                    </div>
                    <div>
                      <p className="mono-caption text-white/30 mb-0.5">تاريخ الانتهاء</p>
                      <p className="text-white/70">{formatDateAr(CERTIFICATE.expiry)}</p>
                    </div>
                    <div>
                      <p className="mono-caption text-white/30 mb-0.5">الرقم التسلسلي</p>
                      <p
                        className="text-gold-400 font-mono tracking-wider"
                        style={{ fontFamily: 'JetBrains Mono, monospace' }}
                      >
                        {CERTIFICATE.serial}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right column: score ring + QR + signature */}
                <div className="flex flex-col items-center gap-6 shrink-0 lg:items-end">
                  {/* Gold score ring */}
                  <div className="flex flex-col items-center gap-2">
                    <ScoreRing
                      value={CERTIFICATE.score}
                      accent="gold"
                      size={110}
                      stroke={8}
                    />
                    <p className="mono-caption text-gold-400">الدرجة النهائية</p>
                  </div>

                  {/* QR + verification */}
                  <div
                    className="flex flex-col items-center gap-2 rounded-2xl p-3"
                    style={{
                      background: 'rgba(245,196,81,0.06)',
                      border: '1px solid rgba(245,196,81,0.18)',
                    }}
                  >
                    <FauxQR size={72} />
                    <p className="mono-caption text-gold-500 text-center">تحقّق من الشهادة</p>
                    <p className="text-white/30 text-[10px] font-mono text-center">verify.cyberxi.sa</p>
                  </div>

                  {/* Mr. Savvy signature line */}
                  <div className="flex flex-col items-center gap-1.5 pt-2">
                    <div
                      className="w-24 h-px"
                      style={{ background: 'rgba(245,196,81,0.35)' }}
                    />
                    <p className="text-white/40 text-[11px]">Mr. Savvy · AI Mentor</p>
                    <div className="flex items-center gap-1.5">
                      <BadgeCheck className="h-3.5 w-3.5 text-savvy-400" />
                      <span className="mono-caption text-savvy-400">Savvy Verified</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Side accent glow — gold */}
            <div
              className="absolute top-1/2 -translate-y-1/2 right-0 pointer-events-none"
              style={{
                width: '40%',
                height: '60%',
                background: 'radial-gradient(ellipse at right, rgba(245,196,81,0.06), transparent 70%)',
              }}
            />
          </div>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="flex flex-wrap gap-3 mt-5 justify-end"
        >
          <button
            className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: 'rgba(255,255,255,0.7)',
            }}
            type="button"
          >
            <Share2 className="h-4 w-4" />
            مشاركة الإنجاز
          </button>
          <button
            className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5"
            style={{
              background: 'rgba(245,196,81,0.1)',
              border: '1px solid rgba(245,196,81,0.3)',
              color: '#f5c451',
            }}
            type="button"
          >
            <Download className="h-4 w-4" />
            تحميل الشهادة
          </button>
          <button
            className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-glow-gold"
            style={{
              background: 'linear-gradient(135deg, #ffe39a 0%, #e0a92e 100%)',
              color: '#1a1200',
            }}
            type="button"
          >
            <Eye className="h-4 w-4" />
            عرض الشهادة
          </button>
        </motion.div>
      </div>

      {/* ── SavvySays celebration ─────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <SavvySays className="mt-2">
          <span className="font-bold text-grad-gold">مبروك!</span>{' '}
          أنت الآن <span className="text-savvy-400 font-semibold">CyberXi Savvy معتمد</span> 🛡️ — حقّقت درجة{' '}
          <span className="text-gold-400 font-bold">{ar(CERTIFICATE.score)}٪</span> وأتقنت{' '}
          {ar(CERTIFICATE.skills.length)} مجالات أمنية محورية. شهادتك صالحة لمدة ١٢ شهراً من تاريخ الإصدار.
        </SavvySays>
      </motion.div>
    </div>
  )
}
