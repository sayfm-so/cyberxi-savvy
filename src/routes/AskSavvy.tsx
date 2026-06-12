import { useState, useRef, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Send, Mic, Globe, Shield, Cpu, Fingerprint, Volume2 } from 'lucide-react'
import { MrSavvy } from '../components/MrSavvy'
import { cn } from '../lib/cn'
import { SAVVY_SUGGESTIONS, SAVVY_ANSWERS } from '../data'

// ─── Types ───────────────────────────────────────────────────────────────────

interface Message {
  id: string
  role: 'user' | 'savvy'
  text: string
  ts: number
}

type LangHint = 'ar' | 'en'

// ─── Constants ───────────────────────────────────────────────────────────────

const WELCOME: Message = {
  id: 'welcome',
  role: 'savvy',
  text: 'مرحباً! أنا مستر ساڤي، مساعدك للأمن السيبراني. اسألني عن التصيّد، حماية البيانات، PDPL، أو أي موضوع أمني. جاهز لمساعدتك!',
  ts: Date.now(),
}

const FALLBACK_TIPS = [
  'تذكّر: لا تشارك كلمة مرورك أو رمز التحقق OTP مع أحد — حتى لو ادّعى أنه من البنك أو الدعم الفني.',
  'نصيحة: فعّل المصادقة الثنائية 2FA على جميع حساباتك المهمة لحماية إضافية.',
  'اعلم أن ٩٥٪ من الاختراقات تبدأ بخطأ بشري — الوعي هو أقوى سلاح دفاعي.',
  'قبل الضغط على أي رابط، تحقّق من النطاق بعناية — حرف واحد مختلف قد يكون فخّاً.',
]

const FEATURE_BADGES = [
  { icon: Globe, label: 'العربية · English' },
  { icon: Volume2, label: 'دعم صوتي' },
  { icon: Cpu, label: 'توصيات مخصّصة' },
  { icon: Fingerprint, label: 'خصوصية تامة' },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

let _idCounter = 0
function uid() {
  _idCounter += 1
  return `msg-${Date.now()}-${_idCounter}`
}

function getFallback() {
  const tip = FALLBACK_TIPS[Math.floor(Math.random() * FALLBACK_TIPS.length)]
  return `${tip}\n\nجرّب أحد الأسئلة المقترحة للحصول على إجابة مفصّلة.`
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function TypingDots() {
  return (
    <div className="flex items-center gap-1.5 py-1 px-0.5">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="block h-2 w-2 rounded-full bg-cyber-400"
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.1, 0.8] }}
          transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.18, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}

function UserBubble({ text }: { text: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -24, scale: 0.96 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] as const }}
      className="flex justify-start"
    >
      <div
        className="max-w-[78%] rounded-2xl rounded-br-sm px-4 py-3 text-sm leading-relaxed text-white"
        style={{
          background: 'linear-gradient(135deg, rgba(31,143,255,0.22), rgba(124,92,255,0.18))',
          border: '1px solid rgba(31,143,255,0.30)',
        }}
      >
        {text}
      </div>
    </motion.div>
  )
}

function SavvyBubble({ text, isTyping }: { text: string; isTyping?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 24, scale: 0.96 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] as const }}
      className="flex justify-end items-end gap-3"
    >
      <div
        className="max-w-[78%] rounded-2xl rounded-bl-sm px-4 py-3 text-sm leading-relaxed text-white/90 whitespace-pre-line"
        style={{
          background: 'linear-gradient(135deg, rgba(20,25,52,0.9), rgba(8,10,20,0.85))',
          border: '1px solid rgba(255,255,255,0.10)',
          backdropFilter: 'blur(20px)',
        }}
      >
        {isTyping ? <TypingDots /> : text}
      </div>
      <div className="shrink-0 mb-0.5">
        <MrSavvy size={36} float={false} />
      </div>
    </motion.div>
  )
}

// ─── Main screen ─────────────────────────────────────────────────────────────

