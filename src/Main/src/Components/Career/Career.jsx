import React, { useEffect, useMemo, useState } from "react";
import "./Career.css";

import {
  FaGraduationCap,
  FaUsers,
  FaLightbulb,
  FaHeart,
  FaBookOpen,
  FaBullseye,
  FaSearch,
  FaFileAlt,
  FaChartBar,
  FaChartLine,
  FaBalanceScale,
  FaBriefcase,
  FaUser,
} from "react-icons/fa";

/* =====================================================
   API
===================================================== */

const CAREER_API_URL =
  "https://66ou0fp7m1.execute-api.ap-south-1.amazonaws.com/prod/careerbanner";

const JOB_API_URL =
  "https://66ou0fp7m1.execute-api.ap-south-1.amazonaws.com/prod/job";

/* =====================================================
   STATIC DATA
===================================================== */

/* Hero — glass strip at the bottom of the banner.
   tone: cyan | blue | violet (icon colour) */
const HERO_FEATURES = [
  { icon: <FaUsers />, tone: "cyan", title: "Great", text: "Environment" },
  { icon: <FaChartLine />, tone: "blue", title: "Career", text: "Growth" },
  {
    icon: <FaGraduationCap />,
    tone: "violet",
    title: "Learning",
    text: "Opportunities",
  },
  {
    icon: <FaBalanceScale />,
    tone: "cyan",
    title: "Work-Life",
    text: "Balance",
  },
];

/* Hero — avatar row. Put a photo path in `src` to show a real face,
   e.g. { src: "/team/anita.jpg", alt: "Anita" }. Empty src shows an icon. */
const HERO_PROOF = {
  title: "500+ Professionals",
  text: "Growing With Us",
  avatars: [
    { src: "", alt: "Team member 1" },
    { src: "", alt: "Team member 2" },
    { src: "", alt: "Team member 3" },
    { src: "", alt: "Team member 4" },
  ],
};

const HERO_FALLBACK_TITLE = "More Than a Job. Build Something Meaningful.";

const HERO_FALLBACK_TEXT =
  "At Kaden Koppers Technology, we empower our people to learn, create, and grow in an environment where ideas are valued and every contribution makes an impact.";

// tone: blue | purple | gradient (gradient is used by the heart icon)
const CAREER_BENEFITS = [
  {
    icon: <FaFileAlt />,
    tone: "blue",
    title: "Real Projects",
    text: "Work on meaningful projects for global clients.",
  },
  {
    icon: <FaGraduationCap />,
    tone: "blue",
    title: "Continuous Learning",
    text: "Access to new technologies and growth opportunities.",
  },
  {
    icon: <FaUsers />,
    tone: "blue",
    title: "Collaborative Culture",
    text: "Work with talented and supportive teams.",
  },
  {
    icon: <FaLightbulb />,
    tone: "purple",
    title: "Creative Freedom",
    text: "Bring your ideas and experiments to life.",
  },
  {
    icon: <FaChartBar />,
    tone: "blue",
    title: "Career Growth",
    text: "Take on new challenges and grow with us.",
  },
  {
    icon: <FaHeart />,
    tone: "gradient",
    title: "Work-Life Balance",
    text: "We value your well-being and a healthy work culture.",
  },
];

// position: places the item on the desktop diagram (see CSS)
// tone: blue | cyan | violet (icon colour)
const IMPACT_ITEMS = [
  {
    number: "01",
    title: "Learn",
    text: "Access new skills and technologies.",
    icon: <FaBookOpen />,
    position: "one",
    tone: "blue",
  },
  {
    number: "02",
    title: "Collaborate",
    text: "Work with talented and supportive teams.",
    icon: <FaUsers />,
    position: "two",
    tone: "violet",
  },
  {
    number: "03",
    title: "Create",
    text: "Turn ideas into real solutions.",
    icon: <FaFileAlt />,
    position: "three",
    tone: "blue",
  },
  {
    number: "04",
    title: "Grow",
    text: "Take on new challenges and grow in your career.",
    icon: <FaChartBar />,
    position: "four",
    tone: "cyan",
  },
  {
    number: "05",
    title: "Make an Impact",
    text: "Contribute to meaningful projects for global clients.",
    icon: <FaBullseye />,
    position: "five",
    tone: "violet",
  },
  {
    number: "06",
    title: "Belong",
    text: "Be part of a positive and inclusive culture.",
    icon: <FaHeart />,
    position: "six",
    tone: "violet",
  },
];

