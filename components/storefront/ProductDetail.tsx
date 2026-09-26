import { ArrowRight, Heart, ShoppingBag, Star } from 'lucide-react'
import { money, Product } from '@/lib/catalog'

interface ProductDetailProps {
  product: Product
  wished: boolean
  onWish: () => void
  onAdd: () => void
  onBack: () => void
}

export function ProductDetail({ product, wished, onWish, onAdd, onBack }: ProductDetailProps) {
  return (
    <main className="detail-page">
      <button className="back-button" onClick={onBack}>
        ← Back to parts
      </button>
      <div className="detail-layout">
        <div className="detail-image">
          <img src={product.image} alt={product.name} />
        </div>
        <div className="detail-copy">
          <p className="eyebrow">
            {product.category} / {product.sku}
          </p>
          <h1>{product.name}</h1>
          <div className="detail-rating">
            <Star fill="currentColor" /> {product.rating} <span>18 verified reviews</span>
          </div>
          <p className="detail-description">{product.description}</p>
          <div className="detail-price">{money(product.price)}</div>
          <p className="stock">
            <span /> In stock — ships today
          </p>
          <div className="detail-actions">
            <button className="red-button" onClick={onAdd}>
              Add to cart <ShoppingBag data-icon="inline-end" />
            </button>
            <button className={wished ? 'wish-large active' : 'wish-large'} onClick={onWish}>
              <Heart fill={wished ? 'currentColor' : 'none'} /> {wished ? 'Saved' : 'Save to wishlist'}
            </button>
          </div>
          <div className="fitment">
            <strong>Not sure it fits?</strong>
            <span>Enter your vehicle to check compatibility</span>
            <button>
              Check fitment <ArrowRight />
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
