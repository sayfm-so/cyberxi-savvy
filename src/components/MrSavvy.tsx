import { motion, useAnimationControls } from 'framer-motion'
import { useEffect } from 'react'
import { cn } from '../lib/cn'

/**
 * Mr. Savvy — the platform mascot/AI mentor. A friendly shield-bot with a
 * glowing visor. Reusable at any size; optional floating animation.
 *
 * Motion: two async loops (y-bob + tilt) create breathing feel rather than
 * metronome. Eye glance fires every 8–15 s via imperative controls.
 */
export function MrSavvy({ size = 64, float = true, className }:
  { size?: number; float?: boolean; className?: string }) {
  const eyeControls = useAnimationControls()

  /* Occasional sideways glance — triggers every 8–15 s when floating */
  useEffect(() => {
    if (!float) return
    let mounted = true

    async function glanceLoop() {
      while (mounted) {
        const wait = 8000 + Math.random() * 7000
        await new Promise<void>(r => setTimeout(r, wait))
        if (!mounted) break
        await eyeControls.start({ x: 1.5, transition: { duration: 0.12, ease: 'easeOut' } })
        await new Promise<void>(r => setTimeout(r, 180))
        await eyeControls.start({ x: -1.0, transition: { duration: 0.10, ease: 'easeOut' } })
        await new Promise<void>(r => setTimeout(r, 120))
        await eyeControls.start({ x: 0, transition: { duration: 0.18, ease: 'easeOut' } })
      }
    }

    glanceLoop()
    return () => { mounted = false }
  }, [float, eyeControls])

  return (
    <div className={cn('relative shrink-0', className)} style={{ width: size, height: size }}>
      {/* y-bob — 4.2 s */}
      <motion.div
        style={{ width: size, height: size }}
        animate={float ? { y: [0, -6, 0] } : undefined}
        transition={float ? { duration: 4.2, repeat: Infinity, ease: 'easeInOut' } : undefined}
      >
        {/* Tilt/breathe — 6.5 s, offset by 1.2 s delay so loops are async */}
        <motion.div
          style={{ width: size, height: size }}
          animate={float ? { rotate: [0, -1.2, 0.8, 0] } : undefined}
          transition={float ? { duration: 6.5, delay: 1.2, repeat: Infinity, ease: 'easeInOut' } : undefined}
        >
          <div className="absolute inset-0 rounded-full blur-xl"
               style={{ background: 'radial-gradient(circle, rgba(0,229,138,0.45), transparent 65%)' }} />
          <svg viewBox="0 0 100 100" className="relative h-full w-full drop-shadow-[0_4px_16px_rgba(31,143,255,0.45)]">
            <defs>
              <linearGradient id="savvyBody" x1="0" y1="0" x2="0.6" y2="1">
                <stop offset="0%" stopColor="#4fb8ff" />
                <stop offset="40%" stopColor="#1f8fff" />
                <stop offset="100%" stopColor="#0840a0" />
              </linearGradient>
              <linearGradient id="savvyVisor" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#8bffcd" /><stop offset="100%" stopColor="#00e58a" />
              </linearGradient>
            </defs>
            {/* antenna */}
            <line x1="50" y1="14" x2="50" y2="26" stroke="#00e58a" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="50" cy="11" r="4" fill="#00e58a">
              <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />
            </circle>
            {/* shield-shaped head */}
            <path d="M50 24 C66 24, 80 30, 80 30 L80 56 C80 74, 50 88, 50 88 C50 88, 20 74, 20 56 L20 30 C20 30, 34 24, 50 24 Z"
                  fill="url(#savvyBody)" stroke="#a3d3ff" strokeWidth="1.5" />
            {/* specular highlight */}
            <ellipse cx="38" cy="36" rx="10" ry="6" fill="white" opacity="0.10" />
            {/* visor */}
            <rect x="31" y="42" width="38" height="20" rx="10" fill="#06122a" />
            <rect x="31" y="42" width="38" height="20" rx="10" fill="url(#savvyVisor)" opacity="0.18" />
            {/* eyes — wrapped in motion.g for glance control */}
            <motion.g animate={eyeControls}>
              <circle cx="42" cy="52" r="4.2" fill="url(#savvyVisor)">
                <animate attributeName="r" values="4.2;4.2;1;4.2" dur="5s" repeatCount="indefinite" keyTimes="0;0.92;0.96;1" />
              </circle>
              <circle cx="58" cy="52" r="4.2" fill="url(#savvyVisor)">
                <animate attributeName="r" values="4.2;4.2;1;4.2" dur="5s" repeatCount="indefinite" keyTimes="0;0.92;0.96;1" />
              </circle>
            </motion.g>
            {/* cheek glow / smile */}
            <path d="M44 67 Q50 71 56 67" stroke="#00e58a" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.8" />
            {/* CyberXi check emblem */}
            <path d="M45 34 l3.5 3.5 L56 31" stroke="#8bffcd" strokeWidth="3.0" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>
      </motion.div>
    </div>
  )
}

/** Mr. Savvy with a speech bubble — used across screens for guidance. */
export function SavvySays({ children, size = 56, className }:
  { children: React.ReactNode; size?: number; className?: string }) {
  return (
    <div className={cn('flex items-start gap-4', className)}>
      <MrSavvy size={size} />
      <motion.div
        initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as const }}
        className="glass relative rounded-2xl rounded-tr-sm px-4 py-3 text-sm leading-relaxed text-white/90 max-w-md">
        <span className="absolute -right-1.5 top-3 h-3 w-3 rotate-45 glass border-l-0 border-b-0" />
        {children}
      </motion.div>
    </div>
  )
}
