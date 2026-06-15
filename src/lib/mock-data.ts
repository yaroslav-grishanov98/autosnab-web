export type Role = 'kitchen' | 'bar' | 'hall' | 'admin'

export const ROLES: { id: Role; label: string }[] = [
  { id: 'kitchen', label: 'Кухня' },
  { id: 'bar', label: 'Бар' },
  { id: 'hall', label: 'Зал' },
  { id: 'admin', label: 'Администратор' },
]

export interface Product {
  id: string
  name: string
  supplier: string
  unit: string
  price?: number
  category: string
}

export interface FavoriteItem extends Product {
  quantity: number
  comment: string
}

export interface OrderItem {
  productId: string
  name: string
  supplier: string
  unit: string
  quantity: number
  price?: number
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  comment?: string
}

export interface Order {
  id: string
  number: string
  date: string
  role: Role
  items: OrderItem[]
  totalAmount?: number
}

export const MOCK_CATALOG: Product[] = [
  { id: '1', name: 'Куриное филе', supplier: 'Агро-Плюс', unit: 'кг', price: 320, category: 'Мясо' },
  { id: '2', name: 'Говядина вырезка', supplier: 'МясоТорг', unit: 'кг', price: 650, category: 'Мясо' },
  { id: '3', name: 'Лосось свежий', supplier: 'РыбаОпт', unit: 'кг', price: 890, category: 'Рыба' },
  { id: '4', name: 'Картофель', supplier: 'ОвощОпт', unit: 'кг', price: 45, category: 'Овощи' },
  { id: '5', name: 'Лук репчатый', supplier: 'ОвощОпт', unit: 'кг', price: 30, category: 'Овощи' },
  { id: '6', name: 'Морковь', supplier: 'ОвощОпт', unit: 'кг', price: 40, category: 'Овощи' },
  { id: '7', name: 'Помидоры', supplier: 'ТеплицаПлюс', unit: 'кг', price: 120, category: 'Овощи' },
  { id: '8', name: 'Огурцы', supplier: 'ТеплицаПлюс', unit: 'кг', price: 90, category: 'Овощи' },
  { id: '9', name: 'Молоко 3.2%', supplier: 'МолокоОпт', unit: 'л', price: 75, category: 'Молочка' },
  { id: '10', name: 'Сливки 33%', supplier: 'МолокоОпт', unit: 'л', price: 180, category: 'Молочка' },
  { id: '11', name: 'Масло сливочное', supplier: 'МолокоОпт', unit: 'кг', price: 550, category: 'Молочка' },
  { id: '12', name: 'Яйца С1', supplier: 'ПтицеФерма', unit: 'шт', price: 12, category: 'Яйца' },
  { id: '13', name: 'Водка Absolut', supplier: 'АлкоОпт', unit: 'бут', price: 950, category: 'Алкоголь' },
  { id: '14', name: 'Вино красное', supplier: 'ВинТорг', unit: 'бут', price: 750, category: 'Алкоголь' },
  { id: '15', name: 'Пиво разливное', supplier: 'ПивоОпт', unit: 'л', price: 120, category: 'Алкоголь' },
  { id: '16', name: 'Сок апельсиновый', supplier: 'НапиткиОпт', unit: 'л', price: 95, category: 'Напитки' },
  { id: '17', name: 'Вода минеральная', supplier: 'НапиткиОпт', unit: 'бут', price: 35, category: 'Напитки' },
  { id: '18', name: 'Кофе Lavazza', supplier: 'КофеТорг', unit: 'кг', price: 1200, category: 'Напитки' },
  { id: '19', name: 'Мука пшеничная', supplier: 'МукаОпт', unit: 'кг', price: 55, category: 'Бакалея' },
  { id: '20', name: 'Сахар', supplier: 'МукаОпт', unit: 'кг', price: 65, category: 'Бакалея' },
  { id: '21', name: 'Соль', supplier: 'МукаОпт', unit: 'кг', price: 20, category: 'Бакалея' },
  { id: '22', name: 'Масло подсолнечное', supplier: 'МаслоОпт', unit: 'л', price: 130, category: 'Бакалея' },
  { id: '23', name: 'Салфетки бумажные', supplier: 'ХозТовары', unit: 'уп', price: 85, category: 'Зал' },
  { id: '24', name: 'Скатерти', supplier: 'ХозТовары', unit: 'шт', price: 350, category: 'Зал' },
]

