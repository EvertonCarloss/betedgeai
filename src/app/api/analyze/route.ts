import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { fetchOdds } from '@/lib/odds-api'
import { analyzeOdds } from '@/lib/anthropic'
import { SPORTS } from '@/lib/utils'

export async function POST(req: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { sport, market } = await req.json()
  if (!sport || !market) return NextResponse.json({ error: 'sport and market required' }, { status: 400 })

  const { data: profile } = await supabase.from('profiles').select('settings, odds_api_key, region').eq('id', user.id).single()

  try {
    const { games, remaining } = await fetchOdds(sport, market, profile?.region || 'eu')
    if (!games.length) return NextResponse.json({ error: 'Nenhum jogo disponível' }, { status: 404 })

    const sportData = SPORTS.find(s => s.key === sport)
    const formattedGames = games.slice(0, 14).map((g: any) => {
      const book = g.bookmakers?.[0]
      const mkt = book?.markets?.[0]
      return {
        home_team: g.home_team,
        away_team: g.away_team,
        outcomes: mkt?.outcomes || [],
      }
    })

    const result = await analyzeOdds(formattedGames, market, {
      valueBet: profile?.settings?.value_bet ?? true,
      highConfOnly: profile?.settings?.high_conf_only ?? false,
    })

    const suggestions = result.suggestions.map((s, i) => ({
      id: `${Date.now()}-${i}`,
      sport,
      sport_icon: sportData?.icon || '🏆',
      ...s,
    }))

    return NextResponse.json({ suggestions, insight: result.insight, games_count: games.length, remaining })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
