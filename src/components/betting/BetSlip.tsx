'use client';
import { useAppStore } from '@/store';
import { useBets } from '@/hooks/useBets';
import { useProfile } from '@/hooks/useProfile';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { X, Check, Trash2, Receipt } from 'lucide-react';
import { useState } from 'react';

export function BetSlip() {
  const { slip, removeFromSlip, clearSlip } = useAppStore();
  const { addBet } = useBets();
  const { profile } = useProfile();
  const [stake, setStake] = useState(profile?.default_stake ?? 50);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const totalOdd = slip.reduce((a, b) => a * b.odd, 1);
  const potReturn = stake * totalOdd;
  const icons = Array.from(new Set(slip.map((b) => b.sport_icon)));

  async function confirm() {
    if (!slip.length) return;
    setLoading(true);
    try {
      await addBet({
        items: slip.map((b) => ({
          match: b.match,
          type: b.type,
          odd: b.odd,
          sport_icon: b.sport_icon,
        })),
        total_odd: parseFloat(totalOdd.toFixed(2)),
        stake,
        potential_return: parseFloat(potReturn.toFixed(2)),
        outcome: 'pending',
        sport_icon: icons[0] || '🏆',
      });
      setSuccess(true);
      clearSlip();
      setTimeout(() => setSuccess(false), 3000);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-bg-2 border border-border rounded p-4 sticky top-0">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display font-bold text-white text-sm flex items-center gap-2">
          <Receipt size={14} className="text-accent" />
          Cupom
        </h3>
        <span className="text-txt-3 text-xs">({slip.length}/6)</span>
      </div>

      {!slip.length ? (
        <div className="text-center py-8 text-txt-3">
          <Receipt size={24} className="mx-auto mb-2 opacity-30" />
          <p className="text-xs">Selecione sugestões para adicionar ao cupom</p>
        </div>
      ) : (
        <>
          <div className="space-y-2 mb-3">
            {slip.map((b) => (
              <div
                key={b.id}
                className="bg-bg border border-border rounded p-2.5 relative pr-7"
              >
                <div className="font-display font-bold text-white text-xs">
                  {b.match}
                </div>
                <div className="text-txt-2 text-[11px] mt-0.5">{b.type}</div>
                <div className="text-accent text-xs font-medium mt-1">
                  {b.odd.toFixed(2)}
                </div>
                <button
                  onClick={() => removeFromSlip(b.id)}
                  className="absolute top-2 right-2 text-txt-3 hover:text-danger transition-colors"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>

          <div className="border-t border-border pt-3 space-y-2">
            <div className="flex justify-between text-xs text-txt-2">
              <span>Odd total</span>
              <span className="text-white font-medium">
                {totalOdd.toFixed(2)}
              </span>
            </div>
            <div>
              <label className="text-[10px] text-txt-3 uppercase tracking-wider">
                Stake (R$)
              </label>
              <input
                type="number"
                min={1}
                value={stake}
                onChange={(e) => setStake(parseFloat(e.target.value) || 0)}
                className="w-full bg-bg border border-border rounded px-3 py-2 text-sm text-white font-mono outline-none focus:border-accent-2 transition-colors mt-1"
              />
            </div>
            <div className="flex justify-between text-xs text-txt-2">
              <span>Retorno potencial</span>
              <span className="text-success font-display font-bold text-base">
                {formatCurrency(potReturn)}
              </span>
            </div>

            {success && (
              <div className="bg-success/10 border border-success/30 rounded p-2 text-success text-xs text-center">
                <Check size={12} className="inline mr-1" />
                Aposta registrada!
              </div>
            )}

            <Button
              variant="primary"
              className="w-full justify-center"
              onClick={confirm}
              disabled={loading}
            >
              <Check size={13} />
              {loading ? 'Salvando...' : 'Confirmar aposta'}
            </Button>
            <Button
              variant="danger"
              className="w-full justify-center"
              onClick={clearSlip}
            >
              <Trash2 size={13} />
              Limpar cupom
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
