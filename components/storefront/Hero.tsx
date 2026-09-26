import { ArrowRight } from 'lucide-react'

export function Hero() {
  return (
    <section className="hero">
      <div className="hero-copy">
        <p className="eyebrow">THE PERFORMANCE PARTS DEPOT</p>
        <h1>
          Built for the
          <br />
          <em>drive.</em>
        </h1>
        <p className="hero-text">
          Serious parts for people who take the long way home. Shop trusted performance, braking and
          suspension parts—fitment guaranteed.
        </p>
        <button
          className="red-button"
          onClick={() => document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })}
        >
          Shop all parts <ArrowRight data-icon="inline-end" />
        </button>
      </div>
      <div className="hero-visual">
        <img
          src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1600&q=90"
          alt="Red sports car on a road"
        />
        <div className="hero-stamp">
          EST.
          <br />
          <strong>2018</strong>
          <br />
          DRIVE
          <br />
          DIFFERENT
        </div>
      </div>
    </section>
  )
}