export default function AskSavvy() {
  const [messages, setMessages] = useState<Message[]>([WELCOME])
  const [input, setInput] = useState('')
  const [langHint, setLangHint] = useState<LangHint>('ar')
  const [isTyping, setIsTyping] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll on new messages or typing state change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  function sendMessage(text: string) {
    const trimmed = text.trim()
    if (!trimmed || isTyping) return

    const userMsg: Message = { id: uid(), role: 'user', text: trimmed, ts: Date.now() }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    const delay = 800 + Math.random() * 600

    setTimeout(() => {
      const answer = SAVVY_ANSWERS[trimmed] ?? getFallback()
      const savvyMsg: Message = { id: uid(), role: 'savvy', text: answer, ts: Date.now() }
      setMessages((prev) => [...prev, savvyMsg])
      setIsTyping(false)
    }, delay)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    sendMessage(input)
  }

  function handleSuggestion(q: string) {
    if (isTyping) return
    inputRef.current?.focus()
    sendMessage(q)
  }

  return (
    <div
      dir="rtl"
      className="ambient grid-faint relative flex flex-col h-screen overflow-hidden"
    >
      {/* Subtle radial accent behind chat panel */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(60% 50% at 70% 30%, rgba(31,143,255,0.08), transparent 60%), radial-gradient(40% 40% at 20% 80%, rgba(0,229,138,0.07), transparent 60%)',
        }}
      />

      {/* ── Chat panel ── */}
      <div className="relative z-10 flex flex-col flex-1 max-w-3xl w-full mx-auto px-4 pt-6 pb-4 gap-4 min-h-0">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as const }}
          className="glass-strong rounded-2xl px-5 py-4 flex items-center gap-4 shrink-0 shadow-card"
        >
          <MrSavvy size={52} float />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-bold text-white leading-none">مستر ساڤي</h1>
              {/* Status dot */}
              <span className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-savvy-400 opacity-60" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-savvy-500" />
                </span>
                <span className="mono-caption text-savvy-400">متصل</span>
              </span>
            </div>
            <p className="text-xs text-white/50 mt-1.5 leading-snug">
              مساعدك للأمن السيبراني والذكاء الاصطناعي
            </p>
          </div>
          <div className="shrink-0 hidden sm:flex items-center gap-1.5">
            <Shield className="h-4 w-4 text-cyber-400" />
            <span className="mono-caption text-cyber-400">CyberXi Savvy</span>
          </div>
        </motion.div>

        {/* Messages area */}
        <div className="glass-strong rounded-2xl flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-4 shadow-card min-h-0">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <div key={msg.id}>
                {msg.role === 'user' ? (
                  <UserBubble text={msg.text} />
                ) : (
                  <SavvyBubble text={msg.text} />
                )}
              </div>
            ))}

            {isTyping && (
              <motion.div
                key="typing"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 24 }}
                transition={{ duration: 0.22 }}
                className="flex justify-end items-end gap-3"
              >
                <div
                  className="rounded-2xl rounded-bl-sm px-4 py-3"
                  style={{
                    background: 'linear-gradient(135deg, rgba(20,25,52,0.9), rgba(8,10,20,0.85))',
                    border: '1px solid rgba(255,255,255,0.10)',
                  }}
                >
                  <TypingDots />
                </div>
                <div className="shrink-0 mb-0.5">
                  <MrSavvy size={36} float={false} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={bottomRef} />
        </div>

        {/* Suggested questions chips */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.15 }}
          className="shrink-0 flex flex-wrap gap-2"
        >
          {SAVVY_SUGGESTIONS.map((s) => (
            <button
              key={s.q}
              onClick={() => handleSuggestion(s.q)}
              disabled={isTyping}
              className={cn(
                'glass rounded-full px-3.5 py-1.5 text-xs leading-snug transition-all duration-200',
                s.lang === 'en' ? 'font-mono tracking-wide' : '',
                isTyping
                  ? 'opacity-40 cursor-not-allowed'
                  : 'text-cyber-200 hover:text-white hover:shadow-glow-cyber hover:-translate-y-0.5 cursor-pointer',
              )}
              style={{ border: '1px solid rgba(31,143,255,0.22)' }}
            >
              {s.q}
            </button>
          ))}
        </motion.div>

        {/* Input bar */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.22 }}
          className="glass-strong rounded-2xl px-3 py-3 flex items-center gap-3 shrink-0 shadow-card"
        >
          {/* Lang hint toggle */}
          <button
            type="button"
            onClick={() => setLangHint((l) => (l === 'ar' ? 'en' : 'ar'))}
            className="shrink-0 h-9 w-9 rounded-xl grid place-items-center transition-all duration-200 hover:-translate-y-0.5"
            style={{
              background: 'rgba(31,143,255,0.10)',
              border: '1px solid rgba(31,143,255,0.22)',
              color: '#1f8fff',
            }}
            title="تبديل لغة الكتابة"
            aria-label="تبديل لغة الكتابة"
          >
            <span className="mono-caption" style={{ fontSize: '0.6rem' }}>
              {langHint === 'ar' ? 'AR' : 'EN'}
            </span>
          </button>

          {/* Text input */}
          <input
            ref={inputRef}
            type="text"
            dir={langHint === 'ar' ? 'rtl' : 'ltr'}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={langHint === 'ar' ? 'اكتب سؤالك هنا…' : 'Type your question here…'}
            disabled={isTyping}
            className={cn(
              'flex-1 bg-transparent text-sm text-white placeholder:text-white/30 outline-none min-w-0',
              isTyping && 'opacity-50',
            )}
            aria-label="رسالة للمساعد"
          />

          {/* Mic button — visual placeholder */}
          <button
            type="button"
            className="shrink-0 h-9 w-9 rounded-xl grid place-items-center transition-all duration-200 hover:-translate-y-0.5 opacity-60 hover:opacity-100 cursor-not-allowed"
            style={{
              background: 'rgba(0,229,138,0.08)',
              border: '1px solid rgba(0,229,138,0.18)',
              color: '#00e58a',
            }}
            title="الدعم الصوتي قادم قريباً"
            aria-label="الدعم الصوتي قادم قريباً"
            disabled
          >
            <Mic className="h-4 w-4" />
          </button>

          {/* Send button */}
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className={cn(
              'shrink-0 h-9 px-4 rounded-xl text-sm font-semibold text-white flex items-center gap-2 transition-all duration-200',
              input.trim() && !isTyping
                ? 'bg-cyber-grad hover:-translate-y-0.5 hover:shadow-glow-cyber'
                : 'opacity-40 cursor-not-allowed',
            )}
            style={{ background: input.trim() && !isTyping ? undefined : 'rgba(31,143,255,0.15)' }}
            aria-label="إرسال"
          >
            <Send className="h-4 w-4 flip-rtl" />
            <span className="hidden sm:inline">إرسال</span>
          </button>
        </motion.form>

        {/* Feature badges row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.35 }}
          className="shrink-0 flex items-center justify-center gap-3 flex-wrap pb-1"
        >
          {FEATURE_BADGES.map(({ icon: Icon, label }) => (
            <span
              key={label}
              className="flex items-center gap-1.5 mono-caption text-white/30"
            >
              <Icon className="h-3 w-3" />
              {label}
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
