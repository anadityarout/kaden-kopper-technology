import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import "./Work.css";

// Existing AWS Lambda API
const API_ENDPOINT =
  "https://66ou0fp7m1.execute-api.ap-south-1.amazonaws.com/prod/projects";

// Where the "View All Projects" button goes. Set to "" to hide the button.
 const VIEW_ALL_URL = "/project";

export default function Work() {
  const [projects, setProjects] = useState([]);
  const [index, setIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(3);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const touchStartX = useRef(0);

  // Fetch projects saved from the Admin Dashboard
  useEffect(() => {
    const controller = new AbortController();

    async function fetchProjects() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(API_ENDPOINT, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Failed to load projects.");
        }

        const data = await response.json();
        const items = Array.isArray(data)
          ? data
          : Array.isArray(data.projects)
          ? data.projects
          : [];

        // Show only projects assigned to the Work section
        const workItems = items.filter(
          (project) =>
            String(project.category || "")
              .trim()
              .toLowerCase() === "work"
        );

        setProjects(workItems);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Work projects error:", err);
          setError("Unable to load projects. Please try again later.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchProjects();

    return () => controller.abort();
  }, []);

  // Responsive carousel: 1 / 2 / 3 cards per view
  useEffect(() => {
    const updateCardsPerView = () => {
      if (window.innerWidth < 640) {
        setCardsPerView(1);
      } else if (window.innerWidth < 1024) {
        setCardsPerView(2);
      } else {
        setCardsPerView(3);
      }
    };

    updateCardsPerView();
    window.addEventListener("resize", updateCardsPerView);

    return () => {
      window.removeEventListener("resize", updateCardsPerView);
    };
  }, []);

  const maxIndex = Math.max(projects.length - cardsPerView, 0);

  const goPrev = () => {
    setIndex((current) => Math.max(current - 1, 0));
  };

  const goNext = () => {
    setIndex((current) => Math.min(current + 1, maxIndex));
  };

  useEffect(() => {
    setIndex((current) => Math.min(current, maxIndex));
  }, [maxIndex]);

  // Swipe support for touch screens
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(diff) > 50) {
      if (diff < 0) goNext();
      else goPrev();
    }
  };

  // Decides which visible card is left / center / right
  const getSlideClass = (i) => {
    const pos = i - index;
    if (pos < 0 || pos >= cardsPerView) return "";

    if (cardsPerView === 1) return "work-slide--center";

    if (cardsPerView === 3) {
      if (projects.length === 1) return "work-slide--center";
      if (pos === 0) return "work-slide--left";
      if (pos === 1) return "work-slide--center";
      if (pos === 2) return "work-slide--right";
    }

    return "";
  };

  const isCentered = projects.length <= cardsPerView;

  return (
    <section className="work-section" id="work">
      {/* Decorative background shapes */}
      <span className="work-decor work-decor--ring" aria-hidden="true" />
      <span className="work-decor work-decor--dots-left" aria-hidden="true" />
      <span className="work-decor work-decor--dots-right" aria-hidden="true" />

      <div className="work-container">
        <p className="work-eyebrow">Our Work</p>

        <div className="work-divider" aria-hidden="true">
          <span className="work-divider-diamond" />
        </div>

        <h2 className="work-heading">
          Featured <span>Projects</span>
        </h2>

        <p className="work-subtitle">
          Discover our recent work across different industries. Each project
          reflects our commitment to quality, creativity and impactful
          solutions.
        </p>

        {loading ? (
          <p className="work-status">Loading projects...</p>
        ) : error ? (
          <p className="work-status">{error}</p>
        ) : projects.length === 0 ? (
          <p className="work-status">No Work projects available yet.</p>
        ) : (
          <>
            <div className="work-carousel">
              {!isCentered && (
                <button
                  type="button"
                  onClick={goPrev}
                  disabled={index === 0}
                  aria-label="Previous projects"
                  className="work-arrow work-arrow--left"
                >
                  <ChevronLeft size={22} />
                </button>
              )}

              <div
                className="work-track-wrapper"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                <div
                  className={`work-track ${
                    isCentered ? "work-track--centered" : ""
                  }`}
                  style={{
                    transform: `translateX(-${
                      (index * 100) / cardsPerView
                    }%)`,
                  }}
                >
                  {projects.map((project, i) => (
                    <div
                      key={project.id || i}
                      className={`work-slide ${getSlideClass(i)}`}
                      style={{ width: `${100 / cardsPerView}%` }}
                    >
                      <ProjectCard project={project} />
                    </div>
                  ))}
                </div>
              </div>

              {!isCentered && (
                <button
                  type="button"
                  onClick={goNext}
                  disabled={index >= maxIndex}
                  aria-label="Next projects"
                  className="work-arrow work-arrow--right"
                >
                  <ChevronRight size={22} />
                </button>
              )}
            </div>

            {maxIndex > 0 && (
              <div className="work-dots">
                {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setIndex(i)}
                    aria-label={`Go to slide ${i + 1}`}
                    className={`work-dot ${
                      i === index ? "work-dot--active" : ""
                    }`}
                  />
                ))}
              </div>
            )}

            {VIEW_ALL_URL && (
              <div className="work-viewall">
                <a href={VIEW_ALL_URL} className="work-viewall-btn">
                  View All Projects <ArrowRight size={18} />
                </a>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

function ProjectCard({ project }) {
  const image =
    project.image ||
    project.imageUrl ||
    project.preview ||
    project.fileUrl ||
    "";

  const name = project.name || project.title || "Untitled Project";

  const description = project.description || "Explore this project.";

  const category = project.workCategory || project.category || "Work";

  const projectUrl = (
    project.url ||
    project.liveUrl ||
    project.projectLink ||
    project.link ||
    ""
  ).trim();

  const validUrl = /^https?:\/\//i.test(projectUrl);

  return (
    <article className="work-card">
      <div className="work-card-media">
        {image ? (
          <img
            src={image}
            alt={name}
            className="work-card-image"
            loading="lazy"
          />
        ) : (
          <div className="work-card-image work-card-image--empty">
            Project image unavailable
          </div>
        )}
      </div>

      <div className="work-card-body">
        <span className="work-card-category">{category}</span>

        <h3 className="work-card-title">{name}</h3>

        <p className="work-card-description">{description}</p>

        {validUrl && (
          <div className="work-card-footer">
            <a
              href={projectUrl}
              className="work-card-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              View Project <ArrowRight size={16} aria-hidden="true" />
            </a>

            <a
              href={projectUrl}
              className="work-card-circle"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${name}`}
              tabIndex={-1}
            >
              <ArrowRight size={18} aria-hidden="true" />
            </a>
          </div>
        )}
      </div>
    </article>
  );
}
