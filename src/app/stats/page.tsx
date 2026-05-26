'use client';
import { useBets } from '@/hooks/useBets';
import { useProfile } from '@/hooks/useProfile';
import { StatCard } from '@/components/ui/StatCard';
import { Card, CardTitle } from '@/components/ui/Card';
import { formatPercent, formatCurrency, calcROI } from '@/lib/utils';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { BarChart2 } from 'lucide-react';

export default function StatsPage() {
  const { bets, stats } = useBets();
  const { profile } = useProfile();
  const resolved = bets.filter((b) => b.outcome !== 'pending');
  const won = bets.filter((b) => b.outcome === 'won');
  const yield_ = resolved.length ? stats.roi / resolved.length : 0;
  const avgOdd = resolved.length
    ? resolved.reduce((a, b) => a + b.total_odd, 0) / resolved.length
    : 0;

  // Odds range analysis
  const ranges = [
    { label: '1.00–1.49', min: 1, max: 1.5 },
    { label: '1.50–1.99', min: 1.5, max: 2 },
    { label: '2.00–2.99', min: 2, max: 3 },
    { label: '3.00+', min: 3, max: 999 },
  ];
  const oddRangeData = ranges
    .map((r) => {
      const inRange = resolved.filter(
        (b) => b.total_odd >= r.min && b.total_odd < r.max,
      );
      const wonRange = inRange.filter((b) => b.outcome === 'won');
      return {
        label: r.label,
        acerto: inRange.length
          ? Math.round((wonRange.length / inRange.length) * 100)
          : 0,
        total: inRange.length,
      };
    })
    .filter((d) => d.total > 0);

  // Monthly data
  const monthlyMap: Record<string, number> = {};
  bets.forEach((b) => {
    const d = new Date(b.created_at);
    const key = `${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
    monthlyMap[key] = (monthlyMap[key] || 0) + 1;
  });
  const monthlyData = Object.entries(monthlyMap)
    .slice(-6)
    .map(([mes, total]) => ({ mes, total }));

  // Sport breakdown
  const sportMap: Record<
    string,
    { won: number; total: number; stake: number; ret: number }
  > = {};
  const sportNames: Record<string, string> = {
    '⚽': 'Futebol',
    '🏀': 'Basquete',
    '🥊': 'MMA',
    '🎾': 'Tênis',
    '🏆': 'Outro',
  };
  resolved.forEach((b) => {
    const k = b.sport_icon || '🏆';
    if (!sportMap[k]) sportMap[k] = { won: 0, total: 0, stake: 0, ret: 0 };
    sportMap[k].total++;
    sportMap[k].stake += b.stake;
    if (b.outcome === 'won') {
      sportMap[k].won++;
      sportMap[k].ret += b.real_return ?? b.potential_return;
    }
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2 mb-1">
        <BarChart2 size={16} className="text-accent" />
        <h1 className="font-display font-bold text-white">Estatísticas</h1>
      </div>

      <div className="grid grid-cols-4 gap-3">
        <StatCard
          label="ROI geral"
          value={resolved.length ? formatPercent(stats.roi) : '—'}
          sub="retorno s/ investimento"
          color={stats.roi >= 0 ? 'green' : 'red'}
        />
        <StatCard
          label="Winrate"
          value={resolved.length ? `${stats.hitRate.toFixed(0)}%` : '—'}
          sub="apostas ganhas / total"
          color={stats.hitRate >= 50 ? 'green' : 'red'}
        />
        <StatCard
          label="Yield médio"
          value={resolved.length ? formatPercent(yield_) : '—'}
          sub="lucro por aposta"
          color={yield_ >= 0 ? 'green' : 'red'}
        />
        <StatCard
          label="Odd média"
          value={resolved.length ? avgOdd.toFixed(2) : '—'}
          sub="nas apostas resolvidas"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardTitle>Acerto por odd</CardTitle>
          {oddRangeData.length ? (
            <div className="space-y-2">
              {oddRangeData.map((d) => (
                <div key={d.label} className="flex items-center gap-2 text-xs">
                  <span className="w-20 text-txt-2 flex-shrink-0">
                    {d.label}
                  </span>
                  <div className="flex-1 h-1.5 bg-border rounded overflow-hidden">
                    <div
                      className="h-full bg-warn rounded"
                      style={{ width: `${d.acerto}%` }}
                    />
                  </div>
                  <span className="text-txt-3 w-8 text-right">{d.acerto}%</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-txt-3 text-xs py-4">
              Sem dados suficientes.
            </div>
          )}
        </Card>

        <Card>
          <CardTitle>Apostas por mês</CardTitle>
          {monthlyData.length ? (
            <ResponsiveContainer width="100%" height={130}>
              <BarChart data={monthlyData}>
                <XAxis
                  dataKey="mes"
                  tick={{ fill: '#3d5168', fontSize: 9 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fill: '#3d5168', fontSize: 9 }}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    background: '#0e1318',
                    border: '1px solid #1c2530',
                    borderRadius: 4,
                    fontSize: 10,
                  }}
                />
                <Bar
                  dataKey="total"
                  fill="rgba(0,212,255,0.3)"
                  stroke="#00d4ff"
                  strokeWidth={1}
                  radius={[2, 2, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-txt-3 text-xs py-10 text-center">
              Sem dados.
            </div>
          )}
        </Card>

        <Card>
          <CardTitle>Por esporte</CardTitle>
          {Object.keys(sportMap).length ? (
            <div className="space-y-3">
              {Object.entries(sportMap).map(([icon, d]) => {
                const pct = Math.round((d.won / d.total) * 100);
                const roi = calcROI(d.stake, d.ret);
                return (
                  <div key={icon} className="text-xs">
                    <div className="flex justify-between text-txt-2 mb-1">
                      <span>
                        {icon} {sportNames[icon] || icon}
                      </span>
                      <span
                        className={roi >= 0 ? 'text-success' : 'text-danger'}
                      >
                        {formatPercent(roi)} ROI
                      </span>
                    </div>
                    <div className="flex-1 h-1.5 bg-border rounded overflow-hidden">
                      <div
                        className="h-full bg-accent rounded"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="text-txt-3 mt-0.5">
                      {d.won}/{d.total} ganhas ({pct}%)
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-txt-3 text-xs py-4">
              Resolva apostas para ver.
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
