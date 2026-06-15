'use client'

import React, { useState } from 'react'
import { useStore } from '@/lib/store'
import { ROLES, STATUS_LABELS } from '@/lib/mock-data'
import type { Order, OrderItem } from '@/lib/mock-data'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

const STATUS_STYLE: Record<OrderItem['status'], string> = {
  pending:   'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  shipped:   'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
}

function OrderStatusBadge({ status }: { status: OrderItem['status'] }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLE[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  )
}

function getOrderOverallStatus(order: Order): OrderItem['status'] {
  const statuses = order.items.map((i) => i.status)
  if (statuses.every((s) => s === 'delivered')) return 'delivered'
  if (statuses.some((s) => s === 'cancelled')) return 'cancelled'
  if (statuses.some((s) => s === 'shipped')) return 'shipped'
  if (statuses.some((s) => s === 'confirmed')) return 'confirmed'
  return 'pending'
}

export default function HistoryPage() {
  const orders = useStore((s) => s.orders)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [selected, setSelected] = useState<Order | null>(null)

  const sorted = [...orders].sort((a, b) => b.date.localeCompare(a.date))

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">История заказов</h1>
        <p className="text-sm text-gray-500 mt-0.5">Все заявки и их статусы</p>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <div className="text-4xl">📭</div>
          <p className="text-gray-500 text-lg">Заказов пока нет</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="w-8 px-4 py-3"></th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">№ заявки</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Дата</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Роль</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Позиций</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Сумма</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Статус</th>
                <th className="w-24 px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sorted.map((order) => {
                const isOpen = expanded === order.id
                const overallStatus = getOrderOverallStatus(order)
                const roleLabel = ROLES.find((r) => r.id === order.role)?.label ?? order.role
                const total = order.items.reduce((s, i) => s + (i.price ?? 0) * i.quantity, 0)

                return (
                  <React.Fragment key={order.id}>
                    <tr
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => setExpanded(isOpen ? null : order.id)}
                    >
                      <td className="px-4 py-3 text-gray-400 text-xs">
                        {isOpen ? '▼' : '▶'}
                      </td>
                      <td className="px-4 py-3 font-medium text-blue-600">{order.number}</td>
                      <td className="px-4 py-3 text-gray-600">
                        {new Date(order.date).toLocaleDateString('ru-RU')}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{roleLabel}</td>
                      <td className="px-4 py-3 text-gray-600">{order.items.length}</td>
                      <td className="px-4 py-3 text-gray-600">
                        {total > 0 ? `${total.toLocaleString()} ₽` : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <OrderStatusBadge status={overallStatus} />
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={(e) => { e.stopPropagation(); setSelected(order) }}
                          className="text-xs text-blue-600 hover:underline"
                        >
                          Подробнее
                        </button>
                      </td>
                    </tr>

                    {/* Expanded rows */}
                    {isOpen && order.items.map((item, idx) => (
                      <tr key={`${order.id}-${idx}`} className="bg-blue-50/30">
                        <td></td>
                        <td colSpan={2} className="px-6 py-2 text-gray-700 font-medium pl-8">
                          {item.name}
                        </td>
                        <td className="px-4 py-2 text-gray-500">{item.supplier}</td>
                        <td className="px-4 py-2 text-gray-600">
                          {item.quantity} {item.unit}
                        </td>
                        <td className="px-4 py-2 text-gray-600">
                          {item.price ? `${(item.price * item.quantity).toLocaleString()} ₽` : '—'}
                        </td>
                        <td className="px-4 py-2">
                          <OrderStatusBadge status={item.status} />
                        </td>
                        <td className="px-4 py-2 text-xs text-gray-400">{item.comment ?? ''}</td>
                      </tr>
                    ))}
                  </React.Fragment>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Order detail modal */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>Заявка {selected.number}</DialogTitle>
              </DialogHeader>
              <div className="flex gap-4 text-sm text-gray-500 -mt-2">
                <span>Дата: {new Date(selected.date).toLocaleDateString('ru-RU')}</span>
                <span>Роль: {ROLES.find((r) => r.id === selected.role)?.label}</span>
              </div>

              <div className="mt-4 space-y-2">
                {selected.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start justify-between p-3 rounded-lg border border-gray-100 bg-gray-50"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{item.supplier}</p>
                      {item.comment && (
                        <p className="text-xs text-gray-400 mt-0.5 italic">"{item.comment}"</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-700">
                        {item.quantity} {item.unit}
                        {item.price && (
                          <span className="text-gray-500 ml-2">× {item.price} ₽</span>
                        )}
                      </p>
                      {item.price && (
                        <p className="text-sm font-medium text-gray-900">
                          {(item.price * item.quantity).toLocaleString()} ₽
                        </p>
                      )}
                      <div className="mt-1">
                        <OrderStatusBadge status={item.status} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {selected.items.some((i) => i.price) && (
                <div className="border-t border-gray-200 pt-3 flex justify-between text-sm font-semibold text-gray-800">
                  <span>Итого</span>
                  <span>
                    {selected.items
                      .reduce((s, i) => s + (i.price ?? 0) * i.quantity, 0)
                      .toLocaleString()}{' '}
                    ₽
                  </span>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
