import type { Metadata } from 'next'
import { Syne, DM_Mono } from 'next/font/google'
import './globals.css'

const syne = Syne({ subsets: ['latin'], variable: '--font-syne', weight: ['400','500','700','800'] })
const dmMono = DM_Mono({ subsets: ['latin'], variable: '--font-dm-mono', weight: ['300','400','500'] })

export const metadata: Metadata = {
  title: 'BetEdge AI — Análise Inteligente de Apostas',
  description: 'Sugestões de apostas baseadas em estatísticas reais e análise de IA',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${syne.variable} ${dmMono.variable}`}>
      <body className="bg-bg font-mono text-txt antialiased">{children}</body>
    </html>
  )
}