const NUMBER_ITEMS = [
  {
    number: "28,625",
    label: "Applications Received",
    growth: "▲ 18.4%",
    className: "blue",
    points:
      "5,59 25,52 47,45 68,56 90,48 112,39 134,48 156,33 178,49 200,42 222,29 244,20 267,10",
    gradientId: "blueGradient",
    gradientColor: "#1264ee",
  },
  {
    number: "86.4%",
    label: "Employee Retention",
    growth: "▲ 12.2%",
    className: "green",
    points:
      "5,62 27,54 49,44 71,56 93,46 115,36 137,45 159,27 181,40 203,49 225,35 247,25 267,15",
    gradientId: "greenGradient",
    gradientColor: "#08a96b",
  },
  {
    number: "92.8%",
    label: "Employee Satisfaction",
    growth: "▲ 15.6%",
    className: "cyan",
    points:
      "5,60 27,52 49,43 71,55 93,47 115,38 137,46 159,30 181,43 203,50 225,38 247,22 267,14",
    gradientId: "cyanGradient",
    gradientColor: "#08a8d9",
  },
  {
    number: "88.6%",
    label: "Work-Life Balance",
    growth: "▲ 8.3%",
    className: "purple",
    points:
      "5,59 27,50 49,43 71,55 93,45 115,37 137,48 159,31 181,43 203,51 225,40 247,24 267,12",
    gradientId: "purpleGradient",
    gradientColor: "#3437f5",
  },
];

const HIRING_STEPS = [
  {
    number: "01",
    title: "Apply",
    text: "Submit your application and portfolio.",
    icon: <FaFileAlt />,
  },
  {
    number: "02",
    title: "Review",
    text: "Our team reviews your experience.",
    icon: <FaSearch />,
  },
  {
    number: "03",
    title: "Interview",
    text: "Meet the team and discuss your skills.",
    icon: <FaUsers />,
  },
  {
    number: "04",
    title: "Challenge",
    text: "Show us how you solve real-world problems.",
    icon: <FaLightbulb />,
  },
  {
    number: "05",
    title: "Welcome",
    text: "Join the team and start building great work.",
    icon: <FaBriefcase />,
  },
];

/* Job filter pills -> backend categories (lowercase) */
const JOB_CATEGORY_MAP = {
  Development: ["web development", "app development"],
  Design: ["graphic design"],
  Marketing: ["marketing"],
  SEO: ["seo"],
  Creative: ["video editor"],
  Business: ["business development"],
};

const JOB_FILTERS = ["All", ...Object.keys(JOB_CATEGORY_MAP)];

/* Backend category -> icon type */
const JOB_ICON_BY_CATEGORY = {
  "web development": "code",
  "app development": "mobile",
  "graphic design": "design",
  seo: "seo",
  "video editor": "video",
  marketing: "marketing",
  "business development": "layers",
};

/* =====================================================
   HELPERS
===================================================== */

const normalize = (value) => String(value || "").trim().toLowerCase();

const toList = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.data)) return data.data;
  return [];
};

const getImageUrl = (item) =>
  item?.preview || item?.image || item?.imageUrl || item?.fileUrl || "";

/* Splits "More Than a Job. Build Something Meaningful." into
   the white first sentence and the gradient rest. */
const splitHeadline = (text) => {
  const clean = String(text || "").trim();
  const match = clean.match(/^(.+?[.!?])\s+(.+)$/);

  return match
    ? { first: match[1], second: match[2] }
    : { first: clean, second: "" };
};

