import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Home, Route, BookOpen, PlayCircle, ListChecks, Target, Crosshair, Sparkles,
  Boxes, Award, LayoutDashboard, BarChart3, Settings, Menu, X, Search, Bell, Flame,
  CheckCircle2, Info, AlertTriangle,
} from 'lucide-react'
import { NAV, USER } from '../data'
import { cn, ar } from '../lib/cn'
import { MrSavvy } from './MrSavvy'
import type { ToastDetail } from '../lib/toast'

const ICONS: Record<string, typeof Home> = {
  Home, Route, BookOpen, PlayCircle, ListChecks, Target, Crosshair, Sparkles,
  Boxes, Award, LayoutDashboard, BarChart3, Settings,
}

export function AppLayout() {
  const [open, setOpen] = useState(false)
  const loc = useLocation()

  return (
    <div className="ambient grain min-h-screen text-white">
      <Toaster />
      <div className="grid-faint min-h-screen lg:grid lg:grid-cols-[268px_1fr]">
        {/* sidebar (desktop) */}
        <aside className="hidden lg:flex flex-col gap-2 p-4 sticky top-0 h-screen overflow-y-auto border-l border-white/8">
          <Brand />
          <nav className="mt-3 flex flex-col gap-1">
            {NAV.map(item => <NavItem key={item.to} {...item} />)}
          </nav>
          <div className="mt-auto"><LevelCard /></div>
        </aside>

        {/* mobile drawer */}
        <AnimatePresence>
          {open && (
            <motion.div className="fixed inset-0 z-50 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
              <motion.aside className="absolute right-0 top-0 h-full w-[280px] glass-strong p-4 flex flex-col gap-2 overflow-y-auto"
                initial={{ x: 300 }} animate={{ x: 0 }} exit={{ x: 300 }} transition={{ type: 'spring', damping: 26, stiffness: 240 }}>
                <div className="flex items-center justify-between">
                  <Brand />
                  <button onClick={() => setOpen(false)} className="p-2 text-white/70"><X className="h-5 w-5" /></button>
                </div>
                <nav className="mt-2 flex flex-col gap-1" onClick={() => setOpen(false)}>
                  {NAV.map(item => <NavItem key={item.to} {...item} />)}
                </nav>
                <div className="mt-auto"><LevelCard /></div>
              </motion.aside>
            </motion.div>
          )}
        </AnimatePresence>

        {/* main column */}
        <div className="flex flex-col min-h-screen min-w-0">
          <Topbar onMenu={() => setOpen(true)} />
          <main className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div key={loc.pathname}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] as const }}
                className="p-5 sm:p-7 max-w-[1280px] mx-auto w-full">
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  )
}

function Brand() {
  return (
    <div className="flex items-center gap-3 px-2 py-1">
      <MrSavvy size={36} float={false} />
      <div className="leading-none">
        <p className="font-display font-extrabold text-xl tracking-tight text-white">CyberXi <span className="text-grad-savvy">Savvy</span></p>
        <p className="mono-caption text-white/45 mt-1" style={{ letterSpacing: '0.18em', color: '#1f8fff', opacity: 0.7 }}>AI AWARENESS</p>
      </div>
    </div>
  )
}

function NavItem({ to, label, icon }: { to: string; label: string; icon: string }) {
  const Icon = ICONS[icon] ?? Home
  return (
    <NavLink to={to} end={to === '/'}
      className={({ isActive }) => cn(
        'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200',
        isActive
          ? 'text-white'
          : 'text-white/55 hover:text-white hover:bg-white/5',
      )}
      style={({ isActive }) => isActive ? {
        background: 'linear-gradient(90deg, rgba(0,229,138,0.10), transparent)',
      } : undefined}
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <motion.span
              layoutId="nav-active-bar"
              className="absolute inset-y-1 right-0 w-[3px] rounded-full"
              style={{ background: 'linear-gradient(180deg, #00e58a, #1f8fff)' }}
              transition={{ type: 'spring', stiffness: 380, damping: 32 }}
            />
          )}
          <Icon
            className="h-[18px] w-[18px] shrink-0 transition-colors duration-200"
            style={{ color: isActive ? '#00e58a' : undefined }}
          />
          <span className="font-medium">{label}</span>
        </>
      )}
    </NavLink>
  )
}

