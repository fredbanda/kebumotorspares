'use client'

import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { CartLine, money } from '@/lib/catalog'

declare global {
  interface Window {
    YocoSDK: {
      new(config: { publicKey: string }): {
        showPopup(options: {
          amountInCents: number
          currency: string
          name: string
          description: string
          callback: (result: { id?: string; error?: { message: string } }) => void
        }): void
      }
    }
  }
}

interface CheckoutViewProps {
  cart: CartLine[]
  total: number
  userId: string
  onBack: () => void
  onSuccess: () => void
}

export function CheckoutView({ cart, total, userId, onBack, onSuccess }: CheckoutViewProps) {
  const [form, setForm] = useState({ name: '', email: '', address: '', city: '', zip: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function set(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [field]: e.target.value }))
  }

  async function handleCheckout(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (typeof window.YocoSDK === 'undefined') {
      setError('Payment SDK not loaded. Please refresh and try again.')
      return
    }

    const yoco = new window.YocoSDK({ publicKey: process.env.NEXT_PUBLIC_YOCO_PUBLIC_KEY! })

    yoco.showPopup({
      amountInCents: Math.round(total * 100),
      currency: 'ZAR',
      name: 'Kebu Motor Spares',
      description: `${cart.length} item(s)`,
      callback: async (result) => {
        if (result.error) {
          setError(result.error.message)
          return
        }
        if (!result.id) return

        setLoading(true)
        const res = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            token: result.id,
            userId,
            cart: cart.map((l) => ({ productId: l.product.id, quantity: l.quantity, price: l.product.price })),
            total,
            shipping: form,
          }),
        })

        if (res.ok) {
          onSuccess()
        } else {
          const data = await res.json().catch(() => ({}))
          setError(data.error ?? 'Payment failed. Please try again.')
        }
        setLoading(false)
      },
    })
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
            {loading ? 'Processing…' : `Pay ${money(total)}`} {!loading && <ArrowRight size={16} />}
          </button>
          <small style={{ color: 'var(--muted-foreground)', fontSize: 11 }}>
            Secured by Yoco · ZAR payments only
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
