import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function formatDate(date: string | Date) {
  return format(new Date(date), "dd/MM/yyyy", { locale: ptBR })
}

export function formatPercent(value: number, decimals = 1) {
  const sign = value >= 0 ? '+' : ''
  return `${sign}${value.toFixed(decimals)}%`
}

export function calcROI(stake: number, returnVal: number) {
  if (stake === 0) return 0
  return ((returnVal - stake) / stake) * 100
}

export const SPORTS = [
  { key: 'soccer_brazil_campeonato', label: 'Brasileirão', icon: '⚽' },
  { key: 'soccer_epl', label: 'Premier League', icon: '⚽' },
  { key: 'soccer_uefa_champs_league', label: 'Champions', icon: '⚽' },
  { key: 'soccer_brazil_copa_do_brasil', label: 'Copa do Brasil', icon: '⚽' },
  { key: 'soccer_conmebol_copa_libertadores', label: 'Libertadores', icon: '⚽' },
  { key: 'basketball_nba', label: 'NBA', icon: '🏀' },
  { key: 'mma_mixed_martial_arts', label: 'MMA / UFC', icon: '🥊' },
  { key: 'tennis_atp', label: 'Tênis ATP', icon: '🎾' },
] as const

export const MARKETS = [
  { value: 'h2h', label: 'Resultado (1X2)' },
  { value: 'totals', label: 'Total de gols/pontos' },
  { value: 'spreads', label: 'Handicap' },
] as const
