import { motion } from 'framer-motion'
import { ListChecks, CheckCircle2, Lock, ArrowLeft } from 'lucide-react'
import { GlassCard, SectionTitle, Pill, ProgressBar } from '../components/ui'
import { ar } from '../lib/cn'

interface Quiz { title: string; q: number; status: 'passed' | 'available' | 'locked'; score?: number }
const QUIZZES: Quiz[] = [
  { title: 'أساسيات الأمن السيبراني', q: 10, status: 'passed', score: 95 },
  { title: 'كشف التصيّد الاحتيالي', q: 12, status: 'passed', score: 88 },
  { title: 'التصيّد النصّي والصوتي', q: 8, status: 'available' },
  { title: 'الهندسة الاجتماعية', q: 10, status: 'locked' },
  { title: 'حماية البيانات و PDPL', q: 12, status: 'locked' },
  { title: 'أمن الذكاء الاصطناعي', q: 14, status: 'locked' },
]

export default function Quizzes() {
  const passed = QUIZZES.filter(q => q.status === 'passed').length
  return (
    <div className="space-y-6">
      <SectionTitle kicker="ASSESSMENTS" title="الاختبارات" subtitle={`اجتزت ${ar(passed)} من ${ar(QUIZZES.length)} اختبار · درجة النجاح ٨٠٪`} />
      <div className="grid sm:grid-cols-2 gap-4">
        {QUIZZES.map((q, i) => (
          <motion.div key={q.title} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <GlassCard glow="savvy" className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className={`grid h-11 w-11 place-items-center rounded-xl ${q.status === 'passed' ? 'bg-savvy-500/15 text-savvy-400' : q.status === 'available' ? 'bg-cyber-500/15 text-cyber-400' : 'bg-white/5 text-white/30'}`}>
                    {q.status === 'passed' ? <CheckCircle2 className="h-5 w-5" /> : q.status === 'locked' ? <Lock className="h-5 w-5" /> : <ListChecks className="h-5 w-5" />}
                  </span>
                  <div>
                    <h3 className="font-semibold text-white">{q.title}</h3>
                    <p className="text-xs text-white/50 mt-0.5">{ar(q.q)} سؤال</p>
                  </div>
                </div>
                {q.status === 'passed' && <Pill accent="savvy">{ar(q.score!)}٪</Pill>}
              </div>
              {q.status === 'passed' && <div className="mt-4"><ProgressBar value={q.score!} accent="savvy" /></div>}
              {q.status === 'available' && (
                <button className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-cyber-grad py-2.5 text-sm font-semibold text-white shadow-glow-cyber">
                  ابدأ الاختبار <ArrowLeft className="h-4 w-4" />
                </button>
              )}
              {q.status === 'locked' && <p className="mt-4 text-xs text-white/40">أكمل الوحدة السابقة لفتح هذا الاختبار</p>}
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
