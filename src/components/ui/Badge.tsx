import { cn } from '@/lib/utils'
type Variant = 'blue' | 'green' | 'yellow' | 'red' | 'ghost'
const map: Record<Variant, string> = {
  blue:   'bg-accent/10 text-accent border-accent/20',
  green:  'bg-success/10 text-success border-success/20',
  yellow: 'bg-warn/10 text-warn border-warn/20',
  red:    'bg-danger/10 text-danger border-danger/20',
  ghost:  'bg-border/30 text-txt-2 border-border',
}
export function Badge({ children, variant = 'ghost', className }: { children: React.ReactNode; variant?: Variant; className?: string }) {
  return <span className={cn('text-[10px] px-2 py-0.5 rounded-sm border font-mono', map[variant], className)}>{children}</span>
}
