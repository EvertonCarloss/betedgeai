import { cn } from '@/lib/utils'
export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('bg-bg-2 border border-border rounded p-4', className)}>{children}</div>
}
export function CardTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return <h2 className={cn('font-display font-bold text-white text-sm flex items-center gap-2 mb-3', className)}>{children}</h2>
}
