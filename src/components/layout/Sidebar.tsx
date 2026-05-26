'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAppStore } from '@/store'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard, Sparkles, Play, History,
  BarChart2, Settings, LogOut, Wifi, WifiOff
} from 'lucide-react'

const NAV = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/suggestions', icon: Sparkles, label: 'Sugestões IA' },
  { href: '/live', icon: Play, label: 'Ao vivo' },
  { href: '/history', icon: History, label: 'Histórico' },
  { href: '/stats', icon: BarChart2, label: 'Estatísticas' },
  { href: '/settings', icon: Settings, label: 'Configurações' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { profile, apiRemaining } = useAppStore()
  const supabase = createClient()
  const hasKey = !!profile?.odds_api_key

  async function signOut() {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  return (
    <aside className="w-[220px] bg-bg-2 border-r border-border flex flex-col flex-shrink-0 h-screen">
      <div className="px-5 py-4 border-b border-border">
        <div className="font-display font-black text-white text-lg leading-tight">
          Bet<span className="text-accent">Edge</span> AI
        </div>
        <div className="text-txt-3 text-[10px] tracking-widest uppercase mt-0.5">análise inteligente</div>
      </div>

      <nav className="flex-1 py-3">
        {NAV.map(({ href, icon: Icon, label }) => (
          <Link key={href} href={href}
            className={cn(
              'flex items-center gap-2.5 px-5 py-2.5 text-xs font-mono border-l-2 border-transparent transition-all',
              pathname === href
                ? 'text-accent border-accent bg-accent/5'
                : 'text-txt-2 hover:text-txt hover:bg-white/[0.02]'
            )}>
            <Icon size={15} />
            {label}
          </Link>
        ))}
      </nav>

      <div className="px-5 py-4 border-t border-border space-y-2">
        <div className="flex items-center gap-2 text-[11px]">
          {hasKey
            ? <Wifi size={12} className="text-success" />
            : <WifiOff size={12} className="text-txt-3" />}
          <span className={hasKey ? 'text-success' : 'text-txt-3'}>
            {hasKey ? 'API conectada' : 'API desconectada'}
          </span>
        </div>
        {apiRemaining && (
          <div className="text-[10px] text-txt-3">{apiRemaining} req. restantes</div>
        )}
        <button onClick={signOut}
          className="flex items-center gap-2 text-txt-3 hover:text-danger text-xs transition-colors w-full mt-1">
          <LogOut size={13} />
          Sair
        </button>
      </div>
    </aside>
  )
}
