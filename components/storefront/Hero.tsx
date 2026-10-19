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
          Serious parts for people who take the long way home. Shop trusted
          performance, braking and suspension parts—fitment guaranteed.
        </p>
        <button
          className="red-button"
          onClick={() =>
            document
              .getElementById("catalog")
              ?.scrollIntoView({ behavior: "smooth" })
          }
        >
          Shop all parts <ArrowRight data-icon="inline-end" />
        </button>
      </div>
      <div className="hero-visual rounded-md">
        <img
          src="https://res.cloudinary.com/vhh5uvey/image/upload/v1792160279/kebumotorspares/products/ycikoik2xyj9j9owac5s.jpg?auto=format&fit=crop&w=1600&q=90"
          alt="Red sports car on a road"
        />
        <div className="hero-stamp">
          DRIVE.
          <br />
          <strong>With Confidence</strong>
          <br />
          DRIVE
          <br />
          DIFFERENT
        </div>
      </div>
    </section>
  );
}

