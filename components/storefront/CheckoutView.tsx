'use client'

import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { CartLine, money } from '@/lib/catalog'

interface CheckoutViewProps {
  cart: CartLine[]
  total: number
  userId: string
  onBack: () => void
  onSuccess: () => void
}

export function CheckoutView({ cart, total, userId, onBack }: CheckoutViewProps) {
  const [form, setForm] = useState({ name: '', email: '', address: '', city: '', zip: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function set(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [field]: e.target.value }))
  }

  function submitToPayFast(processUrl: string, fields: Record<string, string>) {
    const formEl = document.createElement('form')
    formEl.method = 'POST'
    formEl.action = processUrl
    Object.entries(fields).forEach(([name, value]) => {
      const input = document.createElement('input')
      input.type = 'hidden'
      input.name = name
      input.value = value
      formEl.appendChild(input)
    })
    document.body.appendChild(formEl)
    formEl.submit()
  }

  async function handleCheckout(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          cart: cart.map((l) => ({ productId: l.product.id, quantity: l.quantity, price: l.product.price })),
          total,
          shipping: form,
        }),
      })

      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data.error ?? 'Unable to start payment. Please try again.')
        return
      }

      if (!data.processUrl || !data.fields) {
        setError('Payment gateway response was invalid.')
        return
      }

      submitToPayFast(data.processUrl, data.fields)
    } catch {
      setError('Unable to start payment. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="cart-page">
      <button className="back-button" onClick={onBack}>← Back to cart</button>

      <div className="section-heading">
        <div>
          <p className="eyebrow">SECURE CHECKOUT</p>
          <h1>Shipping</h1>
        </div>
        <span className="cart-count">{cart.length} item(s) · {money(total)}</span>
      </div>

      <div className="cart-layout">
        <form className="product-form" onSubmit={handleCheckout}>
          <label>Full name *<input value={form.name} onChange={set('name')} placeholder="Your full name" required /></label>
          <label>Email *<input type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" required /></label>
          <label>Street address *<input value={form.address} onChange={set('address')} placeholder="123 Main St" required /></label>
          <div className="form-row" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <label>City *<input value={form.city} onChange={set('city')} placeholder="Johannesburg" required /></label>
            <label>Postal code *<input value={form.zip} onChange={set('zip')} placeholder="2000" required /></label>
          </div>
          {error && <p className="auth-error">{error}</p>}
          <button className="red-button full" type="submit" disabled={loading}>
            {loading ? 'Redirecting to PayFast…' : `Pay ${money(total)}`} {!loading && <ArrowRight size={16} />}
          </button>
          <small style={{ color: 'var(--muted-foreground)', fontSize: 11 }}>
            Secured by PayFast · ZAR payments only
          </small>
        </form>

        <aside className="order-summary">
          <p className="eyebrow">ORDER SUMMARY</p>
          {cart.map(({ product, quantity }) => (
            <div key={product.id}>
              <span>{product.name} × {quantity}</span>
              <b>{money(product.price * quantity)}</b>
            </div>
          ))}
          <hr />
          <div className="summary-total">
            <span>Total</span>
            <b>{money(total)}</b>
          </div>
        </aside>
      </div>
    </main>
  )
}
