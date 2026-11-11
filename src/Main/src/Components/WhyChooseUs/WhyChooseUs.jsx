import {
  ArrowUpRight,
  Lightbulb,
  Settings,
  Code2,
  BarChart3,
} from "lucide-react";

import "./WhyChooseUs.css";

/* =========================================================
   WHY CHOOSE US FEATURES
========================================================= */

const FEATURES = [
  {
    id: 1,
    icon: Lightbulb,
    title: "AI-First Approach",
    description:
      "Every solution we build leverages intelligent automation to reduce costs and accelerate outcomes.",
  },
  {
    id: 2,
    icon: Settings,
    title: "End-to-End Delivery",
    description:
      "From discovery to deployment and beyond — one partner, complete accountability, zero handoff gaps.",
  },
  {
    id: 3,
    icon: Code2,
    title: "Scalable Architecture",
    description:
      "Infrastructure and code built to grow with your business, not against it.",
  },
  {
    id: 4,
    icon: BarChart3,
    title: "Industry Expertise",
    description:
      "Deep domain knowledge across hospitality, events, retail, and professional services.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="wcu-section">
      <div className="wcu-container">
        {/* =================================================
            LEFT CONTENT
        ================================================= */}

        <div className="wcu-content">
          {/* Badge */}
          <span className="wcu-badge">WHY CHOOSE US</span>

          {/* Heading */}
          <h2 className="wcu-heading">
            Built for Scale,
            <span>Engineered for Results</span>
          </h2>

          {/* Description */}
          <p className="wcu-description">
            We don't just build software — we build competitive advantage.
            Every solution is designed with the end goal in mind: measurable
            business impact.
          </p>

          {/* CTA */}
          <a href="/work" className="wcu-cta">
            <span>See Our Work</span>
            <ArrowUpRight size={20} strokeWidth={2.2} />
          </a>
        </div>

        {/* =================================================
            RIGHT FEATURE CARDS (with timeline)
        ================================================= */}

        <div className="wcu-features">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;

            return (
              <div className="wcu-feature" key={feature.id}>
                {/* Number */}
                <div className="wcu-feature-number">
                  {String(feature.id).padStart(2, "0")}
                </div>

                {/* Icon */}
                <div className="wcu-feature-icon">
                  <Icon size={34} strokeWidth={1.8} />
                </div>

                {/* Feature Content */}
                <div className="wcu-feature-content">
                  <h3 className="wcu-feature-title">{feature.title}</h3>

                  <p className="wcu-feature-description">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