function LevelCard() {
  const pct = Math.round((USER.xp / USER.xpToNext) * 100)
  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold tracking-widest text-cyber-400" style={{ fontFamily: 'JetBrains Mono, monospace' }}>LEVEL {ar(USER.level)}</span>
        <span className="inline-flex items-center gap-1 text-xs text-gold-400"><Flame className="h-3.5 w-3.5" />{ar(USER.streakDays)} يوم</span>
      </div>
      <p className="mt-1 text-sm font-semibold text-white">{USER.levelTitle}</p>
      <div className="mt-2 h-2 rounded-full bg-white/10 overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-savvy-grad"
          style={{ boxShadow: '0 0 8px rgba(0,229,138,0.55)' }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] as const, delay: 0.4 }}
        />
      </div>
      <p className="mt-1.5 text-[11px] text-white/45">{ar(USER.xp)} / {ar(USER.xpToNext)} XP</p>
    </div>
  )
}

function Toaster() {
  const [items, setItems] = useState<{ id: number; detail: ToastDetail }[]>([])
  useEffect(() => {
    let n = 0
    function onToast(e: Event) {
      const detail = (e as CustomEvent<ToastDetail>).detail
      const id = ++n
      setItems(prev => [...prev, { id, detail }])
      window.setTimeout(() => setItems(prev => prev.filter(i => i.id !== id)), 3200)
    }
    window.addEventListener('cxs-toast', onToast)
    return () => window.removeEventListener('cxs-toast', onToast)
  }, [])
  const ICON = { info: Info, success: CheckCircle2, warn: AlertTriangle }
  const COL = { info: 'text-cyber-400', success: 'text-savvy-400', warn: 'text-gold-400' }
  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center gap-2 pointer-events-none">
      <AnimatePresence>
        {items.map(({ id, detail }) => {
          const Icon = ICON[detail.kind]
          return (
            <motion.div key={id} initial={{ opacity: 0, y: 20, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }} transition={{ duration: 0.25 }}
              className="glass-strong rounded-xl px-4 py-3 flex items-center gap-2.5 shadow-card max-w-[90vw]">
              <Icon className={cn('h-5 w-5 shrink-0', COL[detail.kind])} />
              <span className="text-sm text-white/90">{detail.msg}</span>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}

function Topbar({ onMenu }: { onMenu: () => void }) {
  return (
    <header className="sticky top-0 z-30 glass-strong border-b border-white/8">
      <div className="flex items-center gap-3 px-5 sm:px-7 h-16 max-w-[1280px] mx-auto">
        <button onClick={onMenu} className="lg:hidden p-2 text-white/70"><Menu className="h-5 w-5" /></button>
        <div
          className="hidden sm:flex items-center gap-2 rounded-xl px-3 py-2 w-full max-w-sm transition-all duration-200 focus-within:border-cyber-500/40"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)' }}
        >
          <Search className="h-4 w-4 text-white/40 shrink-0" />
          <input className="bg-transparent outline-none text-sm placeholder-white/35 w-full" placeholder="ابحث في المعرفة، الدروس، التحديات…" />
        </div>
        <div className="flex-1" />
        <button className="relative p-2.5 glass rounded-xl text-white/70 hover:text-white">
          <Bell className="h-[18px] w-[18px]" />
          <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-savvy-500" />
        </button>
        <div className="flex items-center gap-3 glass rounded-xl pr-2 pl-3 py-1.5">
          <div className="text-right leading-tight hidden sm:block">
            <p className="text-sm font-semibold text-white">{USER.name}</p>
            <p className="text-[11px] text-white/45">{USER.department}</p>
          </div>
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-cyber-grad text-white text-sm font-bold">{USER.avatarInitials}</span>
        </div>
      </div>
    </header>
  )
}
