import { useState } from 'react'
import { Globe, Bell, Moon, Shield, User } from 'lucide-react'
import { GlassCard, SectionTitle } from '../components/ui'
import { USER } from '../data'

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`relative h-6 w-11 rounded-full transition-colors ${on ? 'bg-savvy-500' : 'bg-white/15'}`}>
      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${on ? 'left-0.5' : 'left-[22px]'}`} />
    </button>
  )
}

export default function Settings() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar')
  const [notif, setNotif] = useState(true)
  const [dark] = useState(true)
  const [weekly, setWeekly] = useState(true)

  return (
    <div className="space-y-6 max-w-3xl">
      <SectionTitle kicker="SETTINGS" title="الإعدادات" subtitle="خصّص تجربتك في CyberXi Savvy" />

      <GlassCard className="p-5">
        <div className="flex items-center gap-4">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-cyber-grad text-white text-lg font-bold">{USER.avatarInitials}</span>
          <div>
            <p className="text-lg font-semibold text-white">{USER.name}</p>
            <p className="text-sm text-white/55">{USER.role}</p>
          </div>
        </div>
      </GlassCard>

      <GlassCard className="p-2">
        <Row icon={Globe} title="اللغة" desc="لغة الواجهة">
          <div className="inline-flex glass rounded-lg p-1">
            {(['ar', 'en'] as const).map(l => (
              <button key={l} onClick={() => setLang(l)} className={`px-3 py-1 rounded-md text-sm ${lang === l ? 'bg-cyber-500 text-white' : 'text-white/60'}`}>{l === 'ar' ? 'العربية' : 'EN'}</button>
            ))}
          </div>
        </Row>
        <Row icon={Bell} title="الإشعارات" desc="تنبيهات الدروس والتحديات"><Toggle on={notif} onClick={() => setNotif(v => !v)} /></Row>
        <Row icon={Shield} title="ملخّص أسبوعي" desc="تقرير تقدّمك كل أحد"><Toggle on={weekly} onClick={() => setWeekly(v => !v)} /></Row>
        <Row icon={Moon} title="الوضع الداكن" desc="مفعّل دائماً في هذه النسخة"><Toggle on={dark} onClick={() => {}} /></Row>
      </GlassCard>

      <GlassCard className="p-5 flex items-center gap-3 text-white/55 text-sm">
        <User className="h-4 w-4" /> CyberXi Savvy · الإصدار التجريبي ١.٠ · جميع البيانات تجريبية
      </GlassCard>
    </div>
  )
}

function Row({ icon: Icon, title, desc, children }: { icon: typeof Globe; title: string; desc: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 p-3.5 rounded-xl hover:bg-white/5">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/5 text-cyber-400"><Icon className="h-[18px] w-[18px]" /></span>
        <div><p className="text-sm font-medium text-white">{title}</p><p className="text-xs text-white/45">{desc}</p></div>
      </div>
      {children}
    </div>
  )
}
