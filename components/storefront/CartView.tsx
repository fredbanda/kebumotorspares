import { ArrowRight } from 'lucide-react'
import { CartLine, money } from '@/lib/catalog'

interface CartViewProps {
  cart: CartLine[]
  total: number
  onBack: () => void
  onChange: (id: string, quantity: number) => void
  onCheckout: () => void
}

export function CartView({ cart, total, onBack, onChange, onCheckout }: CartViewProps) {
  return (
    <main className="cart-page">
      <button className="back-button" onClick={onBack}>
        ← Continue shopping
      </button>
      <div className="section-heading">
        <div>
          <p className="eyebrow">YOUR BUILD</p>
          <h1>Checkout</h1>
        </div>
        <span className="cart-count">{cart.length} line items</span>
      </div>

      {cart.length ? (
        <div className="cart-layout">
          <div className="cart-lines">
            {cart.map(({ product, quantity }) => (
              <div className="cart-line" key={product.id}>
                <img src={product.image} alt="" />
                <div>
                  <strong>{product.name}</strong>
                  <span>{product.category}</span>
                  <div className="qty">
                    <button onClick={() => onChange(product.id, quantity - 1)}>−</button>
                    <b>{quantity}</b>
                    <button onClick={() => onChange(product.id, quantity + 1)}>+</button>
                  </div>
                </div>
                <strong>{money(product.price * quantity)}</strong>
              </div>
            ))}
          </div>

          <aside className="order-summary">
            <p className="eyebrow">ORDER SUMMARY</p>
            <div>
              <span>Subtotal</span>
              <b>{money(total)}</b>
            </div>
            <div>
              <span>Shipping</span>
              <b className="free">Free</b>
            </div>
            <hr />
            <div className="summary-total">
              <span>Total</span>
              <b>{money(total)}</b>
            </div>
            <button className="red-button full" onClick={onCheckout}>
              Secure checkout <ArrowRight />
            </button>
            <small>Secured by Yoco · ZAR payments only</small>
          </aside>
        </div>
      ) : (
        <div className="empty-state">Your build is empty. Add a few parts to get moving.</div>
      )}
    </main>
  )
}
