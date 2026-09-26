export type Product = {
  id: string
  name: string
  category: string
  price: number
  costPrice?: number
  rating: number
  stock: number
  sku: string
  badge?: string
  description: string
  image: string
  active?: boolean
}

export type Order = {
  id: string
  customer: string
  email: string
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'canceled'
  items: number
  createdAt: string
}

export type Return = {
  id: string
  orderId: string
  customer: string
  reason: string
  status: 'requested' | 'approved' | 'rejected' | 'refunded'
  refundAmount?: number
  createdAt: string
}

export type Sale = {
  id: string
  orderId: string
  revenue: number
  cost?: number
  profit?: number
  channel: string
  createdAt: string
}

export type Discount = {
  id: string
  code: string
  type: 'percentage' | 'fixed'
  value: number
  minOrder?: number
  maxUses?: number
  usedCount: number
  active: boolean
  expiresAt?: string
}

export type Promotion = {
  id: string
  title: string
  description?: string
  bannerUrl?: string
  active: boolean
  startsAt?: string
  endsAt?: string
}

export type Customer = {
  id: string
  name: string
  email: string
  orders: number
  totalSpent: number
  joinedAt: string
}

export const categories = ['Engine', 'Braking', 'Suspension', 'Electrical', 'Exterior']

export const starterProducts: Product[] = [
  { id: 'bp-001', name: 'Vented Performance Rotors', category: 'Braking', price: 189.99, costPrice: 90, rating: 4.9, stock: 18, sku: 'BRK-VPR-001', badge: 'Best seller', description: 'Two-piece vented rotors engineered for confident stopping and consistent heat management.', image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=1000&q=85' },
  { id: 'en-002', name: 'Cold Air Intake System', category: 'Engine', price: 249.0, costPrice: 110, rating: 4.8, stock: 9, sku: 'ENG-CAI-002', badge: 'New', description: 'A direct-fit intake that brings cooler, denser air to your engine for sharper throttle response.', image: 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=1000&q=85' },
  { id: 'su-003', name: 'Adjustable Coilover Kit', category: 'Suspension', price: 899.0, costPrice: 420, rating: 4.7, stock: 5, sku: 'SUS-ACK-003', description: 'Dial in your stance and handling with 32-way damping adjustment and precision spring rates.', image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1000&q=85' },
  { id: 'ex-004', name: 'Forged Track Wheel 18×9', category: 'Exterior', price: 475.0, costPrice: 200, rating: 5, stock: 12, sku: 'EXT-FTW-004', badge: 'Track ready', description: 'Lightweight forged aluminum with a motorsport-inspired split-spoke profile.', image: 'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1000&q=85' },
  { id: 'el-005', name: 'LED Headlight Conversion', category: 'Electrical', price: 129.0, costPrice: 55, rating: 4.6, stock: 24, sku: 'ELE-LHC-005', description: 'Plug-and-play LED conversion with a clean cutoff and road-ready brightness.', image: 'https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=1000&q=85' },
  { id: 'en-006', name: 'Oil Catch Can Pro', category: 'Engine', price: 84.5, costPrice: 35, rating: 4.8, stock: 31, sku: 'ENG-OCC-006', description: 'Protect your intake tract with a baffled, serviceable catch can built for spirited driving.', image: 'https://images.unsplash.com/photo-1504222490345-c075b6008014?auto=format&fit=crop&w=1000&q=85' },
]

export const seedOrders: Order[] = [
  { id: 'ORD-001', customer: 'Thabo Nkosi', email: 'thabo@example.com', total: 1088.99, status: 'delivered', items: 2, createdAt: '2025-01-10' },
  { id: 'ORD-002', customer: 'Lerato Dlamini', email: 'lerato@example.com', total: 249.0, status: 'shipped', items: 1, createdAt: '2025-01-14' },
  { id: 'ORD-003', customer: 'Sipho Mokoena', email: 'sipho@example.com', total: 475.0, status: 'processing', items: 1, createdAt: '2025-01-15' },
  { id: 'ORD-004', customer: 'Nomsa Khumalo', email: 'nomsa@example.com', total: 213.5, status: 'pending', items: 2, createdAt: '2025-01-16' },
]

export const seedReturns: Return[] = [
  { id: 'RET-001', orderId: 'ORD-001', customer: 'Thabo Nkosi', reason: 'Wrong fitment', status: 'approved', refundAmount: 189.99, createdAt: '2025-01-12' },
  { id: 'RET-002', orderId: 'ORD-002', customer: 'Lerato Dlamini', reason: 'Damaged on arrival', status: 'requested', refundAmount: 249.0, createdAt: '2025-01-15' },
]

export const seedSales: Sale[] = [
  { id: 'SAL-001', orderId: 'ORD-001', revenue: 1088.99, cost: 510, profit: 578.99, channel: 'online', createdAt: '2025-01-10' },
  { id: 'SAL-002', orderId: 'ORD-002', revenue: 249.0, cost: 110, profit: 139.0, channel: 'online', createdAt: '2025-01-14' },
  { id: 'SAL-003', orderId: 'ORD-003', revenue: 475.0, cost: 200, profit: 275.0, channel: 'online', createdAt: '2025-01-15' },
]

export const seedDiscounts: Discount[] = [
  { id: 'DIS-001', code: 'LAUNCH20', type: 'percentage', value: 20, minOrder: 200, maxUses: 100, usedCount: 34, active: true, expiresAt: '2025-03-01' },
  { id: 'DIS-002', code: 'FLAT50', type: 'fixed', value: 50, minOrder: 500, usedCount: 8, active: true },
]

export const seedPromotions: Promotion[] = [
  { id: 'PRO-001', title: 'January Performance Sale', description: '20% off all suspension parts', active: true, startsAt: '2025-01-01', endsAt: '2025-01-31' },
  { id: 'PRO-002', title: 'New Arrivals Spotlight', description: 'Featured new engine parts', active: false },
]

export const seedCustomers: Customer[] = [
  { id: 'CUS-001', name: 'Thabo Nkosi', email: 'thabo@example.com', orders: 3, totalSpent: 2340.5, joinedAt: '2024-11-01' },
  { id: 'CUS-002', name: 'Lerato Dlamini', email: 'lerato@example.com', orders: 1, totalSpent: 249.0, joinedAt: '2025-01-14' },
  { id: 'CUS-003', name: 'Sipho Mokoena', email: 'sipho@example.com', orders: 2, totalSpent: 1374.0, joinedAt: '2024-12-05' },
  { id: 'CUS-004', name: 'Nomsa Khumalo', email: 'nomsa@example.com', orders: 1, totalSpent: 213.5, joinedAt: '2025-01-16' },
]

export const money = (value: number) =>
  new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(value)

export type CartLine = { product: Product; quantity: number }
