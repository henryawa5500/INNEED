function CategoryGlyph({ title }) {
  const commonProps = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.9",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className: "category-svg",
    "aria-hidden": "true",
  };

  switch (title) {
    case "Tutoring":
      return (
        <svg {...commonProps}>
          <path d="M5 6.5A2.5 2.5 0 0 1 7.5 4H19v14H7.5A2.5 2.5 0 0 0 5 20V6.5Z" />
          <path d="M8 7h8" />
          <path d="M8 10h7" />
          <path d="M8 13h5" />
        </svg>
      );
    case "Delivery":
      return (
        <svg {...commonProps}>
          <circle cx="6.5" cy="17.5" r="2.5" />
          <circle cx="17.5" cy="17.5" r="2.5" />
          <path d="M6.5 17.5h4.8l2.7-5h3.5" />
          <path d="M10 12.5l2.4 5" />
          <path d="M8.8 12.5H6.2" />
          <path d="M16.2 10h2.4" />
        </svg>
      );
    case "Event Staff":
      return (
        <svg {...commonProps}>
          <path d="M4 10.5h16" />
          <path d="M7 7.5v6" />
          <path d="M17 7.5v6" />
          <rect x="5.5" y="10.5" width="13" height="9" rx="1.5" />
          <path d="M9 14h6" />
        </svg>
      );
    case "Errands":
      return (
        <svg {...commonProps}>
          <path d="M7 8h10l-1 11H8L7 8Z" />
          <path d="M10 8a2 2 0 1 1 4 0" />
          <path d="M10 13.5l1.3 1.4L14 12.6" />
        </svg>
      );
    case "Cleaner":
      return (
        <svg {...commonProps}>
          <path d="M12 4v11" />
          <path d="M8 15h8" />
          <path d="M6.5 15 8 20h8l1.5-5" />
          <path d="M9 15v5" />
          <path d="M12 15v5" />
          <path d="M15 15v5" />
        </svg>
      );
    case "Gardener":
      return (
        <svg {...commonProps}>
          <path d="M19 4c-7 1-11 5-12 12 7-1 11-5 12-12Z" />
          <path d="M7 17c2-2 4-4 7-7" />
          <path d="M5 20c1-2 2-3 3-4" />
        </svg>
      );
    case "Tailor":
      return (
        <svg {...commonProps}>
          <circle cx="6" cy="6" r="3" />
          <circle cx="6" cy="18" r="3" />
          <path d="M20 4L8.1 15.9" />
          <path d="M14.5 14.5L20 20" />
        </svg>
      );
    case "Care Taker":
      return (
        <svg {...commonProps}>
          <circle cx="8" cy="9" r="2.5" />
          <circle cx="16" cy="9" r="2.5" />
          <path d="M3.5 18c0.8-2.5 2.6-4 4.5-4s3.7 1.5 4.5 4" />
          <path d="M11.5 18c0.8-2.2 2.3-3.4 4.5-3.4 2 0 3.6 1.2 4.5 3.4" />
        </svg>
      );
    default:
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="12" r="6" />
        </svg>
      );
  }
}

function CategoryCard({ title, count, active, onClick }) {
  return (
    <button
      type="button"
      className={`category-card ${active ? "active" : ""}`}
      onClick={() => onClick(title)}
    >
      <span className="category-icon">
        <CategoryGlyph title={title} />
      </span>
      <h3>{title}</h3>
      <div className="category-meta">
        <p>{count} jobs available</p>
      </div>
    </button>
  );
}

export default CategoryCard;
