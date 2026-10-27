import { ArrowRight, Heart, ShoppingBag, Star } from 'lucide-react'
import { money, Product, Special } from '@/lib/catalog'
import { ZoomableImage } from './ImagePopup'
import { SpecialBadge } from './SpecialBadge'

interface ProductDetailProps {
  product: Product
  special?: Special
  relatedProducts?: Product[]
  wished: boolean
  onWish: () => void
  onAdd: () => void
  onViewProduct?: (product: Product) => void
  onBack: () => void
}

export function ProductDetail({ 
  product, 
  special, 
  relatedProducts = [],
  wished, 
  onWish, 
  onAdd, 
  onViewProduct,
  onBack 
}: ProductDetailProps) {
  const displayPrice = special && special.active ? special.salePrice : product.price
  
  return (
    <main className="detail-page">
      <button className="back-button" onClick={onBack}>
        ← Back to parts
      </button>
      <div className="detail-layout">
        <div className="detail-image">
          <ZoomableImage src={product.image} alt={product.name} />
          {special && special.active && (
            <SpecialBadge
              originalPrice={special.originalPrice}
              salePrice={special.salePrice}
              discountPercentage={special.discountPercentage}
              className="detail-special"
            />
          )}
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
          <div className="detail-price">{money(displayPrice)}</div>
          {special && special.active && (
            <div className="detail-savings">
              You save {money(special.originalPrice - special.salePrice)} ({Math.round(special.discountPercentage)}%)
            </div>
          )}
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

      {relatedProducts.length > 0 && (
        <section className="related-products-section">
          <h2>Related products</h2>
          <div className="related-products-grid">
            {relatedProducts.map((relProduct) => (
              <div 
                key={relProduct.id} 
                className="related-product-item"
                onClick={() => onViewProduct?.(relProduct)}
              >
                <div className="related-product-image">
                  {relProduct.image ? (
                    <img src={relProduct.image} alt={relProduct.name} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', background: 'var(--muted)' }} />
                  )}
                </div>
                <div className="related-product-info">
                  <h4>{relProduct.name}</h4>
                  <p>{relProduct.category}</p>
                  <strong>{money(relProduct.price)}</strong>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  )
}
