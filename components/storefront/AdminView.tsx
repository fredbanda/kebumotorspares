'use client'

import React, { useState } from 'react'
import { useProducts } from '@/components/products/ProductProvider'
import { ArrowRight, Plus, Package, ShoppingCart, RotateCcw, TrendingUp, Layers, Tag, Megaphone, Users, X, Check, Loader2, Edit2, Trash2 } from 'lucide-react'
import { categories, money, Product, Order, Return, Sale, Discount, Promotion, Customer } from '@/lib/catalog'

type Tab = 'products' | 'orders' | 'returns' | 'sales' | 'inventory' | 'discounts' | 'promotions' | 'customers'

const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'products', label: 'Products', icon: <Package size={15} /> },
  { id: 'orders', label: 'Orders', icon: <ShoppingCart size={15} /> },
  { id: 'returns', label: 'Returns', icon: <RotateCcw size={15} /> },
  { id: 'sales', label: 'Sales', icon: <TrendingUp size={15} /> },
  { id: 'inventory', label: 'Inventory', icon: <Layers size={15} /> },
  { id: 'discounts', label: 'Discounts', icon: <Tag size={15} /> },
  { id: 'promotions', label: 'Promotions', icon: <Megaphone size={15} /> },
  { id: 'customers', label: 'Customers', icon: <Users size={15} /> },
]

const emptyProduct = { name: '', category: 'Engine', price: '', costPrice: '', stock: '', description: '', image: '', sku: '' }
const emptyDiscount = { code: '', type: 'percentage' as 'percentage' | 'fixed', value: '', minOrder: '', maxUses: '', expiresAt: '' }
const emptyPromotion = { title: '', description: '', bannerUrl: '', startsAt: '', endsAt: '' }

