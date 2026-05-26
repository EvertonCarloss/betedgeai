import Anthropic from '@anthropic-ai/sdk';
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export type GameOdds = {
  home_team: string;
  away_team: string;
  outcomes: Array<{ name: string; price: number }>;
};

export async function analyzeOdds(
  games: GameOdds[],
  market: string,
  options: { valueBet?: boolean; highConfOnly?: boolean } = {},
) {
  const marketLabel: Record<string, string> = {
    h2h: 'resultado (1X2)',
    totals: 'total de gols/pontos',
    spreads: 'handicap',
  };

  const sample = games
    .slice(0, 14)
    .map((g) => {
      const odds = g.outcomes
        .map((o) => `${o.name}: ${o.price.toFixed(2)}`)
        .join(' | ');
      return `${g.home_team} vs ${g.away_team} → ${odds}`;
    })
    .join('\n');

  const extraInstructions = [
    options.valueBet
      ? 'Identifique value bets onde a odd parece subestimada pelo mercado.'
      : '',
    options.highConfOnly
      ? 'Gere apenas sugestões com confiança acima de 65%.'
      : '',
  ]
    .filter(Boolean)
    .join(' ');

  const prompt = `Você é um analista sênior de apostas esportivas. Analise estas partidas com odds reais.

Mercado: ${marketLabel[market] || market}
${extraInstructions}

Partidas e odds:
${sample}

Critérios:
- Odds <1.30: mercado eficiente, evitar
- Odds 1.50–2.20: buscar valor e equilíbrio
- Odds >2.50: verificar se é value real ou apenas underdog
- Discrepâncias entre bookmakers = sinal de value

Responda SOMENTE com JSON válido, sem markdown:
{
  "suggestions": [
    {
      "match": "Time A vs Time B",
      "home_team": "Time A",
      "away_team": "Time B",
      "type": "seleção clara",
      "odd": 1.85,
      "confidence": 72,
      "reasoning": "análise objetiva em português, max 90 chars",
      "is_value_bet": false
    }
  ],
  "insight": "insight geral sobre o conjunto de jogos, 1 frase"
}`;

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1500,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = response.content
    .map((c) => (c.type === 'text' ? c.text : ''))
    .join('')
    .replace(/```json|```/g, '')
    .trim();

  return JSON.parse(text) as {
    suggestions: Array<{
      match: string;
      home_team: string;
      away_team: string;
      type: string;
      odd: number;
      confidence: number;
      reasoning: string;
      is_value_bet: boolean;
    }>;
    insight: string;
  };
}
