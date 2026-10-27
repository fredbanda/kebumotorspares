import { db } from "@/prisma/db";
import { AdminView } from "@/components/storefront/AdminView";
import { hasTable } from "@/lib/db-capabilities";
import type {
  Order,
  Return,
  Sale,
  Discount,
  Promotion,
  Customer,
  Product,
} from "@/lib/catalog";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export default async function StoreAdmin() {
  const inventoryTableExists = await hasTable("inventory");

  const productBaseSelect = {
    id: true,
    name: true,
    category: true,
    slug: true,
    sku: true,
    description: true,
    imageUrl: true,
    price: true,
    costPrice: true,
    active: true,
    createdAt: true,
  } as const;

  const [products, orders, returns, users, authUsers] = await Promise.all([
    inventoryTableExists
      ? db.product.findMany({
          select: {
            ...productBaseSelect,
            inventory: { select: { quantity: true } },
          },
          orderBy: { createdAt: "desc" },
        })
      : db.product.findMany({
          select: productBaseSelect,
          orderBy: { createdAt: "desc" },
        }),
    db.order.findMany({
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true, email: true } }, orderItems: { select: { id: true } } },
    }),
    db.returns.findMany({
      select: { id: true, orderId: true, userId: true, reason: true, status: true, createdAt: true, user: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    }),
    db.user.findMany({
      orderBy: { createdAt: "desc" },
      include: { orders: { select: { total: true } } },
    }),
    pool.query<{ id: string; email: string; role: string }>(
      `SELECT id, email, role FROM "user"`
    ),
  ]);

  const mappedProducts = products.map((p: any) => ({
    id: p.id,
    name: p.name,
    category: p.category,
    sku: p.sku ?? p.slug,
    price: p.price,
    stock:
      "inventory" in p && p.inventory ? p.inventory.quantity : 0,
    rating: 5,
    description: p.description ?? "",
    image: p.imageUrl ?? "",
    active: p.active,
  }));

  const mappedOrders: Order[] = orders.map((o) => ({
    id: o.id,
    customer: o.user?.name ?? o.user?.email ?? "",
    email: o.user?.email ?? "",
    total: o.total,
    status: o.status as Order["status"],
    items: o.orderItems.length,
    createdAt: o.createdAt.toISOString().slice(0, 10),
  }));

  const mappedReturns: Return[] = returns.map((r) => ({
    id: r.id,
    orderId: r.orderId,
    customer: r.user?.name ?? "",
    reason: r.reason,
    status: r.status as Return["status"],
    createdAt: r.createdAt.toISOString().slice(0, 10),
  }));

  const roleMap = new Map(authUsers.rows.map((u) => [u.email, u.role]));

  const customers: Customer[] = users.map((u) => ({
    id: u.id,
    name: u.name ?? u.email,
    email: u.email,
    orders: u.orders.length,
    totalSpent: u.orders.reduce((s, o) => s + o.total, 0),
    joinedAt: u.createdAt.toISOString().slice(0, 10),
    role: roleMap.get(u.email) ?? "customer",
  }));

  // New tables (sales, discounts, promotions) — available after migration + prisma contract emit
  const sales: Sale[] = [];
  const discounts: Discount[] = [];
  const promotions: Promotion[] = [];

  return (
    <AdminView
      initialProducts={mappedProducts}
      initialOrders={mappedOrders}
      initialReturns={mappedReturns}
      initialDiscounts={discounts}
      initialPromotions={promotions}
      initialCustomers={customers}
    />
  );
}
