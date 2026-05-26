'use client'
import { useBets } from '@/hooks/useBets'
import { useProfile } from '@/hooks/useProfile'
import { StatCard } from '@/components/ui/StatCard'
import { Card, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { formatCurrency, formatPercent, formatDate } from '@/lib/utils'
import { LayoutDashboard, TrendingUp, Target, Wallet } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

export default function DashboardPage() {
  const { bets, loading, stats } = useBets()
  const { profile } = useProfile()

  const bankroll = profile?.bankroll ?? 1000
  const balance = bankroll + stats.totalReturn - stats.totalStake
  const balanceDiff = balance - bankroll

  // Balance evolution data
  const sorted = [...bets].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
  let bal = bankroll
  const chartData = [{ date: 'Início', balance: bal }]
  sorted.forEach(b => {
    if (b.outcome === 'won') bal = bal - b.stake + (b.real_return ?? b.potential_return)
    else if (b.outcome === 'lost') bal -= b.stake
    chartData.push({ date: formatDate(b.created_at), balance: parseFloat(bal.toFixed(2)) })
  })

  const recent = bets.slice(0, 5)

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2 mb-1">
        <LayoutDashboard size={16} className="text-accent" />
        <h1 className="font-display font-bold text-white">Dashboard</h1>
      </div>

      <div className="grid grid-cols-4 gap-3">
        <StatCard label="Apostas registradas" value={stats.total} sub={`${stats.pending} pendentes`} color="blue" />
        <StatCard
          label="Taxa de acerto"
          value={stats.total > 0 ? `${stats.hitRate.toFixed(0)}%` : '—'}
          sub={`${stats.won} ganhas / ${stats.won + stats.lost} resolvidas`}
          color={stats.hitRate >= 50 ? 'green' : stats.hitRate > 0 ? 'red' : 'default'}
        />
        <StatCard
          label="ROI total"
          value={stats.won + stats.lost > 0 ? formatPercent(stats.roi) : '—'}
          sub={stats.roi >= 0 ? 'lucrativo' : 'negativo'}
          color={stats.roi >= 0 ? 'green' : 'red'}
        />
        <StatCard
          label="Saldo simulado"
          value={formatCurrency(balance)}
          sub={`${balanceDiff >= 0 ? '+' : ''}${formatCurrency(balanceDiff)} vs inicial`}
          color={balance >= bankroll ? 'green' : 'red'}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 space-y-4">
          <Card>
            <CardTitle><TrendingUp size={14} className="text-accent" />Evolução do saldo</CardTitle>
            {chartData.length > 1 ? (
              <ResponsiveContainer width="100%" height={160}>
                <LineChart data={chartData}>
                  <XAxis dataKey="date" tick={{ fill: '#3d5168', fontSize: 10 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fill: '#3d5168', fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => `R$${v}`} />
                  <Tooltip
                    contentStyle={{ background: '#0e1318', border: '1px solid #1c2530', borderRadius: 4, fontSize: 11 }}
                    labelStyle={{ color: '#7a8fa8' }}
                    itemStyle={{ color: '#00d4ff' }}
                    formatter={(v: number) => [formatCurrency(v), 'Saldo']}
                  />
                  <Line type="monotone" dataKey="balance" stroke="#00d4ff" strokeWidth={2} dot={{ fill: '#00d4ff', r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-40 flex items-center justify-center text-txt-3 text-xs">Registre apostas para ver a evolução do saldo.</div>
            )}
          </Card>

          <Card>
            <CardTitle><Target size={14} className="text-accent" />Últimas apostas</CardTitle>
            {recent.length ? (
              <div className="space-y-2">
                {recent.map(b => {
                  const icons = [...new Set(b.items.map((i: any) => i.sport_icon))].join('')
                  const ov = { pending: 'blue', won: 'green', lost: 'red', void: 'ghost' } as const
                  const ol = { pending: 'Pendente', won: 'Ganhou', lost: 'Perdeu', void: 'Void' }
                  return (
                    <div key={b.id} className="flex items-center gap-3 py-2 border-b border-border last:border-0 text-xs">
                      <span className="text-base">{icons}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-white font-medium truncate">
                          {b.items.length > 1 ? `${b.items.length} seleções` : (b.items[0] as any)?.match}
                        </div>
                        <div className="text-txt-3">{formatDate(b.created_at)} · odd {b.total_odd.toFixed(2)} · {formatCurrency(b.stake)}</div>
                      </div>
                      <Badge variant={ov[b.outcome]}>{ol[b.outcome]}</Badge>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="py-8 text-center text-txt-3 text-xs">Nenhuma aposta registrada.</div>
            )}
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardTitle><Wallet size={14} className="text-accent" />Resumo financeiro</CardTitle>
            <div className="space-y-2 text-xs text-txt-2">
              {[
                ['Apostas ganhas', stats.won, 'text-success'],
                ['Apostas perdidas', stats.lost, 'text-danger'],
                ['Pendentes', stats.pending, 'text-txt'],
                ['Stake total', formatCurrency(stats.totalStake), 'text-txt'],
                ['Retorno total', formatCurrency(stats.totalReturn), 'text-success'],
              ].map(([label, val, cls]) => (
                <div key={label as string} className="flex justify-between py-1 border-b border-border last:border-0">
                  <span>{label}</span>
                  <span className={cls as string}>{val}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <CardTitle>Acerto por esporte</CardTitle>
            {(() => {
              const sportMap: Record<string, { won: number; total: number }> = {}
              bets.filter(b => b.outcome !== 'pending').forEach(b => {
                const icon = b.sport_icon || '🏆'
                if (!sportMap[icon]) sportMap[icon] = { won: 0, total: 0 }
                sportMap[icon].total++
                if (b.outcome === 'won') sportMap[icon].won++
              })
              const entries = Object.entries(sportMap)
              const names: Record<string, string> = { '⚽': 'Futebol', '🏀': 'Basquete', '🥊': 'MMA', '🎾': 'Tênis', '🏆': 'Outro' }
              return entries.length ? (
                <div className="space-y-2">
                  {entries.map(([icon, d]) => {
                    const pct = Math.round((d.won / d.total) * 100)
                    return (
                      <div key={icon} className="flex items-center gap-2 text-xs">
                        <span className="w-20 text-txt-2 truncate">{icon} {names[icon] || icon}</span>
                        <div className="flex-1 h-1.5 bg-border rounded overflow-hidden">
                          <div className="h-full bg-accent rounded" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-txt-3 w-8 text-right">{pct}%</span>
                      </div>
                    )
                  })}
                </div>
              ) : <div className="text-txt-3 text-xs py-2">Resolva apostas para ver.</div>
            })()}
          </Card>
        </div>
      </div>
    </div>
  )
}
