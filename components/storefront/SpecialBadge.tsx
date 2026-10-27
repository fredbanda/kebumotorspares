import { money } from '@/lib/catalog'

interface SpecialBadgeProps {
  originalPrice: number
  salePrice: number
  discountPercentage: number
  className?: string
}

export function SpecialBadge({
  originalPrice,
  salePrice,
  discountPercentage,
  className = '',
}: SpecialBadgeProps) {
  return (
    <div className={`special-badge ${className}`}>
      <div className="special-badge-content">
        <div className="special-badge-old">
          <span className="strikethrough">{money(originalPrice)}</span>
        </div>
        <div className="special-badge-new">
          <span className="discount-label">No</span>
          <span className="new-price">{money(salePrice)}</span>
        </div>
        <div className="discount-percent">-{Math.round(discountPercentage)}%</div>
      </div>
    </div>
  )
}
