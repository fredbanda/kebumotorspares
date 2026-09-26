import { ArrowRight } from 'lucide-react'

interface FeatureBannerProps {
  onCtaClick: () => void
}

export function FeatureBanner({ onCtaClick }: FeatureBannerProps) {
  return (
    <section className="feature-banner">
      <div>
        <p className="eyebrow">FM MOTORS STANDARD</p>
        <h2>
          Every part earns
          <br />
          its place.
        </h2>
        <p>
          We only stock what we would put on our own cars. No filler. No guesswork. Just parts that
          perform.
        </p>
        <button className="outline-button" onClick={onCtaClick}>
          Why Redline <ArrowRight />
        </button>
      </div>
      <img
        src="https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=1200&q=85"
        alt="Mechanic working on a performance car"
      />
    </section>
  )
}
