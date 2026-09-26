import { Package, Star, Truck } from 'lucide-react'

export function TrustRow() {
  return (
    <section className="trust-row">
      <div>
        <Truck />
        <span>
          <b>Fast dispatch</b> Most orders ship same day
        </span>
      </div>
      <div>
        <Package />
        <span>
          <b>Fitment guarantee</b> Parts that fit, period
        </span>
      </div>
      <div>
        <Star />
        <span>
          <b>Real expertise</b> Advice from enthusiasts
        </span>
      </div>
    </section>
  )
}
