import { Heart, Plus, Star } from 'lucide-react'
import { money, Product } from '@/lib/catalog'

interface ProductCardProps {
  product: Product
  wished: boolean
  onWish: () => void
  onView: () => void
  onAdd: () => void
}

export function ProductCard({ product, wished, onWish, onView, onAdd }: ProductCardProps) {
  return (
    <article className="product-card">
      <div className="product-image" onClick={onView}>
        <img src={product.image} alt={product.name} />
        {product.badge && <span className="badge">{product.badge}</span>}
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
          <strong>{money(product.price)}</strong>
          <button className="add-button" onClick={onAdd}>
            <Plus />
          </button>
        </div>
      </div>
    </article>
  )
}
