'use client'

import { useRouter } from 'next/navigation'
import { useStore } from '@/lib/store'
import { ROLES } from '@/lib/mock-data'
import type { Role } from '@/lib/mock-data'

const ROLE_ICONS: Record<Role, string> = {
  kitchen: '🍳',
  bar: '🍸',
  hall: '🪑',
  admin: '👤',
}

export default function RolePage() {
  const router = useRouter()
  const setRole = useStore((s) => s.setRole)

  const handleSelect = (role: Role) => {
    setRole(role)
    router.push('/order')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-blue-200 to-indigo-300">
      <div className="bg-white rounded-2xl shadow-xl p-10 w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="text-2xl font-bold text-blue-600 mb-2">АвтоСнаб</div>
          <h1 className="text-xl font-semibold text-gray-800">Выберите роль</h1>
          <p className="text-sm text-gray-500 mt-1">Кафе Центральное</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {ROLES.map((r) => (
            <button
              key={r.id}
              onClick={() => handleSelect(r.id)}
              className="flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-gray-100 hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer group"
            >
              <span className="text-3xl">{ROLE_ICONS[r.id]}</span>
              <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700">
                {r.label}
              </span>
            </button>
          ))}
        </div>

        <p className="text-xs text-gray-400 text-center mt-6">
          Система заказа товаров · АвтоСнаб
        </p>
      </div>
    </div>
  )
}
