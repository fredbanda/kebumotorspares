import { Heart, Plus, Star } from 'lucide-react'
import { money, Product, Special } from '@/lib/catalog'
import { SpecialBadge } from './SpecialBadge'

interface ProductCardProps {
  product: Product
  special?: Special
  wished: boolean
  onWish: () => void
  onView: () => void
  onAdd: () => void
}

export function ProductCard({ product, special, wished, onWish, onView, onAdd }: ProductCardProps) {
  const displayPrice = special ? special.salePrice : product.price
  
  return (
    <article className="product-card">
      <div className="product-image" onClick={onView}>
        {product.image
          ? <img src={product.image} alt={product.name} />
          : <div style={{ width: '100%', height: '100%', background: 'var(--muted)' }} />}
        {special && special.active ? (
          <SpecialBadge
            originalPrice={special.originalPrice}
            salePrice={special.salePrice}
            discountPercentage={special.discountPercentage}
            className="product-special"
          />
        ) : product.badge ? (
          <span className="badge">{product.badge}</span>
        ) : null}
        <button
          className={wished ? 'wish active' : 'wish'}
          aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
          onClick={(e) => { e.stopPropagation(); onWish() }}
        >
          <Heart fill={wished ? 'currentColor' : 'none'} />
        </button>
      </div>
      <div className="product-info">
        <div className="product-meta">
          <span>{product.category}</span>
          <span>
            <Star fill="currentColor" /> {product.rating}
          </span>
        </div>
        <button className="product-name" onClick={onView}>
          {product.name}
        </button>
        <div className="product-bottom">
          <strong>{money(displayPrice)}</strong>
          <button className="add-button" onClick={onAdd}>
            <Plus />
          </button>
        </div>
      </div>
    </article>
  )
}

