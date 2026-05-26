'use client'
import { useState } from 'react'
import { useAppStore } from '@/store'
import { BetCard } from '@/components/betting/BetCard'
import { BetSlip } from '@/components/betting/BetSlip'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { Spinner } from '@/components/ui/Spinner'
import { SPORTS, MARKETS } from '@/lib/utils'
import { Sparkles, RefreshCw, Lightbulb } from 'lucide-react'

export default function SuggestionsPage() {
  const { currentSport, currentMarket, setSport, setMarket, suggestions, insight, setSuggestions, setApiRemaining } = useAppStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [gamesCount, setGamesCount] = useState(0)
  const [confFilter, setConfFilter] = useState('all')
  const [sortBy, setSortBy] = useState('conf')

  async function analyze() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sport: currentSport, market: currentMarket }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setSuggestions(data.suggestions, data.insight)
      setGamesCount(data.games_count)
      if (data.remaining) setApiRemaining(data.remaining)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  let filtered = [...suggestions]
  if (confFilter === 'high') filtered = filtered.filter(b => b.confidence >= 70)
  if (confFilter === 'med') filtered = filtered.filter(b => b.confidence >= 50 && b.confidence < 70)
  filtered.sort((a, b) => sortBy === 'conf' ? b.confidence - a.confidence : b.odd - a.odd)

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-1">
        <Sparkles size={16} className="text-accent" />
        <h1 className="font-display font-bold text-white">Sugestões IA</h1>
      </div>

      {/* Controls */}
      <div className="bg-bg-2 border border-border rounded p-4">
        <div className="flex gap-3 flex-wrap items-end">
          <Select label="Esporte" value={currentSport} onChange={e => setSport(e.target.value)} className="flex-1 min-w-[180px]">
            {SPORTS.map(s => <option key={s.key} value={s.key}>{s.icon} {s.label}</option>)}
          </Select>
          <Select label="Mercado" value={currentMarket} onChange={e => setMarket(e.target.value)} className="flex-1 min-w-[160px]">
            {MARKETS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
          </Select>
          <Button variant="primary" onClick={analyze} disabled={loading} className="h-9 self-end">
            {loading ? <Spinner className="w-3 h-3" /> : <RefreshCw size={13} />}
            {loading ? 'Analisando...' : 'Buscar e analisar'}
          </Button>
        </div>

        {error && <div className="mt-3 text-danger text-xs bg-danger/5 border border-danger/20 rounded px-3 py-2">{error}</div>}
        {!error && suggestions.length > 0 && (
          <div className="mt-3 text-success text-xs bg-success/5 border border-success/20 rounded px-3 py-2">
            {suggestions.length} sugestões geradas a partir de {gamesCount} jogos analisados.
          </div>
        )}
      </div>

      <div className="grid grid-cols-[1fr_300px] gap-4 items-start">
        <div>
          {/* Insight */}
          {insight && (
            <div className="bg-accent/5 border border-accent/20 border-l-2 border-l-accent rounded p-3 mb-3 text-xs text-txt-2 flex gap-2">
              <Lightbulb size={13} className="text-accent flex-shrink-0 mt-0.5" />
              {insight}
            </div>
          )}

          {/* Filters */}
          {suggestions.length > 0 && (
            <div className="flex gap-2 mb-3">
              <Select value={confFilter} onChange={e => setConfFilter(e.target.value)} className="text-xs py-1">
                <option value="all">Toda confiança</option>
                <option value="high">Alta (70%+)</option>
                <option value="med">Média (50–70%)</option>
              </Select>
              <Select value={sortBy} onChange={e => setSortBy(e.target.value)} className="text-xs py-1">
                <option value="conf">Ordenar: confiança</option>
                <option value="odd">Ordenar: odd</option>
              </Select>
            </div>
          )}

          {/* Cards */}
          {loading ? (
            <div className="flex flex-col items-center gap-3 py-16 text-txt-3">
              <Spinner className="w-6 h-6" />
              <span className="text-xs">IA analisando odds reais...</span>
            </div>
          ) : filtered.length ? (
            <div className="space-y-2">
              {filtered.map(b => <BetCard key={b.id} bet={b} />)}
            </div>
          ) : (
            <div className="py-16 text-center text-txt-3 text-xs">
              <Sparkles size={28} className="mx-auto mb-3 opacity-20" />
              <p>Configure o esporte e clique em "Buscar e analisar"</p>
            </div>
          )}
        </div>

        <BetSlip />
      </div>
    </div>
  )
}
