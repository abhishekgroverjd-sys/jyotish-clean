'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Database, Search, Download, BarChart2, Star } from 'lucide-react'

const nav = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/charts', icon: Database, label: 'Charts' },
  { href: '/search', icon: Search, label: 'Search & Filter' },
  { href: '/import', icon: Download, label: 'Import' },
  { href: '/analytics', icon: BarChart2, label: 'Analytics' },
]

export default function Sidebar() {
  const pathname = usePathname()
  return (
    <aside className="w-56 min-h-screen bg-ink-900 border-r border-ink-700 flex flex-col flex-shrink-0">
      <div className="px-5 py-6 border-b border-ink-700">
        <div className="flex items-center gap-2">
          <Star className="w-4 h-4 text-gold" fill="currentColor" />
          <span className="font-display text-gold text-sm tracking-widest uppercase">Jyotish</span>
        </div>
        <p className="text-silver text-xs mt-1 opacity-40">Research Platform</p>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {nav.map(({ href, icon: Icon, label }) => {
          const active = pathname.startsWith(href)
          return (
            <Link key={href} href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all
                ${active ? 'bg-ink-700 text-gold border border-ink-600' : 'text-silver opacity-60 hover:opacity-100 hover:bg-ink-800'}`}>
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>
      <div className="px-5 py-4 border-t border-ink-700">
        <p className="text-silver text-xs opacity-20 font-mono">v1.0.0</p>
      </div>
    </aside>
  )
}
