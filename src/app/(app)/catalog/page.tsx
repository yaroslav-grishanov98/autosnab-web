'use client'

import { useState } from 'react'
import { useStore } from '@/lib/store'
import { MOCK_CATALOG } from '@/lib/mock-data'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useRouter } from 'next/navigation'

const CATEGORIES = ['Все', ...Array.from(new Set(MOCK_CATALOG.map((p) => p.category)))]

export default function CatalogPage() {
  const router = useRouter()
  const favorites = useStore((s) => s.favorites)
  const addToFavorites = useStore((s) => s.addToFavorites)
  const removeFromFavorites = useStore((s) => s.removeFromFavorites)

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('Все')
  const [added, setAdded] = useState<string | null>(null)

  const favoriteIds = new Set(favorites.map((f) => f.id))

  const filtered = MOCK_CATALOG.filter((p) => {
    const matchCat = category === 'Все' || p.category === category
    const q = search.toLowerCase()
    const matchSearch = !q || p.name.toLowerCase().includes(q) || p.supplier.toLowerCase().includes(q)
    return matchCat && matchSearch
  })

  const handleToggle = (product: typeof MOCK_CATALOG[0]) => {
    if (favoriteIds.has(product.id)) {
      removeFromFavorites(product.id)
    } else {
      addToFavorites(product)
      setAdded(product.id)
      setTimeout(() => setAdded(null), 1500)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Каталог товаров</h1>
          <p className="text-sm text-gray-500 mt-0.5">Добавьте товары в избранное для быстрого заказа</p>
        </div>
        <Button onClick={() => router.push('/order')} className="bg-blue-600 hover:bg-blue-700 text-white">
          ← К заказу
        </Button>
      </div>

      {/* Search + filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
        <Input
          placeholder="Поиск по названию или поставщику..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-3"
        />
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                category === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product grid */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="text-4xl">🔍</div>
            <p className="text-gray-500">Товары не найдены</p>
            <p className="text-sm text-gray-400">Попробуйте другой запрос или категорию</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Товар</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Поставщик</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Категория</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Ед.</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Цена</th>
                <th className="w-36"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((product) => {
                const isFav = favoriteIds.has(product.id)
                const justAdded = added === product.id
                return (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900">{product.name}</td>
                    <td className="px-4 py-3 text-gray-600">{product.supplier}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{product.unit}</td>
                    <td className="px-4 py-3 text-gray-600">
                      {product.price ? `${product.price} ₽` : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggle(product)}
                        className={`text-sm px-3 py-1.5 rounded-lg border transition-all font-medium ${
                          isFav
                            ? 'border-blue-200 bg-blue-50 text-blue-700 hover:bg-red-50 hover:text-red-600 hover:border-red-200'
                            : justAdded
                            ? 'border-green-200 bg-green-50 text-green-700'
                            : 'border-gray-200 text-gray-600 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700'
                        }`}
                      >
                        {isFav ? '★ В избранном' : justAdded ? '✓ Добавлено' : '☆ В избранное'}
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      <p className="text-xs text-gray-400 mt-3 text-right">
        Найдено товаров: {filtered.length} из {MOCK_CATALOG.length}
      </p>
    </div>
  )
}
