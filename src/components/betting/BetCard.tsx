'use client'
import { BetSuggestion } from '@/types'
import { useAppStore } from '@/store'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/utils'
import { Zap } from 'lucide-react'

export function BetCard({ bet }: { bet: BetSuggestion }) {
  const { isInSlip, addToSlip, removeFromSlip } = useAppStore()
  const selected = isInSlip(bet.id)

  function toggle() {
    if (selected) removeFromSlip(bet.id)
    else addToSlip(bet)
  }

  const confColor = bet.confidence >= 70 ? 'text-success' : bet.confidence >= 55 ? 'text-warn' : 'text-txt-2'
  const barColor = bet.confidence >= 70 ? 'bg-success' : bet.confidence >= 55 ? 'bg-warn' : 'bg-txt-3'
  const badgeVariant = bet.confidence >= 70 ? 'green' : bet.confidence >= 55 ? 'yellow' : 'ghost'

  return (
    <div
      onClick={toggle}
      role="button" tabIndex={0} onKeyDown={e => e.key === 'Enter' && toggle()}
      className={cn(
        'bg-bg border rounded p-3 grid gap-3 cursor-pointer transition-all animate-fade-in',
        'grid-cols-[36px_1fr_auto] items-center',
        selected
          ? 'border-success/50 bg-success/[0.03]'
          : 'border-border hover:border-border-2'
      )}
    >
      <div className={cn('w-9 h-9 rounded flex items-center justify-center text-lg bg-bg-3 border flex-shrink-0', selected ? 'border-success/30' : 'border-border')}>
        {bet.sport_icon}
      </div>

      <div className="min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-display font-bold text-white text-[13px] truncate">{bet.match}</span>
          {bet.is_value_bet && <Badge variant="blue"><Zap size={9} className="inline mr-0.5" />value</Badge>}
        </div>
        <div className="text-txt-2 text-[11px] mt-0.5">{bet.type}</div>
        <div className="text-txt-3 text-[10px] mt-1 leading-relaxed">{bet.reasoning}</div>
      </div>

      <div className="flex flex-col items-end gap-1 min-w-[70px]">
        <div className="font-display font-bold text-white text-xl">{bet.odd.toFixed(2)}</div>
        <div className={cn('text-[10px]', confColor)}>{bet.confidence}%</div>
        <div className="w-12 h-[2px] bg-border rounded overflow-hidden">
          <div className={cn('h-full rounded', barColor)} style={{ width: `${bet.confidence}%` }} />
        </div>
        <Badge variant={badgeVariant}>{bet.confidence >= 70 ? 'Alta' : bet.confidence >= 55 ? 'Média' : 'Baixa'}</Badge>
      </div>
    </div>
  )
}
