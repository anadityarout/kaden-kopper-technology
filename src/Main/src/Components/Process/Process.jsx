import { Lightbulb, PencilRuler, Code2, Rocket } from "lucide-react";

import "./Process.css";

const STEPS = [
  {
    id: 1,
    icon: Lightbulb,
    title: "Discovery & Strategy",
    description:
      "We immerse ourselves in your business context, goals, and constraints to define the right solution.",
  },
  {
    id: 2,
    icon: PencilRuler,
    title: "Design & Architecture",
    description:
      "UX-led design paired with scalable technical architecture — beauty and engineering in sync.",
  },
  {
    id: 3,
    icon: Code2,
    title: "Build & Integrate",
    description:
      "Agile development with continuous delivery, real feedback loops, and zero surprises.",
  },
  {
    id: 4,
    icon: Rocket,
    title: "Launch & Scale",
    description:
      "We deploy, monitor, and iterate — evolving your platform as your business grows.",
  },
];

export default function Process() {
  return (
    <section className="process-section">
      {/* BACKGROUND DECORATION */}
      <span className="process-shape process-shape-1" aria-hidden="true" />
      <span className="process-shape process-shape-2" aria-hidden="true" />
      <span className="process-shape process-shape-3" aria-hidden="true" />
      <span className="process-shape process-shape-4" aria-hidden="true" />

      <span className="process-dots process-dots-1" aria-hidden="true" />
      <span className="process-dots process-dots-2" aria-hidden="true" />

      <div className="process-container">
        {/* Header */}
        <div className="process-header">
          <div className="process-eyebrow-row">
            <span
              className="process-line process-line-left"
              aria-hidden="true"
            />

            <span className="process-eyebrow">HOW WE WORK</span>

            <span
              className="process-line process-line-right"
              aria-hidden="true"
            />
          </div>

          <h2 className="process-heading">
            Our <span>Proven Process</span>
          </h2>

          <p className="process-intro">
            A structured approach that turns ideas into impactful digital
            solutions.
          </p>
        </div>

        {/* Process Cards */}
        <div className="process-steps">
          {STEPS.map((step) => {
            const Icon = step.icon;

            return (
              <div className="process-step" key={step.id}>
                <div className="process-card">
                  {/* Number */}
                  <span className="process-number">
                    {String(step.id).padStart(2, "0")}
                  </span>

                  {/* Icon */}
                  <div className="process-icon-box">
                    <Icon size={30} strokeWidth={1.8} />
                  </div>

                  {/* Title */}
                  <h3 className="process-step-title">{step.title}</h3>

                  {/* Description */}
                  <p className="process-step-description">
                    {step.description}
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