export const MOCK_FAVORITES: FavoriteItem[] = [
  { ...MOCK_CATALOG[0], quantity: 0, comment: '' },
  { ...MOCK_CATALOG[3], quantity: 0, comment: '' },
  { ...MOCK_CATALOG[8], quantity: 0, comment: '' },
  { ...MOCK_CATALOG[11], quantity: 0, comment: '' },
  { ...MOCK_CATALOG[18], quantity: 0, comment: '' },
]

const STATUS_LABELS: Record<OrderItem['status'], string> = {
  pending: 'Ожидает',
  confirmed: 'Подтверждён',
  shipped: 'В пути',
  delivered: 'Доставлен',
  cancelled: 'Отменён',
}

export { STATUS_LABELS }

export const MOCK_ORDERS: Order[] = [
  {
    id: '1',
    number: 'ЗК-2024-001',
    date: '2024-06-10',
    role: 'kitchen',
    items: [
      { productId: '1', name: 'Куриное филе', supplier: 'Агро-Плюс', unit: 'кг', quantity: 10, price: 320, status: 'delivered' },
      { productId: '4', name: 'Картофель', supplier: 'ОвощОпт', unit: 'кг', quantity: 20, price: 45, status: 'delivered' },
      { productId: '9', name: 'Молоко 3.2%', supplier: 'МолокоОпт', unit: 'л', quantity: 5, price: 75, status: 'delivered' },
    ],
  },
  {
    id: '2',
    number: 'ЗК-2024-002',
    date: '2024-06-11',
    role: 'bar',
    items: [
      { productId: '13', name: 'Водка Absolut', supplier: 'АлкоОпт', unit: 'бут', quantity: 5, price: 950, status: 'confirmed' },
      { productId: '14', name: 'Вино красное', supplier: 'ВинТорг', unit: 'бут', quantity: 12, price: 750, status: 'shipped' },
      { productId: '17', name: 'Вода минеральная', supplier: 'НапиткиОпт', unit: 'бут', quantity: 48, price: 35, status: 'confirmed' },
    ],
  },
  {
    id: '3',
    number: 'ЗК-2024-003',
    date: '2024-06-12',
    role: 'admin',
    items: [
      { productId: '23', name: 'Салфетки бумажные', supplier: 'ХозТовары', unit: 'уп', quantity: 20, price: 85, status: 'pending' },
      { productId: '24', name: 'Скатерти', supplier: 'ХозТовары', unit: 'шт', quantity: 10, price: 350, status: 'pending' },
    ],
  },
  {
    id: '4',
    number: 'ЗК-2024-004',
    date: '2024-06-13',
    role: 'kitchen',
    items: [
      { productId: '2', name: 'Говядина вырезка', supplier: 'МясоТорг', unit: 'кг', quantity: 5, price: 650, status: 'shipped', comment: 'Срочно!' },
      { productId: '19', name: 'Мука пшеничная', supplier: 'МукаОпт', unit: 'кг', quantity: 25, price: 55, status: 'confirmed' },
    ],
  },
  {
    id: '5',
    number: 'ЗК-2024-005',
    date: '2024-06-14',
    role: 'bar',
    items: [
      { productId: '18', name: 'Кофе Lavazza', supplier: 'КофеТорг', unit: 'кг', quantity: 3, price: 1200, status: 'pending' },
      { productId: '16', name: 'Сок апельсиновый', supplier: 'НапиткиОпт', unit: 'л', quantity: 10, price: 95, status: 'pending' },
    ],
  },
]
