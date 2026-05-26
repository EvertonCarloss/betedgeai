import { useState, useEffect, useCallback } from 'react'
import { Bet } from '@/types'
import { calcROI } from '@/lib/utils'

export function useBets() {
  const [bets, setBets] = useState<Bet[]>([])
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    setLoading(true)
    try {
      const res = await window.fetch('/api/bets')
      const data = await res.json()
      setBets(Array.isArray(data) ? data : [])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetch() }, [fetch])

  const addBet = useCallback(async (bet: Omit<Bet, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    const res = await window.fetch('/api/bets', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(bet) })
    const data = await res.json()
    setBets(prev => [data, ...prev])
    return data
  }, [])

  const updateOutcome = useCallback(async (id: string, outcome: 'won' | 'lost' | 'void', real_return?: number) => {
    const res = await window.fetch('/api/bets', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, outcome, real_return })
    })
    const data = await res.json()
    setBets(prev => prev.map(b => b.id === id ? data : b))
  }, [])

  const deleteBet = useCallback(async (id: string) => {
    await window.fetch('/api/bets', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    setBets(prev => prev.filter(b => b.id !== id))
  }, [])

  const stats = (() => {
    const resolved = bets.filter(b => b.outcome !== 'pending')
    const won = bets.filter(b => b.outcome === 'won')
    const lost = bets.filter(b => b.outcome === 'lost')
    const pending = bets.filter(b => b.outcome === 'pending')
    const totalStake = resolved.reduce((a, b) => a + b.stake, 0)
    const totalReturn = won.reduce((a, b) => a + (b.real_return ?? b.potential_return), 0)
    const roi = calcROI(totalStake, totalReturn)
    const hitRate = resolved.length ? (won.length / resolved.length) * 100 : 0
    return { total: bets.length, won: won.length, lost: lost.length, pending: pending.length, totalStake, totalReturn, roi, hitRate }
  })()

  return { bets, loading, addBet, updateOutcome, deleteBet, refetch: fetch, stats }
}
