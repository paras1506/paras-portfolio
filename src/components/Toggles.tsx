import { useUI } from '../store/ui'
import { Moon, Motion, Sun } from './Icons'

const iconBtn =
  'inline-flex size-11 items-center justify-center rounded-full text-muted hover:text-text hover:bg-surface-2 transition-colors duration-[120ms]'

export function ThemeToggle() {
  const theme = useUI((s) => s.theme)
  const setTheme = useUI((s) => s.setTheme)
  const next = theme === 'dark' ? 'light' : 'dark'
  return (
    <button type="button" className={iconBtn} onClick={() => setTheme(next)} aria-label={`Switch to ${next} theme`}>
      {theme === 'dark' ? <Sun width={18} height={18} /> : <Moon width={18} height={18} />}
    </button>
  )
}

export function MotionToggle() {
  const reduce = useUI((s) => s.reduceMotion)
  const set = useUI((s) => s.setReduceMotion)
  return (
    <button
      type="button"
      className={`${iconBtn} ${reduce ? 'text-accent' : ''}`}
      onClick={() => set(!reduce)}
      aria-pressed={reduce}
      aria-label="Reduce motion"
      title={reduce ? 'Motion reduced' : 'Reduce motion'}
    >
      <Motion width={18} height={18} />
    </button>
  )
}