/* Loads a list from an API endpoint */
function useApiList(url, errorMessage) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(errorMessage);
        }

        const data = await response.json();

        if (!cancelled) {
          setItems(toList(data));
        }
      } catch (err) {
        console.error(`API error (${url}):`, err);

        if (!cancelled) {
          setItems([]);
          setError(errorMessage);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [url, errorMessage]);

  return { items, loading, error };
}

/* =====================================================
   JOB ICON
===================================================== */

function JobIcon({ type }) {
  let shapes;

  switch (type) {
    case "code":
      shapes = (
        <>
          <polyline points="8 6 2 12 8 18" />
          <polyline points="16 6 22 12 16 18" />
        </>
      );
      break;

    case "design":
      shapes = (
        <>
          <path d="M19 3 21 5 9 17l-4 1 1-4L18 2" />
          <path d="m15 5 4 4" />
        </>
      );
      break;

    case "mobile":
      shapes = (
        <>
          <rect x="6" y="2" width="12" height="20" rx="2" />
          <path d="M10 5h4" />
          <circle cx="12" cy="18" r="1" />
        </>
      );
      break;

    case "marketing":
      shapes = (
        <>
          <path d="M3 11 21 5v12L3 14v-3Z" />
          <path d="m7 15 2 6" />
          <path d="M5 17h4" />
        </>
      );
      break;

    case "seo":
      shapes = (
        <>
          <circle cx="10" cy="10" r="7" />
          <path d="m20 20-5-5" />
        </>
      );
      break;

    case "video":
      shapes = (
        <>
          <rect x="3" y="6" width="15" height="12" rx="2" />
          <path d="m18 10 3-2v8l-3-2" />
        </>
      );
      break;

    default:
      shapes = (
        <>
          <path d="M12 3 3 8l9 5 9-5-9-5Z" />
          <path d="m3 12 9 5 9-5" />
          <path d="m3 16 9 5 9-5" />
        </>
      );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {shapes}
    </svg>
  );
}

/* =====================================================
   IMPACT — K LOGO + CONNECTOR LINES
===================================================== */

function KLogo() {
  return (
    <svg className="kk-impact-k" viewBox="0 0 64 64" aria-hidden="true">
      <defs>
        <linearGradient id="kk-k-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#9fe3ff" />
        </linearGradient>
      </defs>
      <path d="M8 4h13v56H8z" fill="url(#kk-k-grad)" />
      <path d="M27 33 46 4h16L40 36z" fill="#ffffff" />
      <path d="M27 33 40 36 62 60H46z" fill="#cdeeff" />
      <path d="M8 43 21 37" stroke="#2a3be6" strokeWidth="2.4" />
    </svg>
  );
}

/* y positions (in px) of the line ends: outer = item side, inner = circle side */
const LINE_ROWS = [
  { out: 45, inn: 113 },
  { out: 147, inn: 147 },
  { out: 249, inn: 183 },
];

