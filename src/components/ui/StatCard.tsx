import { cn } from '@/lib/utils'
interface Props { label: string; value: string | number; sub?: string; color?: 'green' | 'red' | 'blue' | 'default' }
const colorMap = { green: 'text-success', red: 'text-danger', blue: 'text-accent', default: 'text-white' }
export function StatCard({ label, value, sub, color = 'default' }: Props) {
  return (
    <div className="bg-bg-2 border border-border rounded p-4">
      <div className="text-[10px] text-txt-3 uppercase tracking-wider mb-2">{label}</div>
      <div className={cn('font-display font-bold text-2xl', colorMap[color])}>{value}</div>
      {sub && <div className="text-[11px] text-txt-3 mt-1">{sub}</div>}
    </div>
  )
}
