import { NextRequest, NextResponse } from 'next/server';
import { fetchOdds } from '@/lib/odds-api';
import { analyzeOdds } from '@/lib/anthropic';
import { SPORTS } from '@/lib/utils';

export async function POST(req: NextRequest) {
  const { sport, market } = await req.json();
  if (!sport || !market)
    return NextResponse.json(
      { error: 'sport and market required' },
      { status: 400 },
    );

  try {
    const { games, remaining } = await fetchOdds(sport, market, 'eu');
    if (!games.length)
      return NextResponse.json(
        { error: 'Nenhum jogo disponível' },
        { status: 404 },
      );

    const sportData = SPORTS.find((s) => s.key === sport);
    const formattedGames = games.slice(0, 14).map((g: any) => {
      const book = g.bookmakers?.[0];
      const mkt = book?.markets?.[0];
      return {
        home_team: g.home_team,
        away_team: g.away_team,
        outcomes: mkt?.outcomes || [],
      };
    });

    const result = await analyzeOdds(formattedGames, market, {
      valueBet: true,
      highConfOnly: false,
    });

    const suggestions = result.suggestions.map((s, i) => ({
      id: `${Date.now()}-${i}`,
      sport,
      sport_icon: sportData?.icon || '🏆',
      ...s,
    }));

    return NextResponse.json({
      suggestions,
      insight: result.insight,
      games_count: games.length,
      remaining,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
