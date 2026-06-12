import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle2, XCircle, ArrowLeft, RotateCcw, Trophy } from 'lucide-react'
import type { QuizDef } from '../data'
import { MrSavvy } from './MrSavvy'
import { ar, cn } from '../lib/cn'
import { toast } from '../lib/toast'

/** Full interactive quiz: one question per screen, instant feedback, scoring,
 *  and a final result. Pass passing score 80%. */
export function QuizPlayer({ quiz, onClose }: { quiz: QuizDef; onClose: (passed: boolean, score: number) => void }) {
  const total = quiz.questions.length
  const [i, setI] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [correctCount, setCorrect] = useState(0)
  const [done, setDone] = useState(false)

  const q = quiz.questions[i]
  const answered = picked !== null
  const scorePct = Math.round((correctCount / total) * 100)
  const passed = scorePct >= 80

  function choose(idx: number) {
    if (answered) return
    setPicked(idx)
    if (idx === q.correct) setCorrect(c => c + 1)
  }
  function next() {
    if (i + 1 >= total) { setDone(true); return }
    setI(i + 1); setPicked(null)
  }
  function restart() { setI(0); setPicked(null); setCorrect(0); setDone(false) }

  return (
    <motion.div className="fixed inset-0 z-[90] grid place-items-center p-4"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => onClose(false, 0)} />
      <motion.div initial={{ scale: 0.95, y: 16 }} animate={{ scale: 1, y: 0 }}
        className="glass-strong relative w-full max-w-2xl rounded-3xl p-6 sm:p-8" dir="rtl">
        <button onClick={() => onClose(false, 0)} className="absolute top-4 left-4 p-2 text-white/50 hover:text-white"><X className="h-5 w-5" /></button>

        {!done ? (
          <>
            {/* progress */}
            <div className="flex items-center gap-3 mb-6">
              <MrSavvy size={40} float={false} />
              <div className="flex-1">
                <div className="flex justify-between text-xs text-white/55 mb-1.5">
                  <span>{quiz.title}</span><span>سؤال {ar(i + 1)} / {ar(total)}</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <motion.div className="h-full bg-savvy-grad rounded-full" animate={{ width: `${((i + (answered ? 1 : 0)) / total) * 100}%` }} />
                </div>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div key={i} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.3 }}>
                <h2 className="text-xl font-bold text-white leading-snug mb-5">{q.q}</h2>
                <div className="grid gap-3">
                  {q.options.map((opt, idx) => {
                    const isCorrect = idx === q.correct
                    const isPicked = picked === idx
                    const cls = !answered
                      ? 'border-white/10 bg-white/5 hover:border-cyber-500/60 hover:bg-white/8'
                      : isCorrect ? 'border-savvy-500 bg-savvy-500/10 text-savvy-300'
                      : isPicked ? 'border-danger-500 bg-danger-500/10 text-danger-300'
                      : 'border-white/5 bg-white/5 opacity-50'
                    return (
                      <button key={idx} onClick={() => choose(idx)} disabled={answered}
                        className={cn('w-full text-start p-4 rounded-xl border text-sm sm:text-base text-white transition-all flex items-center justify-between gap-3', cls)}>
                        <span>{opt}</span>
                        {answered && isCorrect && <CheckCircle2 className="h-5 w-5 text-savvy-400 shrink-0" />}
                        {answered && isPicked && !isCorrect && <XCircle className="h-5 w-5 text-danger-400 shrink-0" />}
                      </button>
                    )
                  })}
                </div>

                <AnimatePresence>
                  {answered && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                      className="mt-4 p-3.5 rounded-xl glass text-sm text-white/80 leading-relaxed">
                      <span className={cn('font-semibold', picked === q.correct ? 'text-savvy-400' : 'text-gold-400')}>
                        {picked === q.correct ? '✓ صحيح! ' : '✗ الإجابة الصحيحة مبيّنة بالأخضر. '}
                      </span>
                      {q.explain}
                    </motion.div>
                  )}
                </AnimatePresence>

                {answered && (
                  <button onClick={next} className="mt-5 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-cyber-grad py-3 font-semibold text-white shadow-glow-cyber">
                    {i + 1 >= total ? 'عرض النتيجة' : 'السؤال التالي'} <ArrowLeft className="h-4 w-4" />
                  </button>
                )}
              </motion.div>
            </AnimatePresence>
          </>
        ) : (
          <Result quiz={quiz} scorePct={scorePct} correct={correctCount} total={total} passed={passed}
            onRetry={restart} onClose={() => { toast(passed ? 'تهانينا! اجتزت الاختبار 🎉' : 'واصل التعلّم — أعد المحاولة', passed ? 'success' : 'warn'); onClose(passed, scorePct) }} />
        )}
      </motion.div>
    </motion.div>
  )
}

function Result({ quiz, scorePct, correct, total, passed, onRetry, onClose }:
  { quiz: QuizDef; scorePct: number; correct: number; total: number; passed: boolean; onRetry: () => void; onClose: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-4">
      <motion.div initial={{ scale: 0.6, rotate: -10 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 160, damping: 12 }}
        className={cn('mx-auto grid h-24 w-24 place-items-center rounded-3xl mb-5', passed ? 'bg-savvy-500/15 text-savvy-400 shadow-glow-savvy' : 'bg-gold-500/15 text-gold-400 shadow-glow-gold')}>
        {passed ? <Trophy className="h-12 w-12" /> : <RotateCcw className="h-12 w-12" />}
      </motion.div>
      <h2 className="text-2xl font-bold text-white">{passed ? 'أحسنت! اجتزت الاختبار' : 'قريب من النجاح'}</h2>
      <p className="mt-1 text-white/60">{quiz.title}</p>
      <div className="my-6">
        <span className={cn('text-6xl font-bold tabular-nums', passed ? 'text-grad-savvy' : 'text-grad-gold')}>{ar(scorePct)}<span className="text-3xl">٪</span></span>
        <p className="mt-1 text-sm text-white/55">{ar(correct)} من {ar(total)} إجابات صحيحة · النجاح ٨٠٪</p>
      </div>
      <div className="flex items-center justify-center gap-3">
        <button onClick={onRetry} className="inline-flex items-center gap-2 rounded-xl glass px-5 py-2.5 text-sm font-medium text-white hover:bg-white/10"><RotateCcw className="h-4 w-4" />إعادة</button>
        <button onClick={onClose} className="inline-flex items-center gap-2 rounded-xl bg-cyber-grad px-6 py-2.5 text-sm font-semibold text-white shadow-glow-cyber">تم</button>
      </div>
    </motion.div>
  )
}
