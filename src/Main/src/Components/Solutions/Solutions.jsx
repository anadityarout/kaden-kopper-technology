import {
  Code2,
  Smartphone,
  Search,
  Video,
  Palette,
  Megaphone,
  ArrowUpRight,
} from "lucide-react";

import "./Solutions.css";

const SOLUTIONS = [
  {
    id: 1,
    icon: Code2,
    title: "Web Development",
    description:
      "Modern, responsive and high-performance websites built to create strong digital experiences.",
    url: "/services/web-development",
  },
  {
    id: 2,
    icon: Smartphone,
    title: "App Development",
    description:
      "Scalable mobile applications designed to deliver seamless experiences across devices.",
    url: "/services/app-development",
  },
  {
    id: 3,
    icon: Search,
    title: "SEO",
    description:
      "Search strategies that improve visibility, attract qualified traffic and support long-term growth.",
    url: "/services/seo",
  },
  {
    id: 4,
    icon: Video,
    title: "Video Editing",
    description:
      "Professional and engaging video content created for brands, campaigns and digital platforms.",
    url: "/services/video-editor",
  },
  {
    id: 5,
    icon: Palette,
    title: "Graphic Designing",
    description:
      "Creative visual solutions that build a consistent and memorable brand identity.",
    url: "/services/graphic-designer",
  },
  {
    id: 6,
    icon: Megaphone,
    title: "Marketing",
    description:
      "Data-driven marketing strategies designed to increase reach, engagement and business growth.",
    url: "/services/marketing",
  },
];

export default function Solutions() {
  return (
    <section className="solutions-section">
      {/* BACKGROUND DECORATION */}
      <span className="solutions-shape solutions-shape-1" aria-hidden="true" />
      <span className="solutions-shape solutions-shape-2" aria-hidden="true" />
      <span className="solutions-shape solutions-shape-3" aria-hidden="true" />
      <span className="solutions-shape solutions-shape-4" aria-hidden="true" />

      <span className="solutions-dots solutions-dots-1" aria-hidden="true" />
      <span className="solutions-dots solutions-dots-2" aria-hidden="true" />
      <span className="solutions-dots solutions-dots-3" aria-hidden="true" />

      <div className="solutions-container">
        {/* HEADER */}
        <div className="solutions-header">
          <span className="solutions-eyebrow">OUR SOLUTIONS</span>

          <h2 className="solutions-heading">
            Solutions That <span>Empower Your Business</span>
          </h2>

          <p className="solutions-intro">
            From strategy to execution, we combine technology, creativity and
            expertise to build solutions that help businesses move forward.
          </p>
        </div>

        {/* CARDS */}
        <div className="solutions-grid">
          {SOLUTIONS.map((item) => {
            const Icon = item.icon;

            return (
              <article className="solutions-card" key={item.id}>
                {/* ICON */}
                <div className="solutions-icon-box">
                  <Icon size={26} strokeWidth={2} />
                </div>

                {/* CONTENT */}
                <div className="solutions-card-body">
                  <h3 className="solutions-card-title">{item.title}</h3>

                  <p className="solutions-card-description">
                    {item.description}
                  </p>

                  <a href={item.url} className="solutions-card-link">
                    <span>Learn More</span>
                    <ArrowUpRight size={18} strokeWidth={2.2} />
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
