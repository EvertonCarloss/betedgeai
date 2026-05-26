const BASE_URL = 'https://api.the-odds-api.com/v4'

export async function fetchOdds(sport: string, market: string, region = 'eu') {
  const key = process.env.ODDS_API_KEY
  if (!key) throw new Error('ODDS_API_KEY não configurada')

  const url = `${BASE_URL}/sports/${sport}/odds/?apiKey=${key}&regions=${region}&markets=${market}&oddsFormat=decimal&dateFormat=iso`
  const res = await fetch(url, { next: { revalidate: 300 } })

  const remaining = res.headers.get('x-requests-remaining')
  const used = res.headers.get('x-requests-used')

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message || `Odds API error: ${res.status}`)
  }

  const data = await res.json()
  return { games: data, remaining, used }
}

export async function fetchScores(sport: string) {
  const key = process.env.ODDS_API_KEY
  if (!key) throw new Error('ODDS_API_KEY não configurada')

  const url = `${BASE_URL}/sports/${sport}/scores/?apiKey=${key}&daysFrom=1`
  const res = await fetch(url, { next: { revalidate: 60 } })

  if (!res.ok) throw new Error(`Scores API error: ${res.status}`)
  return res.json()
}

export async function fetchSports() {
  const key = process.env.ODDS_API_KEY
  if (!key) throw new Error('ODDS_API_KEY não configurada')

  const url = `${BASE_URL}/sports/?apiKey=${key}`
  const res = await fetch(url, { next: { revalidate: 3600 } })
  if (!res.ok) throw new Error(`Sports API error: ${res.status}`)
  return res.json()
}
