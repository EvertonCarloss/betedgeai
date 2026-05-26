export type Sport = {
  key: string
  label: string
  icon: string
}

export type Market = 'h2h' | 'totals' | 'spreads'

export type Outcome = 'pending' | 'won' | 'lost' | 'void'

export type BetSuggestion = {
  id: string
  match: string
  home_team: string
  away_team: string
  type: string
  odd: number
  confidence: number
  reasoning: string
  is_value_bet: boolean
  sport: string
  sport_icon: string
  commence_time?: string
}

export type BetItem = {
  match: string
  type: string
  odd: number
  sport_icon: string
}

export type Bet = {
  id: string
  user_id: string
  created_at: string
  items: BetItem[]
  total_odd: number
  stake: number
  potential_return: number
  outcome: Outcome
  real_return?: number
  sport_icon: string
  notes?: string
}

export type Profile = {
  id: string
  email: string
  full_name?: string
  bankroll: number
  default_stake: number
  odds_api_key?: string
  region: string
  settings: {
    auto_analyze: boolean
    value_bet: boolean
    high_conf_only: boolean
    stop_loss_alert: boolean
  }
}

export type DashboardStats = {
  total_bets: number
  won: number
  lost: number
  pending: number
  hit_rate: number
  roi: number
  total_stake: number
  total_return: number
  balance: number
}
