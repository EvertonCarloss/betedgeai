'use client'
import { useState } from 'react'
import { useAppStore } from '@/store'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { Spinner } from '@/components/ui/Spinner'
import { SPORTS } from '@/lib/utils'
import { Play, RefreshCw } from 'lucide-react'

export default function LivePage() {
  const { currentSport, setSport } = useAppStore()
  const [games, setGames] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function fetchLive() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/odds?sport=${currentSport}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setGames(Array.isArray(data) ? data : [])
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const live = games.filter(g => !g.completed && g.scores)

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
        <h1 className="font-display font-bold text-white">Jogos ao vivo</h1>
      </div>

      <div className="bg-bg-2 border border-border rounded p-4 flex gap-3 items-end flex-wrap">
        <Select label="Esporte" value={currentSport} onChange={e => setSport(e.target.value)} className="flex-1 min-w-[180px]">
          {SPORTS.map(s => <option key={s.key} value={s.key}>{s.icon} {s.label}</option>)}
        </Select>
        <Button variant="primary" onClick={fetchLive} disabled={loading} className="h-9 self-end">
          {loading ? <Spinner className="w-3 h-3" /> : <RefreshCw size={13} />}
          Atualizar
        </Button>
      </div>

      {error && <div className="text-danger text-xs bg-danger/5 border border-danger/20 rounded px-3 py-2">{error}</div>}

      {loading ? (
        <div className="flex flex-col items-center gap-3 py-16 text-txt-3">
          <Spinner className="w-6 h-6" />
          <span className="text-xs">Buscando jogos ao vivo...</span>
        </div>
      ) : live.length ? (
        <div className="grid gap-3">
          {live.map((g: any) => {
            const home = g.scores?.find((s: any) => s.name === g.home_team)
            const away = g.scores?.find((s: any) => s.name === g.away_team)
            return (
              <div key={g.id} className="bg-bg-2 border border-border rounded p-4 grid grid-cols-3 items-center gap-4">
                <div className="font-display font-bold text-white text-sm">{g.home_team}</div>
                <div className="text-center">
                  <div className="font-display font-black text-2xl text-accent">{home?.score ?? 0} – {away?.score ?? 0}</div>
                  <div className="text-[10px] text-success mt-1 flex items-center justify-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse inline-block" />AO VIVO
                  </div>
                </div>
                <div className="font-display font-bold text-white text-sm text-right">{g.away_team}</div>
              </div>
            )
          })}
        </div>
      ) : games.length > 0 ? (
        <div className="py-12 text-center text-txt-3 text-xs"><Play size={28} className="mx-auto mb-3 opacity-20" /><p>Nenhum jogo ao vivo agora.<br />Tente novamente mais tarde.</p></div>
      ) : (
        <div className="py-12 text-center text-txt-3 text-xs"><Play size={28} className="mx-auto mb-3 opacity-20" /><p>Selecione um esporte e clique em Atualizar.</p></div>
      )}
    </div>
  )
}
