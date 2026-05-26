import { create } from 'zustand'
import { BetSuggestion, Profile } from '@/types'

type SlipItem = BetSuggestion

type AppState = {
  // Slip
  slip: SlipItem[]
  addToSlip: (bet: SlipItem) => void
  removeFromSlip: (id: string) => void
  clearSlip: () => void
  isInSlip: (id: string) => boolean

  // Current sport/market
  currentSport: string
  currentMarket: string
  setSport: (sport: string) => void
  setMarket: (market: string) => void

  // Suggestions
  suggestions: BetSuggestion[]
  insight: string
  setSuggestions: (suggestions: BetSuggestion[], insight: string) => void

  // Profile cache
  profile: Profile | null
  setProfile: (profile: Profile) => void

  // API usage
  apiRemaining: string | null
  setApiRemaining: (v: string | null) => void
}

export const useAppStore = create<AppState>((set, get) => ({
  slip: [],
  addToSlip: (bet) => {
    if (get().slip.length >= 6) return
    set(s => ({ slip: [...s.slip, bet] }))
  },
  removeFromSlip: (id) => set(s => ({ slip: s.slip.filter(b => b.id !== id) })),
  clearSlip: () => set({ slip: [] }),
  isInSlip: (id) => get().slip.some(b => b.id === id),

  currentSport: 'soccer_brazil_campeonato',
  currentMarket: 'h2h',
  setSport: (sport) => set({ currentSport: sport }),
  setMarket: (market) => set({ currentMarket: market }),

  suggestions: [],
  insight: '',
  setSuggestions: (suggestions, insight) => set({ suggestions, insight }),

  profile: null,
  setProfile: (profile) => set({ profile }),

  apiRemaining: null,
  setApiRemaining: (v) => set({ apiRemaining: v }),
}))
