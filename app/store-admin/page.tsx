import { db } from '@/prisma/db'
import { AdminView } from '@/components/storefront/AdminView'
import type { Order, Return, Sale, Discount, Promotion, Customer, Product } from '@/lib/catalog'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export default async function StoreAdmin() {
  const [products, orders, returns, users, authUsers] = await Promise.all([
    db.orm.public.Product.select('id', 'name', 'category', 'slug', 'description', 'imageUrl', 'price', 'costPrice', 'active', 'createdAt').orderBy((p) => p.createdAt.desc()).all(),
    db.orm.public.Order
      .orderBy((o) => o.createdAt.desc())
      .include('user', (u) => u.select('name', 'email'))
      .include('orderItems', (i) => i.select('id'))
      .all(),
    db.orm.public.Returns
      .select('id', 'orderId', 'userId', 'reason', 'status', 'createdAt')
      .orderBy((r) => r.createdAt.desc())
      .include('user', (u) => u.select('name'))
      .all(),
    db.orm.public.User
      .orderBy((u) => u.createdAt.desc())
      .include('orders', (o) => o.select('total'))
      .all(),
    pool.query<{ id: string; email: string; role: string }>(`SELECT id, email, role FROM "user"`),
  ])

  const mappedProducts = products.map((p) => ({
    id: p.id,
    name: p.name,
    category: p.category,
    sku: p.slug,
    price: p.price,
    stock: 0,
    rating: 5,
    description: p.description ?? '',
    image: p.imageUrl ?? '',
    active: p.active,
  }))

  const mappedOrders: Order[] = orders.map((o) => ({
    id: o.id,
    customer: o.user?.name ?? o.user?.email ?? '',
    email: o.user?.email ?? '',
    total: o.total,
    status: o.status as Order['status'],
    items: o.orderItems.length,
    createdAt: (o.createdAt as string).slice(0, 10),
  }))

  const mappedReturns: Return[] = returns.map((r) => ({
    id: r.id,
    orderId: r.orderId,
    customer: r.user?.name ?? '',
    reason: r.reason,
    status: r.status as Return['status'],
    createdAt: (r.createdAt as string).slice(0, 10),
  }))

  const roleMap = new Map(authUsers.rows.map((u) => [u.email, u.role]))

  const customers: Customer[] = users.map((u) => ({
    id: u.id,
    name: u.name ?? u.email,
    email: u.email,
    orders: u.orders.length,
    totalSpent: u.orders.reduce((s, o) => s + o.total, 0),
    joinedAt: (u.createdAt as string).slice(0, 10),
    role: roleMap.get(u.email) ?? 'customer',
  }))

  // New tables (sales, discounts, promotions) — available after migration + prisma contract emit
  const sales: Sale[] = []
  const discounts: Discount[] = []
  const promotions: Promotion[] = []

  return (
    <AdminView
      initialProducts={mappedProducts}
      initialOrders={mappedOrders}
      initialReturns={mappedReturns}
      initialDiscounts={discounts}
      initialPromotions={promotions}
      initialCustomers={customers}
    />
  )
}
