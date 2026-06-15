'use client'

import { useState } from 'react'
import { useStore } from '@/lib/store'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ROLES } from '@/lib/mock-data'

const STATUS_COLOR: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
}

export default function OrderPage() {
  const router = useRouter()
  const role = useStore((s) => s.role)
  const favorites = useStore((s) => s.favorites)
  const updateFavoriteQuantity = useStore((s) => s.updateFavoriteQuantity)
  const updateFavoriteComment = useStore((s) => s.updateFavoriteComment)
  const removeFromFavorites = useStore((s) => s.removeFromFavorites)
  const submitOrder = useStore((s) => s.submitOrder)
  const resetOrderForm = useStore((s) => s.resetOrderForm)

  const [showNotFound, setShowNotFound] = useState(false)
  const [notFoundForm, setNotFoundForm] = useState({ name: '', quantity: '', unit: '', comment: '', role: '' })
  const [submitted, setSubmitted] = useState(false)

  const roleLabel = ROLES.find((r) => r.id === role)?.label ?? ''

  const filledItems = favorites.filter((f) => f.quantity > 0)
  const total = filledItems.reduce((sum, f) => sum + (f.price ?? 0) * f.quantity, 0)

  const handleSubmit = () => {
    if (!filledItems.length) return
    submitOrder()
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      router.push('/history')
    }, 2000)
  }

  const handleNotFoundSubmit = () => {
    setShowNotFound(false)
    setNotFoundForm({ name: '', quantity: '', unit: '', comment: '', role: '' })
  }

  if (!role) {
    router.push('/')
    return null
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Новый заказ</h1>
          <p className="text-sm text-gray-500 mt-0.5">Роль: {roleLabel}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push('/catalog')}>
            + Добавить из каталога
          </Button>
          <Button variant="outline" onClick={() => setShowNotFound(true)}>
            Не нашли товар?
          </Button>
        </div>
      </div>

      {submitted ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <div className="text-5xl">✅</div>
          <p className="text-xl font-semibold text-gray-800">Заявка отправлена!</p>
          <p className="text-sm text-gray-500">Переходим в историю заказов...</p>
        </div>
      ) : (
        <>
          {favorites.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div className="text-4xl">📭</div>
              <p className="text-gray-500 text-lg">Список избранных товаров пуст</p>
              <Button onClick={() => router.push('/catalog')}>Добавить товары из каталога</Button>
            </div>
          ) : (
            <>
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-4">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Товар</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Поставщик</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Ед.</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Цена</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600 w-28">Кол-во</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Комментарий</th>
                      <th className="w-8"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {favorites.map((item) => (
                      <tr key={item.id} className={item.quantity > 0 ? 'bg-blue-50/30' : ''}>
                        <td className="px-4 py-3 font-medium text-gray-900">{item.name}</td>
                        <td className="px-4 py-3 text-gray-600">{item.supplier}</td>
                        <td className="px-4 py-3 text-gray-500">{item.unit}</td>
                        <td className="px-4 py-3 text-gray-600">
                          {item.price ? `${item.price} ₽` : '—'}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => updateFavoriteQuantity(item.id, Math.max(0, item.quantity - 1))}
                              className="w-7 h-7 rounded-md border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 text-base"
                            >
                              −
                            </button>
                            <Input
                              type="number"
                              min={0}
                              value={item.quantity || ''}
                              placeholder="0"
                              onChange={(e) => updateFavoriteQuantity(item.id, Number(e.target.value))}
                              className="w-16 text-center h-7 px-1"
                            />
                            <button
                              onClick={() => updateFavoriteQuantity(item.id, item.quantity + 1)}
                              className="w-7 h-7 rounded-md border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 text-base"
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Input
                            placeholder="Комментарий..."
                            value={item.comment}
                            onChange={(e) => updateFavoriteComment(item.id, e.target.value)}
                            className="h-7 text-xs"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => removeFromFavorites(item.id)}
                            className="text-gray-300 hover:text-red-400 transition-colors"
                            title="Удалить из избранного"
                          >
                            ✕
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between bg-white rounded-xl border border-gray-200 px-6 py-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-500">
                    Выбрано позиций: <span className="font-semibold text-gray-800">{filledItems.length}</span>
                  </span>
                  {total > 0 && (
                    <span className="text-sm text-gray-500">
                      Сумма: <span className="font-semibold text-gray-800">{total.toLocaleString()} ₽</span>
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={resetOrderForm}>
                    Сбросить
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={filledItems.length === 0}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Отправить заявку
                  </Button>
                </div>
              </div>
            </>
          )}
        </>
      )}

      {/* Modal: товар не найден */}
      <Dialog open={showNotFound} onOpenChange={setShowNotFound}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Не нашли товар?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-500 -mt-2">Опишите нужный товар и мы добавим его в каталог</p>
          <div className="space-y-3 mt-2">
            <div>
              <label className="text-sm font-medium text-gray-700">Название товара *</label>
              <Input
                placeholder="Например: Трюфельное масло"
                value={notFoundForm.name}
                onChange={(e) => setNotFoundForm((f) => ({ ...f, name: e.target.value }))}
                className="mt-1"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-gray-700">Количество</label>
                <Input
                  type="number"
                  placeholder="0"
                  value={notFoundForm.quantity}
                  onChange={(e) => setNotFoundForm((f) => ({ ...f, quantity: e.target.value }))}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Единица измерения</label>
                <Input
                  placeholder="кг, л, шт..."
                  value={notFoundForm.unit}
                  onChange={(e) => setNotFoundForm((f) => ({ ...f, unit: e.target.value }))}
                  className="mt-1"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Подразделение</label>
              <div className="flex gap-2 mt-1 flex-wrap">
                {['Кухня', 'Бар', 'Зал'].map((d) => (
                  <button
                    key={d}
                    onClick={() => setNotFoundForm((f) => ({ ...f, role: d }))}
                    className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                      notFoundForm.role === d
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Комментарий</label>
              <Textarea
                placeholder="Дополнительная информация..."
                value={notFoundForm.comment}
                onChange={(e) => setNotFoundForm((f) => ({ ...f, comment: e.target.value }))}
                className="mt-1 resize-none"
                rows={3}
              />
            </div>
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleNotFoundSubmit}
              disabled={!notFoundForm.name}
            >
              Отправить запрос
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
