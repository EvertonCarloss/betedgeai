import { cn } from '@/lib/utils'
import { ButtonHTMLAttributes, forwardRef } from 'react'
type Variant = 'primary' | 'ghost' | 'danger'
const map: Record<Variant, string> = {
  primary: 'bg-accent text-black hover:bg-cyan-300 border-accent',
  ghost:   'bg-transparent text-txt-2 hover:text-txt hover:border-border-2 border-border',
  danger:  'bg-transparent text-danger hover:bg-danger/10 border-danger/40 hover:border-danger',
}
interface Props extends ButtonHTMLAttributes<HTMLButtonElement> { variant?: Variant }
export const Button = forwardRef<HTMLButtonElement, Props>(({ variant = 'ghost', className, children, ...props }, ref) => (
  <button ref={ref} {...props}
    className={cn('inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono border rounded transition-all disabled:opacity-40 disabled:cursor-not-allowed', map[variant], className)}>
    {children}
  </button>
))
Button.displayName = 'Button'