export function AdminView({ initialProducts, initialOrders, initialReturns, initialDiscounts, initialPromotions, initialCustomers }: {
  initialProducts: Product[]
  initialOrders: Order[]
  initialReturns: Return[]
  initialDiscounts: Discount[]
  initialPromotions: Promotion[]
  initialCustomers: Customer[]
}) {
  const { addProduct } = useProducts()
  const [tab, setTab] = useState<Tab>('products')
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [orders, setOrders] = useState<Order[]>(initialOrders)
  const [returns, setReturns] = useState<Return[]>(initialReturns)
  const [sales] = useState<Sale[]>([])
  const [discounts, setDiscounts] = useState<Discount[]>(initialDiscounts)
  const [promotions, setPromotions] = useState<Promotion[]>(initialPromotions)
  const [customers] = useState<Customer[]>(initialCustomers)
  const [productForm, setProductForm] = useState(emptyProduct)
  const [discountForm, setDiscountForm] = useState(emptyDiscount)
  const [promoForm, setPromoForm] = useState(emptyPromotion)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const reader = new FileReader()
    reader.onload = async () => {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: reader.result }),
      })
      const json = await res.json()
      if (json.url) setProductForm((f) => ({ ...f, image: json.url }))
      else alert(json.error ?? 'Upload failed')
      setUploading(false)
    }
    reader.readAsDataURL(file)
  }

  const totalRevenue = sales.reduce((s, x) => s + x.revenue, 0)
  const totalProfit = sales.reduce((s, x) => s + (x.profit ?? 0), 0)

  const statusColor: Record<string, string> = {
    pending: '#f59e0b', processing: '#3b82f6', shipped: '#8b5cf6',
    delivered: '#22c55e', canceled: '#ef4444',
    requested: '#f59e0b', approved: '#22c55e', rejected: '#ef4444', refunded: '#3b82f6',
  }

  async function submitProduct(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const productData = {
      name: productForm.name,
      category: productForm.category,
      price: Number(productForm.price),
      costPrice: productForm.costPrice ? Number(productForm.costPrice) : undefined,
      stock: Number(productForm.stock),
      rating: 5,
      description: productForm.description,
      image: productForm.image,
      sku: productForm.sku,
      active: true,
    }

    if (editingId) {
      // Update existing product
      const res = await fetch(`/api/admin/products/${editingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: productForm.name,
          category: productForm.category,
          description: productForm.description,
          imageUrl: productForm.image,
          price: Number(productForm.price),
          costPrice: productForm.costPrice ? Number(productForm.costPrice) : undefined,
          active: true,
        }),
      })
      if (res.ok) {
        const updated = await res.json()
        setProducts((prev) => prev.map((p) => p.id === editingId ? { ...p, ...updated, sku: updated.sku, image: updated.imageUrl ?? '', description: updated.description ?? '', active: updated.active } : p))
        setProductForm(emptyProduct)
        setEditingId(null)
      }
    } else {
      const newProduct = await addProduct(productData)
      if (newProduct) {
        setProductForm(emptyProduct)
      }
    }
    setSaving(false)
  }

  function startEdit(p: Product) {
    setEditingId(p.id)
    setProductForm({
      name: p.name,
      category: p.category,
      price: String(p.price),
      costPrice: p.costPrice ? String(p.costPrice) : '',
      stock: String(p.stock),
      description: p.description,
      image: p.image,
      sku: p.sku,
    })
  }

  async function deleteProduct(id: string) {
    if (!confirm('Delete this product?')) return
    const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setProducts((prev) => prev.filter((p) => p.id !== id))
    }
  }

  async function updateOrderStatus(id: string, status: Order['status']) {
    setOrders((o) => o.map((x) => x.id === id ? { ...x, status } : x))
    await fetch('/api/admin/orders', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status }) })
  }

  async function updateReturnStatus(id: string, status: Return['status']) {
    setReturns((r) => r.map((x) => x.id === id ? { ...x, status } : x))
    await fetch('/api/admin/returns', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status }) })
  }

  async function submitDiscount(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const res = await fetch('/api/admin/discounts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(discountForm),
    })
    if (res.ok) {
      const d = await res.json()
      setDiscounts((prev) => [d, ...prev])
      setDiscountForm(emptyDiscount)
    }
    setSaving(false)
  }

  async function toggleDiscount(id: string) {
    const d = discounts.find((x) => x.id === id)!
    setDiscounts((prev) => prev.map((x) => x.id === id ? { ...x, active: !x.active } : x))
    await fetch('/api/admin/discounts', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, active: !d.active }) })
  }

  async function submitPromotion(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const res = await fetch('/api/admin/promotions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(promoForm),
    })
    if (res.ok) {
      const p = await res.json()
      setPromotions((prev) => [p, ...prev])
      setPromoForm(emptyPromotion)
    }
    setSaving(false)
  }

  async function togglePromotion(id: string) {
    const p = promotions.find((x) => x.id === id)!
    setPromotions((prev) => prev.map((x) => x.id === id ? { ...x, active: !x.active } : x))
    await fetch('/api/admin/promotions', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, active: !p.active }) })
  }

  return (
    <main className="admin-page">
      <div className="admin-heading">
        <div>
          <p className="eyebrow">ADMIN PORTAL</p>
          <h1>Admin Dashboard</h1>
        </div>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          <span className="admin-stat"><b>{products?.length ?? 0}</b> products</span>
          <span className="admin-stat"><b>{orders?.length ?? 0}</b> orders</span>
          <span className="admin-stat"><b>{money(totalRevenue)}</b> revenue</span>
        </div>
      </div>

      <div className="admin-tabs">
        {tabs.map((t) => (
          <button key={t.id} className={tab === t.id ? 'admin-tab active' : 'admin-tab'} onClick={() => setTab(t.id)}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {tab === 'products' && (
        <ProductsTab
          products={products}
          productForm={productForm}
          setProductForm={setProductForm}
          onSubmit={submitProduct}
          handleImageUpload={handleImageUpload}
          uploading={uploading}
          saving={saving}
          editingId={editingId}
          setEditingId={setEditingId}
          startEdit={startEdit}
          deleteProduct={deleteProduct}
        />
      )}

      {tab === 'orders' && (
        <OrdersTab orders={orders} onUpdateStatus={updateOrderStatus} statusColor={statusColor} />
      )}

      {tab === 'returns' && (
        <ReturnsTab returns={returns} onUpdateStatus={updateReturnStatus} statusColor={statusColor} />
      )}

      {tab === 'sales' && (
        <SalesTab sales={sales} totalRevenue={totalRevenue} totalProfit={totalProfit} money={money} />
      )}

      {tab === 'inventory' && (
        <InventoryTab products={products} money={money} onEdit={(p) => { startEdit(p); setTab('products') }} onDelete={deleteProduct} onTabChange={setTab} />
      )}

      {tab === 'discounts' && (
        <DiscountsTab
          discounts={discounts}
          discountForm={discountForm}
          setDiscountForm={setDiscountForm}
          onSubmit={submitDiscount}
          onToggle={toggleDiscount}
          saving={saving}
        />
      )}

      {tab === 'promotions' && (
        <PromotionsTab
          promotions={promotions}
          promoForm={promoForm}
          setPromoForm={setPromoForm}
          onSubmit={submitPromotion}
          onToggle={togglePromotion}
          saving={saving}
        />
      )}

      {tab === 'customers' && (
        <CustomersTab customers={customers} money={money} />
      )}
    </main>
  )
}

function ProductsTab({
  products,
  productForm,
  setProductForm,
  onSubmit,
  handleImageUpload,
  uploading,
  saving,
  editingId,
  setEditingId,
  startEdit,
  deleteProduct,
}: {
  products: Product[]
  productForm: typeof emptyProduct
  setProductForm: React.Dispatch<React.SetStateAction<typeof emptyProduct>>
  onSubmit: (e: React.FormEvent) => void
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  uploading: boolean
  saving: boolean
  editingId: string | null
  setEditingId: React.Dispatch<React.SetStateAction<string | null>>
  startEdit: (p: Product) => void
  deleteProduct: (id: string) => void
}) {
  return (
    <div className="admin-layout">
      <form className="product-form" onSubmit={onSubmit}>
        <div className="form-head"><h2>{editingId ? 'Edit part' : 'Add a part'}</h2><span>* required</span></div>
        <label>Product name *<input value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} placeholder="e.g. Ceramic brake pads" required /></label>
        <label>SKU<input value={productForm.sku} onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })} placeholder="Auto-generated if blank" /></label>
        <div className="form-row">
          <label>Category *<select value={productForm.category} onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}>{categories.map((c) => <option key={c}>{c}</option>)}</select></label>
          <label>Price (ZAR) *<input type="number" min="0" step="0.01" value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} placeholder="0.00" required /></label>
          <label>Cost price<input type="number" min="0" step="0.01" value={productForm.costPrice} onChange={(e) => setProductForm({ ...productForm, costPrice: e.target.value })} placeholder="0.00" /></label>
          <label>Stock *<input type="number" min="0" value={productForm.stock} onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })} placeholder="0" required /></label>
        </div>
        <label>
          Product image
          <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
          {uploading && <span style={{ fontSize: 11, color: 'var(--muted-foreground)' }}>Uploading…</span>}
          {productForm.image && (
            <img src={productForm.image} alt="preview" style={{ width: '100%', height: 120, objectFit: 'cover', marginTop: 6 }} />
          )}
          <input value={productForm.image} onChange={(e) => setProductForm({ ...productForm, image: e.target.value })} placeholder="Or paste a URL" style={{ marginTop: 4 }} />
        </label>
        <label>Description<textarea value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} rows={3} /></label>
        <button className="red-button" type="submit" disabled={saving}>{saving ? <Loader2 size={16} className="spin" /> : <>{editingId ? 'Save changes' : 'Add product'} <Plus size={16} /></>}</button>
        {editingId && <button type="button" className="text-button" onClick={() => { setEditingId(null); setProductForm(emptyProduct) }}>Cancel edit</button>}
      </form>

      <div className="inventory-list">
        <div className="form-head"><h2>All products ({products.length})</h2><button className="text-button">Export <ArrowRight size={14} /></button></div>
        {products.map((p) => (
          <div className="inventory-item" key={p.id}>
            {p.image ? <img src={p.image} alt="" /> : <div style={{ width: 50, height: 50, background: 'var(--muted)' }} />}
            <div>
              <strong>{p.name}</strong>
              <span>{p.category} · {p.sku}</span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <b style={{ color: 'var(--primary)', display: 'block' }}>{money(p.price)}</b>
              <span style={{ fontSize: 10, color: 'var(--muted-foreground)' }}>{p.stock} in stock</span>
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              <button className="icon-btn" title="Edit" onClick={() => startEdit(p)}><Edit2 size={14} /></button>
              <button className="icon-btn" title="Delete" style={{ color: '#ef4444' }} onClick={() => deleteProduct(p.id)}><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function OrdersTab({
  orders,
  onUpdateStatus,
  statusColor,
}: {
  orders: Order[]
  onUpdateStatus: (id: string, status: Order['status']) => void
  statusColor: Record<string, string>
}) {
  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead><tr><th>Order</th><th>Customer</th><th>Items</th><th>Total</th><th>Date</th><th>Status</th><th>Update</th></tr></thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td><code>{o.id}</code></td>
              <td><strong>{o.customer}</strong><br /><small>{o.email}</small></td>
              <td>{o.items}</td>
              <td>{money(o.total)}</td>
              <td>{o.createdAt}</td>
              <td><span className="status-badge" style={{ background: statusColor[o.status] }}>{o.status}</span></td>
              <td>
                <select value={o.status} onChange={(e) => onUpdateStatus(o.id, e.target.value as Order['status'])} className="status-select">
                  {['pending', 'processing', 'shipped', 'delivered', 'canceled'].map((s) => <option key={s}>{s}</option>)}
                </select>
              </td>
            </tr>
          ))}
          {orders.length === 0 && <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--muted-foreground)', padding: 40 }}>No orders yet</td></tr>}
        </tbody>
      </table>
    </div>
  )
}

function ReturnsTab({
  returns,
  onUpdateStatus,
  statusColor,
}: {
  returns: Return[]
  onUpdateStatus: (id: string, status: Return['status']) => void
  statusColor: Record<string, string>
}) {
  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead><tr><th>Return ID</th><th>Order</th><th>Customer</th><th>Reason</th><th>Refund</th><th>Status</th><th>Update</th></tr></thead>
        <tbody>
          {returns.map((r) => (
            <tr key={r.id}>
              <td><code>{r.id}</code></td>
              <td><code>{r.orderId}</code></td>
              <td>{r.customer}</td>
              <td>{r.reason}</td>
              <td>{r.refundAmount ? money(r.refundAmount) : '—'}</td>
              <td><span className="status-badge" style={{ background: statusColor[r.status] }}>{r.status}</span></td>
              <td>
                <select value={r.status} onChange={(e) => onUpdateStatus(r.id, e.target.value as Return['status'])} className="status-select">
                  {['requested', 'approved', 'rejected', 'refunded'].map((s) => <option key={s}>{s}</option>)}
                </select>
              </td>
            </tr>
          ))}
          {returns.length === 0 && <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--muted-foreground)', padding: 40 }}>No returns yet</td></tr>}
        </tbody>
      </table>
    </div>
  )
}

function SalesTab({
  sales,
  totalRevenue,
  totalProfit,
  money,
}: {
  sales: Sale[]
  totalRevenue: number
  totalProfit: number
  money: (value: number) => string
}) {
  return (
    <>
      <div className="sales-stats">
        <div className="sales-stat-card"><span>Total Revenue</span><b>{money(totalRevenue)}</b></div>
        <div className="sales-stat-card"><span>Total Profit</span><b style={{ color: '#22c55e' }}>{money(totalProfit)}</b></div>
        <div className="sales-stat-card"><span>Transactions</span><b>{sales.length}</b></div>
        <div className="sales-stat-card"><span>Avg Order</span><b>{money(totalRevenue / (sales.length || 1))}</b></div>
      </div>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead><tr><th>Sale ID</th><th>Order</th><th>Revenue</th><th>Cost</th><th>Profit</th><th>Channel</th><th>Date</th></tr></thead>
          <tbody>
            {sales.map((s) => (
              <tr key={s.id}>
                <td><code>{s.id}</code></td>
                <td><code>{s.orderId}</code></td>
                <td>{money(s.revenue)}</td>
                <td>{s.cost ? money(s.cost) : '—'}</td>
                <td style={{ color: '#22c55e' }}>{s.profit ? money(s.profit) : '—'}</td>
                <td>{s.channel}</td>
                <td>{s.createdAt}</td>
              </tr>
            ))}
            {sales.length === 0 && <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--muted-foreground)', padding: 40 }}>No sales recorded yet</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  )
}

function InventoryTab({
  products,
  money,
  onEdit,
  onDelete,
  onTabChange,
}: {
  products: Product[]
  money: (value: number) => string
  onEdit: (p: Product) => void
  onDelete: (id: string) => void
  onTabChange: (tab: Tab) => void
}) {
  const [expanded, setExpanded] = useState<string | null>(null)
  return (
    <div className="admin-table-wrap">
      <div className="form-head" style={{ marginBottom: 12 }}>
        <h2>Inventory ({products.length})</h2>
        <button className="text-button" onClick={() => onTabChange('products')}>Add product <ArrowRight size={14} /></button>
      </div>
      <table className="admin-table">
        <thead><tr><th></th><th>Product</th><th>SKU</th><th>Category</th><th>Price</th><th>Cost</th><th>Stock</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>
          {products.map((p) => (
            <React.Fragment key={p.id}>
              <tr key={p.id} style={{ cursor: 'pointer' }} onClick={() => setExpanded(expanded === p.id ? null : p.id)}>
                <td>{p.image ? <img src={p.image} alt="" style={{ width: 36, height: 36, objectFit: 'cover', borderRadius: 4 }} /> : <div style={{ width: 36, height: 36, background: 'var(--muted)', borderRadius: 4 }} />}</td>
                <td><strong>{p.name}</strong></td>
                <td><code>{p.sku}</code></td>
                <td>{p.category}</td>
                <td>{money(p.price)}</td>
                <td>{p.costPrice ? money(p.costPrice) : '—'}</td>
                <td>{p.stock}</td>
                <td>
                  {p.stock === 0
                    ? <span className="status-badge" style={{ background: '#ef4444' }}>Out of stock</span>
                    : p.stock <= 5
                    ? <span className="status-badge" style={{ background: '#f59e0b' }}>Low stock</span>
                    : <span className="status-badge" style={{ background: '#22c55e' }}>In stock</span>}
                </td>
                <td style={{ whiteSpace: 'nowrap' }} onClick={(e) => e.stopPropagation()}>
                  <button className="icon-btn" title="Edit" onClick={() => onEdit(p)}><Edit2 size={14} /></button>
                  <button className="icon-btn" title="Delete" style={{ color: '#ef4444' }} onClick={() => onDelete(p.id)}><Trash2 size={14} /></button>
                </td>
              </tr>
              {expanded === p.id && (
                <tr key={`${p.id}-detail`}>
                  <td colSpan={9} style={{ background: 'var(--muted)', padding: '12px 16px' }}>
                    <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                      {p.image && <img src={p.image} alt={p.name} style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 6, flexShrink: 0 }} />}
                      <div>
                        <strong style={{ display: 'block', marginBottom: 4 }}>{p.name}</strong>
                        {p.description ? <p style={{ margin: 0, fontSize: 13, color: 'var(--muted-foreground)' }}>{p.description}</p> : <p style={{ margin: 0, fontSize: 13, color: 'var(--muted-foreground)' }}>No description.</p>}
                        <div style={{ marginTop: 8, display: 'flex', gap: 16, fontSize: 12 }}>
                          <span>Price: <b>{money(p.price)}</b></span>
                          {p.costPrice && <span>Cost: <b>{money(p.costPrice)}</b></span>}
                          {p.costPrice && <span>Margin: <b style={{ color: '#22c55e' }}>{Math.round(((p.price - p.costPrice) / p.price) * 100)}%</b></span>}
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function DiscountsTab({
  discounts,
  discountForm,
  setDiscountForm,
  onSubmit,
  onToggle,
  saving,
}: {
  discounts: Discount[]
  discountForm: typeof emptyDiscount
  setDiscountForm: React.Dispatch<React.SetStateAction<typeof emptyDiscount>>
  onSubmit: (e: React.FormEvent) => void
  onToggle: (id: string) => void
  saving: boolean
}) {
  return (
    <div className="admin-layout">
      <form className="product-form" onSubmit={onSubmit}>
        <div className="form-head"><h2>Create discount</h2></div>
        <label>Code *<input value={discountForm.code} onChange={(e) => setDiscountForm({ ...discountForm, code: e.target.value })} placeholder="e.g. SAVE20" required /></label>
        <div className="form-row">
          <label>Type<select value={discountForm.type} onChange={(e) => setDiscountForm({ ...discountForm, type: e.target.value as 'percentage' | 'fixed' })}><option value="percentage">Percentage %</option><option value="fixed">Fixed ZAR</option></select></label>
          <label>Value *<input type="number" min="0" step="0.01" value={discountForm.value} onChange={(e) => setDiscountForm({ ...discountForm, value: e.target.value })} placeholder="20" required /></label>
        </div>
        <div className="form-row">
          <label>Min order (ZAR)<input type="number" min="0" value={discountForm.minOrder} onChange={(e) => setDiscountForm({ ...discountForm, minOrder: e.target.value })} placeholder="0" /></label>
          <label>Max uses<input type="number" min="0" value={discountForm.maxUses} onChange={(e) => setDiscountForm({ ...discountForm, maxUses: e.target.value })} placeholder="Unlimited" /></label>
        </div>
        <label>Expires at<input type="date" value={discountForm.expiresAt} onChange={(e) => setDiscountForm({ ...discountForm, expiresAt: e.target.value })} /></label>
        <button className="red-button" type="submit" disabled={saving}>Create discount <Plus size={16} /></button>
      </form>

      <div className="inventory-list">
        <div className="form-head"><h2>Active codes ({discounts.filter((d) => d.active).length})</h2></div>
        {discounts.map((d) => (
          <div className="inventory-item" key={d.id} style={{ gridTemplateColumns: '1fr auto auto' }}>
            <div>
              <strong>{d.code}</strong>
              <span>{d.type === 'percentage' ? `${d.value}% off` : `${money(d.value)} off`}{d.minOrder ? ` · min ${money(d.minOrder)}` : ''}</span>
              <span>{d.usedCount} uses{d.maxUses ? ` / ${d.maxUses}` : ''}{d.expiresAt ? ` · expires ${d.expiresAt}` : ''}</span>
            </div>
            <span className="status-badge" style={{ background: d.active ? '#22c55e' : '#6b7280' }}>{d.active ? 'Active' : 'Off'}</span>
            <button className="icon-btn" onClick={() => onToggle(d.id)}>{d.active ? <X size={14} /> : <Check size={14} />}</button>
          </div>
        ))}
        {discounts.length === 0 && <p style={{ color: 'var(--muted-foreground)', fontSize: 13 }}>No discount codes yet</p>}
      </div>
    </div>
  )
}

function PromotionsTab({
  promotions,
  promoForm,
  setPromoForm,
  onSubmit,
  onToggle,
  saving,
}: {
  promotions: Promotion[]
  promoForm: typeof emptyPromotion
  setPromoForm: React.Dispatch<React.SetStateAction<typeof emptyPromotion>>
  onSubmit: (e: React.FormEvent) => void
  onToggle: (id: string) => void
  saving: boolean
}) {
  return (
    <div className="admin-layout">
      <form className="product-form" onSubmit={onSubmit}>
        <div className="form-head"><h2>Create promotion</h2></div>
        <label>Title *<input value={promoForm.title} onChange={(e) => setPromoForm({ ...promoForm, title: e.target.value })} placeholder="e.g. January Sale" required /></label>
        <label>Description<textarea value={promoForm.description} onChange={(e) => setPromoForm({ ...promoForm, description: e.target.value })} rows={2} /></label>
        <label>Banner image URL<input value={promoForm.bannerUrl} onChange={(e) => setPromoForm({ ...promoForm, bannerUrl: e.target.value })} placeholder="Cloudinary URL" /></label>
        <div className="form-row">
          <label>Starts at<input type="date" value={promoForm.startsAt} onChange={(e) => setPromoForm({ ...promoForm, startsAt: e.target.value })} /></label>
          <label>Ends at<input type="date" value={promoForm.endsAt} onChange={(e) => setPromoForm({ ...promoForm, endsAt: e.target.value })} /></label>
        </div>
        <button className="red-button" type="submit" disabled={saving}>Create promotion <Plus size={16} /></button>
      </form>

      <div className="inventory-list">
        <div className="form-head"><h2>All promotions</h2></div>
        {promotions.map((p) => (
          <div className="inventory-item" key={p.id} style={{ gridTemplateColumns: '1fr auto auto' }}>
            <div>
              <strong>{p.title}</strong>
              {p.description && <span>{p.description}</span>}
              {(p.startsAt || p.endsAt) && <span>{p.startsAt ?? '—'} → {p.endsAt ?? '—'}</span>}
            </div>
            <span className="status-badge" style={{ background: p.active ? '#22c55e' : '#6b7280' }}>{p.active ? 'Live' : 'Draft'}</span>
            <button className="icon-btn" onClick={() => onToggle(p.id)}>{p.active ? <X size={14} /> : <Check size={14} />}</button>
          </div>
        ))}
        {promotions.length === 0 && <p style={{ color: 'var(--muted-foreground)', fontSize: 13 }}>No promotions yet</p>}
      </div>
    </div>
  )
}

function CustomersTab({
  customers,
  money,
}: {
  customers: Customer[]
  money: (value: number) => string
}) {
  const [roles, setRoles] = useState<Record<string, string>>(
    Object.fromEntries(customers.map((c) => [c.id, c.role ?? 'customer']))
  )

  async function toggleRole(c: Customer) {
    const newRole = roles[c.id] === 'admin' ? 'customer' : 'admin'
    const res = await fetch('/api/admin/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: c.id, newRole }),
    })
    if (res.ok) setRoles((prev) => ({ ...prev, [c.id]: newRole }))
  }

  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead><tr><th>Name</th><th>Email</th><th>Orders</th><th>Total Spent</th><th>Joined</th><th>Role</th><th>Action</th></tr></thead>
        <tbody>
          {customers.map((c) => (
            <tr key={c.id}>
              <td><strong>{c.name}</strong></td>
              <td>{c.email}</td>
              <td>{c.orders}</td>
              <td>{money(c.totalSpent)}</td>
              <td>{c.joinedAt}</td>
              <td><span className="status-badge" style={{ background: roles[c.id] === 'admin' ? '#8b5cf6' : '#6b7280' }}>{roles[c.id] ?? 'customer'}</span></td>
              <td>
                <button className="text-button" style={{ fontSize: 12 }} onClick={() => toggleRole(c)}>
                  {roles[c.id] === 'admin' ? 'Demote' : 'Make admin'}
                </button>
              </td>
            </tr>
          ))}
          {customers.length === 0 && <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--muted-foreground)', padding: 40 }}>No customers yet</td></tr>}
        </tbody>
      </table>
    </div>
  )
}