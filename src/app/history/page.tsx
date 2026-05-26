'use client'
import { useState } from 'react'
import { useBets } from '@/hooks/useBets'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { formatCurrency, formatDate } from '@/lib/utils'
import { History, Check, X, Trash2 } from 'lucide-react'

type OutcomeFilter = 'all' | 'pending' | 'won' | 'lost'
type SportFilter = 'all' | '⚽' | '🏀' | '🥊' | '🎾'

const OV = { pending: 'blue', won: 'green', lost: 'red', void: 'ghost' } as const
const OL = { pending: 'Pendente', won: 'Ganhou', lost: 'Perdeu', void: 'Void' }

export default function HistoryPage() {
  const { bets, loading, updateOutcome, deleteBet } = useBets()
  const [outcomeFilter, setOutcomeFilter] = useState<OutcomeFilter>('all')
  const [sportFilter, setSportFilter] = useState<SportFilter>('all')

  let list = [...bets]
  if (outcomeFilter !== 'all') list = list.filter(b => b.outcome === outcomeFilter)
  if (sportFilter !== 'all') list = list.filter(b => b.sport_icon === sportFilter)

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-1">
        <History size={16} className="text-accent" />
        <h1 className="font-display font-bold text-white">Histórico de apostas</h1>
      </div>

      {/* Filters */}
      <div className="bg-bg-2 border border-border rounded p-3 flex gap-2 flex-wrap items-center">
        <select value={outcomeFilter} onChange={e => setOutcomeFilter(e.target.value as OutcomeFilter)}
          className="bg-bg border border-border rounded px-3 py-1.5 text-xs text-txt-2 font-mono outline-none focus:border-accent-2">
          <option value="all">Todos os resultados</option>
          <option value="pending">Pendente</option>
          <option value="won">Ganhou</option>
          <option value="lost">Perdeu</option>
        </select>
        <select value={sportFilter} onChange={e => setSportFilter(e.target.value as SportFilter)}
          className="bg-bg border border-border rounded px-3 py-1.5 text-xs text-txt-2 font-mono outline-none focus:border-accent-2">
          <option value="all">Todos os esportes</option>
          <option value="⚽">Futebol</option>
          <option value="🏀">Basquete</option>
          <option value="🥊">MMA</option>
          <option value="🎾">Tênis</option>
        </select>
        <span className="ml-auto text-txt-3 text-xs">{list.length} apostas</span>
      </div>

      {/* Table */}
      <div className="bg-bg-2 border border-border rounded overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                {['Data', 'Jogo / Seleções', 'Tipo', 'Odd', 'Stake', 'Retorno', 'Resultado', 'Ação'].map(h => (
                  <th key={h} className="text-left text-txt-3 text-[10px] uppercase tracking-wider px-4 py-3 font-normal">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} className="text-center py-10 text-txt-3">Carregando...</td></tr>
              ) : !list.length ? (
                <tr><td colSpan={8} className="text-center py-10 text-txt-3">Nenhuma aposta encontrada.</td></tr>
              ) : list.map(b => {
                const icons = [...new Set(b.items.map((i: any) => i.sport_icon))].join('')
                const realReturn = b.outcome === 'won' ? (b.real_return ?? b.potential_return) : b.outcome === 'lost' ? 0 : null
                const matchLabel = b.items.length > 1 ? `${b.items.length} seleções` : (b.items[0] as any)?.match
                const typeLabel = b.items.length > 1 ? 'Múltipla' : (b.items[0] as any)?.type

                return (
                  <tr key={b.id} className="border-b border-border last:border-0 hover:bg-white/[0.015] transition-colors">
                    <td className="px-4 py-3 text-txt-2">{formatDate(b.created_at)}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-white">{icons} {matchLabel}</div>
                    </td>
                    <td className="px-4 py-3 text-txt-2 max-w-[140px] truncate">{typeLabel}</td>
                    <td className="px-4 py-3 font-medium text-white">{b.total_odd.toFixed(2)}</td>
                    <td className="px-4 py-3 text-txt-2">{formatCurrency(b.stake)}</td>
                    <td className={`px-4 py-3 font-medium ${b.outcome === 'won' ? 'text-success' : b.outcome === 'lost' ? 'text-danger' : 'text-txt-3'}`}>
                      {realReturn !== null ? formatCurrency(realReturn) : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={OV[b.outcome]}>{OL[b.outcome]}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        {b.outcome === 'pending' ? (
                          <>
                            <Button onClick={() => updateOutcome(b.id, 'won', b.potential_return)} className="py-0.5 px-1.5 text-[10px]">
                              <Check size={10} />Ganhou
                            </Button>
                            <Button variant="danger" onClick={() => updateOutcome(b.id, 'lost')} className="py-0.5 px-1.5 text-[10px]">
                              <X size={10} />Perdeu
                            </Button>
                          </>
                        ) : (
                          <Button variant="danger" onClick={() => deleteBet(b.id)} className="py-0.5 px-1.5 text-[10px]">
                            <Trash2 size={10} />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
