'use client'

import React, { useState, useEffect } from 'react'
import { money, Product, Special } from '@/lib/catalog'
import { Plus, X, Edit2, Trash2, Loader2 } from 'lucide-react'

interface SpecialsManagerProps {
  initialProducts: Product[]
}

export function SpecialsManager({ initialProducts }: SpecialsManagerProps) {
  const [specials, setSpecials] = useState<Special[]>([])
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<Partial<Special>>({
    productId: '',
    originalPrice: 0,
    salePrice: 0,
    discountPercentage: 0,
    active: true,
  })
  const [selectedRelated, setSelectedRelated] = useState<string[]>([])

  useEffect(() => {
    fetchSpecials()
  }, [])

  async function fetchSpecials() {
    const res = await fetch('/api/admin/specials')
    if (res.ok) {
      const data = await res.json()
      setSpecials(data)
    }
  }

  function handleProductChange(productId: string) {
    const product = products.find((p) => p.id === productId)
    if (product) {
      setForm((f) => ({
        ...f,
        productId,
        originalPrice: product.price,
        salePrice: product.price * 0.8,
      }))
      calculateDiscount(product.price, product.price * 0.8)
    }
  }

  function calculateDiscount(original: number, sale: number) {
    const discount = ((original - sale) / original) * 100
    setForm((f) => ({ ...f, discountPercentage: Math.round(discount * 10) / 10 }))
  }

  function handlePriceChange(field: 'originalPrice' | 'salePrice', value: string) {
    const numValue = Number(value)
    setForm((f) => {
      const updated = { ...f, [field]: numValue }
      if (f.originalPrice && f.salePrice) {
        calculateDiscount(
          field === 'originalPrice' ? numValue : (f.originalPrice || 0),
          field === 'salePrice' ? numValue : (f.salePrice || 0)
        )
      }
      return updated
    })
  }

  async function submitForm(e: React.FormEvent) {
    e.preventDefault()
    if (!form.productId || !form.originalPrice || !form.salePrice) {
      alert('Please fill all required fields')
      return
    }

    setSaving(true)
    try {
      if (editingId) {
        const res = await fetch('/api/admin/specials', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingId, ...form }),
        })
        if (res.ok) {
          const updated = await res.json()
          setSpecials((prev) => prev.map((s) => s.id === editingId ? updated : s))
          resetForm()
        }
      } else {
        const res = await fetch('/api/admin/specials', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        })
        if (res.ok) {
          const newSpecial = await res.json()
          setSpecials((prev) => [newSpecial, ...prev])
          resetForm()
        }
      }
    } catch (error) {
      alert('Failed to save special')
    } finally {
      setSaving(false)
    }
  }

  function resetForm() {
    setForm({
      productId: '',
      originalPrice: 0,
      salePrice: 0,
      discountPercentage: 0,
      active: true,
    })
    setEditingId(null)
    setShowForm(false)
    setSelectedRelated([])
  }

  function startEdit(special: Special) {
    setForm(special)
    setEditingId(special.id)
    setShowForm(true)
  }

  async function deleteSpecial(id: string) {
    if (!confirm('Delete this special?')) return
    const res = await fetch(`/api/admin/specials?id=${id}`, {
      method: 'DELETE',
    })
    if (res.ok) {
      setSpecials((prev) => prev.filter((s) => s.id !== id))
    }
  }

  async function addRelatedProduct(specialId: string, productId: string) {
    const res = await fetch('/api/admin/specials/related', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ specialId, productId }),
    })
    if (res.ok) {
      fetchSpecials()
      setSelectedRelated([])
    }
  }

  async function removeRelatedProduct(relatedProductId: string) {
    const res = await fetch(`/api/admin/specials/related?id=${relatedProductId}`, {
      method: 'DELETE',
    })
    if (res.ok) {
      fetchSpecials()
    }
  }

  return (
    <div className="specials-manager">
      <div className="specials-header">
        <h3>Specials Management</h3>
        {!showForm && (
          <button className="red-button" onClick={() => setShowForm(true)}>
            <Plus size={15} /> Create Special
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={submitForm} className="special-form">
          <fieldset>
            <legend>{editingId ? 'Edit' : 'Create'} Special</legend>

            <div className="form-group">
              <label>Product *</label>
              <select
                value={form.productId || ''}
                onChange={(e) => handleProductChange(e.target.value)}
                disabled={!!editingId}
              >
                <option value="">Select a product</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({money(p.price)})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Original Price *</label>
              <input
                type="number"
                step="0.01"
                value={form.originalPrice || 0}
                onChange={(e) => handlePriceChange('originalPrice', e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Sale Price *</label>
              <input
                type="number"
                step="0.01"
                value={form.salePrice || 0}
                onChange={(e) => handlePriceChange('salePrice', e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Discount Percentage</label>
              <input
                type="number"
                step="0.1"
                value={form.discountPercentage || 0}
                disabled
              />
            </div>

            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={form.active || false}
                  onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
                />
                Active
              </label>
            </div>

            <div className="form-group">
              <label>Starts At</label>
              <input
                type="datetime-local"
                value={form.startsAt ? form.startsAt.slice(0, 16) : ''}
                onChange={(e) => setForm((f) => ({ ...f, startsAt: e.target.value }))}
              />
            </div>

            <div className="form-group">
              <label>Ends At</label>
              <input
                type="datetime-local"
                value={form.endsAt ? form.endsAt.slice(0, 16) : ''}
                onChange={(e) => setForm((f) => ({ ...f, endsAt: e.target.value }))}
              />
            </div>

            <div className="form-actions">
              <button type="submit" disabled={saving} className="red-button">
                {saving ? <Loader2 size={15} className="spin" /> : 'Save Special'}
              </button>
              <button type="button" onClick={resetForm} className="gray-button">
                Cancel
              </button>
            </div>
          </fieldset>
        </form>
      )}

      <div className="specials-list">
        {specials.length === 0 ? (
          <p className="empty">No specials yet. Create one to get started!</p>
        ) : (
          specials.map((special) => (
            <div key={special.id} className="special-card">
              <div className="special-card-header">
                <div>
                  <h4>{special.product?.name}</h4>
                  <p className="special-card-prices">
                    <span className="original">{money(special.originalPrice)}</span>
                    <span className="sale">{money(special.salePrice)}</span>
                    <span className="discount">-{Math.round(special.discountPercentage)}%</span>
                  </p>
                </div>
                <div className="special-card-actions">
                  <button
                    className="icon-button"
                    onClick={() => startEdit(special)}
                    title="Edit"
                  >
                    <Edit2 size={15} />
                  </button>
                  <button
                    className="icon-button delete"
                    onClick={() => deleteSpecial(special.id)}
                    title="Delete"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              {special.startsAt && (
                <p className="special-card-dates">
                  {new Date(special.startsAt).toLocaleDateString()} -{' '}
                  {special.endsAt ? new Date(special.endsAt).toLocaleDateString() : 'Ongoing'}
                </p>
              )}

              <div className="related-products">
                <h5>Related Products</h5>
                {special.relatedProductIds && special.relatedProductIds.length > 0 ? (
                  <div className="related-list">
                    {special.relatedProductIds.map((relatedId) => {
                      const relatedProduct = products.find((p) => p.id === relatedId)
                      return relatedProduct ? (
                        <div key={relatedId} className="related-item">
                          <span>{relatedProduct.name}</span>
                          <button
                            className="icon-button delete"
                            onClick={() => {
                              const relProd = special.relatedProducts?.find(
                                (r) => r.product?.id === relatedId
                              )
                              if (relProd) removeRelatedProduct(relProd.id)
                            }}
                            title="Remove"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ) : null
                    })}
                  </div>
                ) : (
                  <p className="empty-related">No related products yet</p>
                )}

                <div className="add-related">
                  <select
                    value=""
                    onChange={(e) => {
                      if (e.target.value) {
                        addRelatedProduct(special.id, e.target.value)
                      }
                    }}
                  >
                    <option value="">Add a related product...</option>
                    {products
                      .filter(
                        (p) =>
                          p.id !== special.productId &&
                          !special.relatedProductIds?.includes(p.id)
                      )
                      .map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