function ImpactLines({ side }) {
  const left = side === "left";
  const id = `kk-line-${side}`;

  const paths = left
    ? [
        "M0 45 C45 45 55 113 100 113",
        "M0 147 L100 147",
        "M0 249 C45 249 55 183 100 183",
      ]
    : [
        "M0 113 C45 113 55 45 100 45",
        "M0 147 L100 147",
        "M0 183 C45 183 55 249 100 249",
      ];

  return (
    <div
      className={`kk-impact-lineset kk-impact-lineset-${side}`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 100 300" preserveAspectRatio="none">
        <defs>
          <linearGradient
            id={id}
            gradientUnits="userSpaceOnUse"
            x1="0"
            y1="0"
            x2="100"
            y2="0"
          >
            {left ? (
              <>
                <stop offset="0" stopColor="#19b8ff" stopOpacity="0.28" />
                <stop offset="1" stopColor="#1e7bff" stopOpacity="1" />
              </>
            ) : (
              <>
                <stop offset="0" stopColor="#c23cf2" stopOpacity="1" />
                <stop offset="1" stopColor="#c23cf2" stopOpacity="0.28" />
              </>
            )}
          </linearGradient>
        </defs>

        {paths.map((d) => (
          <path key={d} d={d} stroke={`url(#${id})`} />
        ))}
      </svg>

      {LINE_ROWS.map((row, index) => (
        <React.Fragment key={index}>
          <span
            className={`kk-impact-dot is-out kk-impact-dot-${side}`}
            style={{ top: row.out, left: left ? "0%" : "100%" }}
          />
          <span
            className={`kk-impact-dot is-in kk-impact-dot-${side}`}
            style={{ top: row.inn, left: left ? "100%" : "0%" }}
          />
        </React.Fragment>
      ))}
    </div>
  );
}

/* =====================================================
   NUMBER CHART
===================================================== */

function NumberChart({ item }) {
  const pointsArray = item.points.split(" ").map((point) => {
    const [x, y] = point.split(",");
    return [Number(x), Number(y)];
  });

  const areaPath = `M${pointsArray
    .map(([x, y]) => `${x} ${y}`)
    .join(" L")} L267 75 L5 75 Z`;

  return (
    <div className="kk-number-chart" aria-hidden="true">
      {/* Natural aspect ratio (no "none") so the dots stay round */}
      <svg viewBox="0 0 272 75">
        <defs>
          <linearGradient
            id={item.gradientId}
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop
              offset="0%"
              stopColor={item.gradientColor}
              stopOpacity="0.18"
            />
            <stop
              offset="100%"
              stopColor={item.gradientColor}
              stopOpacity="0"
            />
          </linearGradient>
        </defs>

        <path fill={`url(#${item.gradientId})`} d={areaPath} />

        <polyline
          className={`kk-chart-line kk-chart-${item.className}`}
          points={item.points}
        />

        {pointsArray.map(([cx, cy]) => (
          <circle
            key={`${cx}-${cy}`}
            className={`kk-${item.className}-dot`}
            cx={cx}
            cy={cy}
            r="3"
          />
        ))}
      </svg>
    </div>
  );
}

/* =====================================================
   CAREER PAGE
===================================================== */

function Career() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("All Locations");
  const [typeFilter, setTypeFilter] = useState("Employment Type");

  const {
    items: careerItems,
    loading: careerLoading,
  } = useApiList(CAREER_API_URL, "Unable to load career images.");

  const {
    items: jobs,
    loading: jobsLoading,
    error: jobsError,
  } = useApiList(JOB_API_URL, "Unable to load job openings.");

  /* ---------- banner + life images ---------- */

  const careerBanner =
    careerItems.find((item) => normalize(item.category) === "banner") || null;

  const mobileBanner =
    careerItems.find(
      (item) => normalize(item.category) === "banner mobile"
    ) || null;

  const bannerImageUrl = getImageUrl(careerBanner);
  const mobileBannerImageUrl = getImageUrl(mobileBanner);

  const headline = splitHeadline(careerBanner?.name || HERO_FALLBACK_TITLE);

  const lifeItems = careerItems.filter(
    (item) => normalize(item.category) === "life at kaden kopper"
  );

  /* ---------- filter options built from the jobs ---------- */

  const locationOptions = useMemo(
    () => [
      ...new Set(jobs.map((job) => job.location).filter(Boolean)),
    ],
    [jobs]
  );

  const typeOptions = useMemo(
    () => [
      ...new Set(jobs.map((job) => job.jobType).filter(Boolean)),
    ],
    [jobs]
  );

  /* ---------- filtered jobs ---------- */

  const search = searchTerm.trim().toLowerCase();

  const filteredJobs = jobs.filter((job) => {
    const jobCategory = normalize(job.category);

    const categoryMatch =
      activeCategory === "All" ||
      (JOB_CATEGORY_MAP[activeCategory] || []).includes(jobCategory);

    const locationMatch =
      locationFilter === "All Locations" ||
      job.location === locationFilter;

    const typeMatch =
      typeFilter === "Employment Type" || job.jobType === typeFilter;

    const searchMatch =
      !search ||
      [
        job.jobName,
        job.jobRole,
        job.category,
        job.description,
        job.requirement,
        job.jobType,
      ].some((field) => normalize(field).includes(search));

    return categoryMatch && locationMatch && typeMatch && searchMatch;
  });

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <main className="kk-career-page">
      {/* =================================================
          01 — HERO BANNER
          Desktop: the photo fills the banner, text sits on
          the left, glass feature strip at the bottom right.
          Tablet / mobile: photo on top, text below it, then
          the feature strip (see Career.css).

          Use a banner photo WITHOUT any text or badges baked
          in: the headline, buttons, avatars and strip are all
          live text here. Optional "Banner Mobile" image is
          used up to 760px wide.
      ================================================= */}

      <section className="kk-career-banner" aria-label="Career banner">
        <div className="kk-career-banner-media">
          {bannerImageUrl ? (
            <picture className="kk-career-banner-picture">
              {mobileBannerImageUrl && (
                <source
                  media="(max-width: 760px)"
                  srcSet={mobileBannerImageUrl}
                />
              )}

              <img
                src={bannerImageUrl}
                alt=""
                className="kk-career-banner-image"
                fetchPriority="high"
              />
            </picture>
          ) : (
            <div
              className={`kk-career-banner-placeholder ${
                careerLoading ? "is-loading" : ""
              }`}
              aria-hidden="true"
            />
          )}
        </div>

        <div className="kk-career-hero-overlay">
          <div className="kk-career-hero-content">
            <span className="kk-career-hero-eyebrow">
              <span className="kk-career-hero-dot" />
              JOIN OUR TEAM
            </span>

            <h1>
              <span className="kk-career-hero-title-top">
                {headline.first}
              </span>

              {headline.second && (
                <span className="kk-career-hero-title-grad">
                  {headline.second}
                </span>
              )}
            </h1>

            <p>{careerBanner?.description || HERO_FALLBACK_TEXT}</p>

            <div className="kk-career-hero-actions">
              <a href="#open-positions" className="kk-career-hero-primary">
                Explore Open Positions
                <span aria-hidden="true">→</span>
              </a>

              <a href="#kk-life-section" className="kk-career-hero-secondary">
                <span className="kk-career-play" aria-hidden="true">
                  ▶
                </span>
                Our Culture
              </a>
            </div>

            <div className="kk-career-hero-proof">
              <div className="kk-career-hero-avatars" aria-hidden="true">
                {HERO_PROOF.avatars.map((avatar, index) => (
                  <span className="kk-career-hero-avatar" key={index}>
                    {avatar.src ? (
                      <img src={avatar.src} alt={avatar.alt} loading="lazy" />
                    ) : (
                      <FaUser />
                    )}
                  </span>
                ))}
              </div>

              <div className="kk-career-hero-proof-text">
                <strong>{HERO_PROOF.title}</strong>
                <span>{HERO_PROOF.text}</span>
              </div>
            </div>
          </div>
        </div>

        <ul className="kk-career-hero-features">
          {HERO_FEATURES.map((feature) => (
            <li
              className={`kk-career-hero-feature kk-hero-feature-${feature.tone}`}
              key={feature.title}
            >
              <span className="kk-career-hero-feature-icon" aria-hidden="true">
                {feature.icon}
              </span>

              <span className="kk-career-hero-feature-text">
                <strong>{feature.title}</strong>
                <span>{feature.text}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* =================================================
          02 — WHY WORK WITH US
      ================================================= */}

      <section className="kk-career-benefits">
        {/* Hidden gradient used by the heart icon */}
        <svg
          width="0"
          height="0"
          style={{ position: "absolute" }}
          aria-hidden="true"
          focusable="false"
        >
          <defs>
            <linearGradient
              id="kk-benefit-gradient"
              x1="0"
              y1="0"
              x2="1"
              y2="1"
            >
              <stop offset="0%" stopColor="#1f7bff" />
              <stop offset="100%" stopColor="#b02df0" />
            </linearGradient>
          </defs>
        </svg>

        <div className="kk-career-benefits-container">
          <div className="kk-career-benefits-header">
            <div className="kk-career-heading">
              <div className="kk-career-label">
                <span>WHY WORK WITH US</span>
                <div className="kk-career-line"></div>
              </div>

              <h2>
                More Than a Job.
                <br />
                Build Something Meaningful.
              </h2>
            </div>

            <p className="kk-career-intro">
              We empower our people to learn, create, and grow in an
              environment where ideas are valued and every contribution makes
              an impact.
            </p>
          </div>

          <div className="kk-career-cards">
            {CAREER_BENEFITS.map((item) => (
              <article
                className={`kk-career-card kk-benefit-${item.tone}`}
                key={item.title}
              >
                <div className="kk-career-card-icon">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* =================================================
          03 — LIFE AT KADEN KOPPER
      ================================================= */}

      <section className="kk-life-section" id="kk-life-section">
        <div className="kk-life-container">
          <div className="kk-life-content">
            <div className="kk-life-label">
              <span>LIFE AT KADEN KOPPER</span>
              <div className="kk-life-line"></div>
            </div>

            <h2>People. Ideas. Progress.</h2>

            <p>
              A glimpse into our work culture, team activities and the moments
              that make Kaden Kopper a great place to work.
            </p>
          </div>

          <div className="kk-life-gallery">
            {careerLoading ? (
              <div className="kk-life-loading">Loading images...</div>
            ) : lifeItems.length > 0 ? (
              lifeItems.map((item, index) => {
                const imageUrl = getImageUrl(item);

                return (
                  <div
                    className={`kk-life-image ${index === 0 ? "large" : ""}`}
                    key={item.id || item._id || index}
                  >
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={item.name || "Life at Kaden Kopper"}
                        loading="lazy"
                      />
                    ) : (
                      <div className="kk-life-no-image">No Image</div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="kk-life-empty">
                <p>No Life at Kaden Kopper images available.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* =================================================
          04 — OUR IMPACT
          Desktop (1001px+): circle in the middle, 3 items on
          each side with gradient lines. Below that: centered
          grid (see Career.css).
      ================================================= */}

      <section className="kk-impact-section">
        <div className="kk-impact-container">
          <div className="kk-impact-header">
            <div className="kk-impact-label">
              <span>OUR IMPACT</span>
            </div>

            <h2>
              People. Ideas. Growth<span>.</span>
            </h2>

            <p>
              These values reflect the trust, growth, and impact we've
              achieved together.
            </p>
          </div>

          <div className="kk-impact-diagram">
            <ImpactLines side="left" />
            <ImpactLines side="right" />

            {IMPACT_ITEMS.map((item) => (
              <div
                className={`kk-impact-item kk-impact-${item.position} kk-impact-${item.tone}`}
                key={item.number}
              >
                <div className="kk-impact-icon">
                  <div className="kk-impact-icon-inner">{item.icon}</div>
                </div>

                <div className="kk-impact-text">
                  <span className="kk-impact-number">{item.number}</span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </div>
            ))}

            <div className="kk-impact-center">
              <div className="kk-impact-circle">
                <KLogo />

                <div className="kk-impact-circle-text">
                  YOUR GROWTH
                  <br />
                  OUR COMMITMENT
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================
          05 — OUR NUMBERS
      ================================================= */}

      <section className="kk-numbers-section">
        <div className="kk-numbers-container">
          <div className="kk-numbers-header">
            <div className="kk-numbers-label">
              <span>OUR NUMBERS</span>
            </div>

            <h2>
              Real People. Real <span>Progress.</span>
            </h2>

            <p>
              These numbers reflect the trust, growth, and impact we've
              achieved together.
            </p>
          </div>

          <div className="kk-numbers-grid">
            {NUMBER_ITEMS.map((item) => (
              <article className="kk-number-card" key={item.label}>
                <div className="kk-number-top">
                  <div>
                    <strong>{item.number}</strong>
                    <span>{item.label}</span>
                  </div>

                  <div className="kk-number-growth">{item.growth}</div>
                </div>

                <NumberChart item={item} />
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* =================================================
          06 — OPEN POSITIONS
      ================================================= */}

      <section className="kk-jobs-section" id="open-positions">
        <div className="kk-jobs-container">
          <div className="kk-jobs-header">
            <div className="kk-jobs-heading">
              <div className="kk-jobs-label">
                <span>OPEN POSITIONS</span>
                <div className="kk-jobs-label-line"></div>
              </div>

              <h2>Find Your Next Opportunity</h2>

              <p>
                Explore career opportunities and be part of our growing team.
              </p>
            </div>

            <div className="kk-jobs-filters">
              <div className="kk-job-categories">
                {JOB_FILTERS.map((category) => (
                  <button
                    key={category}
                    type="button"
                    className={activeCategory === category ? "active" : ""}
                    onClick={() => setActiveCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>

              <div className="kk-job-search-row">
                {/* Shown only when the jobs have a "location" field */}
                {locationOptions.length > 0 && (
                  <select
                    className="kk-job-select"
                    value={locationFilter}
                    onChange={(event) => setLocationFilter(event.target.value)}
                    aria-label="Filter by location"
                  >
                    <option>All Locations</option>
                    {locationOptions.map((location) => (
                      <option key={location} value={location}>
                        {location}
                      </option>
                    ))}
                  </select>
                )}

                {typeOptions.length > 0 && (
                  <select
                    className="kk-job-select"
                    value={typeFilter}
                    onChange={(event) => setTypeFilter(event.target.value)}
                    aria-label="Filter by employment type"
                  >
                    <option>Employment Type</option>
                    {typeOptions.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                )}

                <div className="kk-job-search">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <circle cx="11" cy="11" r="7" />
                    <path d="m20 20-4-4" />
                  </svg>

                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search jobs..."
                    aria-label="Search jobs"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="kk-jobs-grid">
            {jobsLoading ? (
              <div className="kk-no-jobs">Loading job openings...</div>
            ) : jobsError ? (
              <div className="kk-no-jobs">{jobsError}</div>
            ) : filteredJobs.length > 0 ? (
              filteredJobs.map((job, index) => (
                <article
                  className="kk-job-card"
                  key={job.id || job._id || index}
                >
                  <div className="kk-job-card-top">
                    <div className="kk-job-icon">
                      <JobIcon
                        type={
                          JOB_ICON_BY_CATEGORY[normalize(job.category)] ||
                          "layers"
                        }
                      />
                    </div>

                    <div className="kk-job-info">
                      <h3>{job.jobName || job.jobRole || "Job Opening"}</h3>

                      <p>
                        {job.jobType || "Full Time"}
                        {job.category ? ` · ${job.category}` : ""}
                      </p>

                      <div className="kk-job-tags">
                        {job.jobRole && <span>{job.jobRole}</span>}
                        {job.category && <span>{job.category}</span>}
                      </div>

                      {job.description && (
                        <p className="kk-job-description">{job.description}</p>
                      )}

                      {/* Point this to your apply page / form */}
                      <a href={job.applyUrl || "#apply"}>
                        View Position
                        <span aria-hidden="true">→</span>
                      </a>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="kk-no-jobs">
                No positions found. Try another category or search.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* =================================================
          07 — HIRING PROCESS
      ================================================= */}

      <section className="kk-hiring-section">
        <div className="kk-hiring-container">
          <div className="kk-hiring-header">
            <div className="kk-hiring-label">
              <span>OUR HIRING PROCESS</span>
              <div className="kk-hiring-label-line"></div>
            </div>

            <h2>From Application to Onboarding</h2>

            <p>A simple and transparent process to help you join our team.</p>
          </div>

          <div className="kk-hiring-process">
            {HIRING_STEPS.map((step, index) => (
              <React.Fragment key={step.number}>
                <div className="kk-hiring-step">
                  <div className="kk-hiring-icon">
                    <div className="kk-hiring-icon-inner">{step.icon}</div>
                  </div>

                  <div className="kk-hiring-content">
                    <span className="kk-hiring-number">{step.number}</span>
                    <h3>{step.title}</h3>
                    <p>{step.text}</p>
                  </div>
                </div>

                {index < HIRING_STEPS.length - 1 && (
                  <div className="kk-hiring-arrow" aria-hidden="true">
                    →
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default Career;
