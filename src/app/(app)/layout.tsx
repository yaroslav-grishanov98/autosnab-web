'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useStore } from '@/lib/store'
import { ROLES } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

const NAV = [
  { href: '/order', label: 'Заказ', icon: '📋' },
  { href: '/catalog', label: 'Каталог', icon: '🔍' },
  { href: '/history', label: 'История', icon: '🕒' },
]

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const role = useStore((s) => s.role)
  const restaurantName = useStore((s) => s.restaurantName)
  const setRole = useStore((s) => s.setRole)
  const roleLabel = ROLES.find((r) => r.id === role)?.label ?? 'Гость'

  const handleLogout = () => {
    setRole(null as never)
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <span className="text-lg font-bold text-blue-600">АвтоСнаб</span>
          <nav className="flex items-center gap-1">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className={cn(
                  'flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  pathname === n.href
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                )}
              >
                <span>{n.icon}</span>
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-800">{restaurantName}</p>
            <p className="text-xs text-gray-500">{roleLabel}</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-xs text-gray-400 hover:text-gray-700 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors"
          >
            Сменить роль
          </button>
        </div>
      </header>

      <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  )
}
