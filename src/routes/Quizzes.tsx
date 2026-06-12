import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ListChecks, CheckCircle2, Lock, ArrowLeft } from 'lucide-react'
import { GlassCard, SectionTitle, Pill, ProgressBar } from '../components/ui'
import { QuizPlayer } from '../components/QuizPlayer'
import { QUIZ_BANK, type QuizDef } from '../data'
import { toast } from '../lib/toast'
import { ar } from '../lib/cn'

interface Row { bankId: keyof typeof QUIZ_BANK | null; title: string; q: number; locked?: boolean }
const ROWS: Row[] = [
  { bankId: 'fundamentals', title: 'أساسيات الأمن السيبراني', q: 4 },
  { bankId: 'phishing', title: 'كشف التصيّد الاحتيالي', q: 4 },
  { bankId: 'smsvish', title: 'التصيّد النصّي والصوتي', q: 3 },
  { bankId: null, title: 'الهندسة الاجتماعية', q: 10, locked: true },
  { bankId: null, title: 'حماية البيانات و PDPL', q: 12, locked: true },
  { bankId: null, title: 'أمن الذكاء الاصطناعي', q: 14, locked: true },
]

export default function Quizzes() {
  const [active, setActive] = useState<QuizDef | null>(null)
  const [scores, setScores] = useState<Record<string, number>>({})

  function finish(passed: boolean, score: number) {
    if (active && passed) setScores(s => ({ ...s, [active.id]: score }))
    setActive(null)
  }

  const passedCount = Object.keys(scores).length
  return (
    <div className="space-y-6">
      <SectionTitle kicker="ASSESSMENTS" title="الاختبارات" subtitle={`اجتزت ${ar(passedCount)} اختبار · درجة النجاح ٨٠٪ · اضغط أي اختبار متاح لتبدأ`} />
      <div className="grid sm:grid-cols-2 gap-4">
        {ROWS.map((r, i) => {
          const score = r.bankId ? scores[r.bankId] : undefined
          const passed = score !== undefined
          return (
            <motion.div key={r.title} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <GlassCard glow="savvy" className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className={`grid h-11 w-11 place-items-center rounded-xl ${passed ? 'bg-savvy-500/15 text-savvy-400' : r.locked ? 'bg-white/5 text-white/30' : 'bg-cyber-500/15 text-cyber-400'}`}>
                      {passed ? <CheckCircle2 className="h-5 w-5" /> : r.locked ? <Lock className="h-5 w-5" /> : <ListChecks className="h-5 w-5" />}
                    </span>
                    <div>
                      <h3 className="font-semibold text-white">{r.title}</h3>
                      <p className="text-xs text-white/50 mt-0.5">{ar(r.q)} أسئلة</p>
                    </div>
                  </div>
                  {passed && <Pill accent="savvy">{ar(score!)}٪</Pill>}
                </div>
                {passed && <div className="mt-4"><ProgressBar value={score!} accent="savvy" /></div>}
                {!r.locked && (
                  <button onClick={() => r.bankId && setActive(QUIZ_BANK[r.bankId])}
                    className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-cyber-grad py-2.5 text-sm font-semibold text-white shadow-glow-cyber hover:brightness-110 transition-all">
                    {passed ? 'أعد الاختبار' : 'ابدأ الاختبار'} <ArrowLeft className="h-4 w-4" />
                  </button>
                )}
                {r.locked && (
                  <button onClick={() => toast('أكمل الوحدة السابقة لفتح هذا الاختبار', 'warn')}
                    className="mt-4 w-full rounded-xl glass py-2.5 text-sm text-white/45">مقفل — أكمل الوحدة السابقة</button>
                )}
              </GlassCard>
            </motion.div>
          )
        })}
      </div>

      <AnimatePresence>
        {active && <QuizPlayer quiz={active} onClose={finish} />}
      </AnimatePresence>
    </div>
  )
}
