'use client'
import { useState, useEffect } from 'react'
import { useProfile } from '@/hooks/useProfile'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Card, CardTitle } from '@/components/ui/Card'
import { Settings, Key, Brain, Wallet, Database, Save, Download } from 'lucide-react'
import { useBets } from '@/hooks/useBets'

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle}
      className={`w-9 h-5 rounded-full relative transition-colors flex-shrink-0 ${on ? 'bg-accent-2' : 'bg-border-2'}`}>
      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${on ? 'left-4' : 'left-0.5'}`} />
    </button>
  )
}

export default function SettingsPage() {
  const { profile, updateProfile } = useProfile()
  const { bets } = useBets()
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    odds_api_key: '',
    region: 'eu',
    bankroll: 1000,
    default_stake: 50,
    settings: { auto_analyze: false, value_bet: true, high_conf_only: false, stop_loss_alert: true }
  })

  useEffect(() => {
    if (profile) setForm({
      odds_api_key: profile.odds_api_key || '',
      region: profile.region || 'eu',
      bankroll: profile.bankroll || 1000,
      default_stake: profile.default_stake || 50,
      settings: { ...form.settings, ...profile.settings }
    })
  }, [profile])

  async function save() {
    setSaving(true)
    await updateProfile({ ...form })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  function toggleSetting(key: keyof typeof form.settings) {
    setForm(f => ({ ...f, settings: { ...f.settings, [key]: !f.settings[key] } }))
  }

  function exportData() {
    const blob = new Blob([JSON.stringify(bets, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'betedge-historico.json'; a.click()
    URL.revokeObjectURL(url)
  }

  const settingRows = [
    { key: 'auto_analyze' as const, label: 'Análise automática ao trocar esporte', sub: 'Busca e analisa automaticamente' },
    { key: 'value_bet' as const, label: 'Detectar value bets', sub: 'IA identifica odds subestimadas' },
    { key: 'high_conf_only' as const, label: 'Apenas alta confiança', sub: 'Filtra sugestões abaixo de 65%' },
    { key: 'stop_loss' as const, label: 'Alertas de stop-loss', sub: 'Avisa ao perder 20% da banca' },
  ]

  return (
    <div className="space-y-5 max-w-3xl">
      <div className="flex items-center gap-2 mb-1">
        <Settings size={16} className="text-accent" />
        <h1 className="font-display font-bold text-white">Configurações</h1>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-4">
          <Card>
            <CardTitle><Key size={14} className="text-accent" />API & Integração</CardTitle>
            <div className="space-y-3">
              <div>
                <label className="text-[10px] text-txt-3 uppercase tracking-wider block mb-1.5">
                  Odds API Key <a href="https://the-odds-api.com" className="text-accent hover:underline">(obter grátis ↗)</a>
                </label>
                <input type="password" value={form.odds_api_key}
                  onChange={e => setForm(f => ({ ...f, odds_api_key: e.target.value }))}
                  placeholder="Cole sua chave aqui..."
                  className="w-full bg-bg border border-border rounded px-3 py-2 text-sm text-txt font-mono outline-none focus:border-accent-2 transition-colors" />
              </div>
              <Select label="Região de odds" value={form.region} onChange={e => setForm(f => ({ ...f, region: e.target.value }))}>
                <option value="eu">Europa (eu)</option>
                <option value="us">EUA (us)</option>
                <option value="uk">Reino Unido (uk)</option>
                <option value="au">Austrália (au)</option>
              </Select>
            </div>
          </Card>

          <Card>
            <CardTitle><Brain size={14} className="text-accent" />Comportamento da IA</CardTitle>
            <div className="space-y-1">
              {settingRows.map(({ key, label, sub }) => (
                <div key={key} className="flex items-center justify-between py-2.5 border-b border-border last:border-0">
                  <div>
                    <div className="text-txt text-xs">{label}</div>
                    <div className="text-txt-3 text-[10px] mt-0.5">{sub}</div>
                  </div>
                  <Toggle on={form.settings[key as keyof typeof form.settings] ?? false} onToggle={() => toggleSetting(key as keyof typeof form.settings)} />
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardTitle><Wallet size={14} className="text-accent" />Gestão de banca</CardTitle>
            <div className="space-y-3">
              <div>
                <label className="text-[10px] text-txt-3 uppercase tracking-wider block mb-1.5">Banca inicial (R$)</label>
                <input type="number" value={form.bankroll} onChange={e => setForm(f => ({ ...f, bankroll: parseFloat(e.target.value) || 0 }))}
                  className="w-full bg-bg border border-border rounded px-3 py-2 text-sm text-txt font-mono outline-none focus:border-accent-2 transition-colors" />
              </div>
              <div>
                <label className="text-[10px] text-txt-3 uppercase tracking-wider block mb-1.5">Stake padrão (R$)</label>
                <input type="number" value={form.default_stake} onChange={e => setForm(f => ({ ...f, default_stake: parseFloat(e.target.value) || 0 }))}
                  className="w-full bg-bg border border-border rounded px-3 py-2 text-sm text-txt font-mono outline-none focus:border-accent-2 transition-colors" />
              </div>
            </div>
          </Card>

          <Card>
            <CardTitle><Database size={14} className="text-accent" />Dados</CardTitle>
            <div className="text-txt-2 text-xs mb-4 space-y-1">
              <div>Apostas salvas: <span className="text-white">{bets.length}</span></div>
              <div>Email: <span className="text-white">{profile?.email || '—'}</span></div>
            </div>
            <Button onClick={exportData} className="w-full justify-center mb-2">
              <Download size={12} />Exportar histórico JSON
            </Button>
          </Card>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="primary" onClick={save} disabled={saving} className="px-6">
          <Save size={13} />
          {saving ? 'Salvando...' : 'Salvar configurações'}
        </Button>
        {saved && <span className="text-success text-xs">Configurações salvas!</span>}
      </div>
    </div>
  )
}
