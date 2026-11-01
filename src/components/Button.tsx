import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router-dom'

type Variant = 'primary' | 'secondary' | 'ghost'
type Size = 'md' | 'sm'

const styles: Record<Variant, string> = {
  primary: 'bg-accent text-on-accent border border-accent hover:brightness-110',
  secondary: 'border border-text text-text hover:bg-surface-2',
  ghost: 'border border-transparent text-text hover:bg-surface-2',
}

const sizes: Record<Size, string> = {
  md: 'h-12 px-6 text-[15px]',
  sm: 'h-11 px-4 text-sm',
}

export function buttonClass(variant: Variant = 'primary', size: Size = 'md', extra = '') {
  return [
    'group inline-flex items-center justify-center gap-2 rounded-full font-medium select-none',
    'transition-[background-color,filter,transform,border-color] duration-[240ms] ease-out',
    'active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none',
    styles[variant],
    sizes[size],
    extra,
  ].join(' ')
}

/** Arrow that nudges 4px right on hover (primary buttons). */
export function Nudge({ children }: { children: ReactNode }) {
  return (
    <span className="transition-transform duration-[240ms] ease-out group-hover:translate-x-1">{children}</span>
  )
}

interface Common {
  variant?: Variant
  size?: Size
  className?: string
  children: ReactNode
}

export function Button({
  variant,
  size,
  className = '',
  loading,
  children,
  ...rest
}: Common & ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean }) {
  return (
    <button
      className={buttonClass(variant, size, className)}
      aria-busy={loading || undefined}
      disabled={loading || rest.disabled}
      {...rest}
    >
      {loading && (
        <span
          aria-hidden
          className="size-4 rounded-full border-2 border-current border-r-transparent animate-spin"
        />
      )}
      {children}
    </button>
  )
}

/** External or file link styled as a button. */
export function LinkButton({
  variant,
  size,
  className = '',
  children,
  ...rest
}: Common & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a className={buttonClass(variant, size, className)} {...rest}>
      {children}
    </a>
  )
}

/** In-app route link styled as a button. */
export function RouteButton({
  variant,
  size,
  className = '',
  children,
  to,
  onClick,
}: Common & { to: string; onClick?: () => void }) {
  return (
    <Link to={to} className={buttonClass(variant, size, className)} onClick={onClick}>
      {children}
    </Link>
  )
}
