function CategoryCard({ title, count, active, onClick }) {
  return (
    <button
      type="button"
      className={`category-card ${active ? "active" : ""}`}
      onClick={() => onClick(title)}
    >
      <span className="category-icon" aria-hidden="true">
        <span className="category-icon-dot" />
      </span>
      <h3>{title}</h3>
      <div className="category-meta">
        <p>{count} jobs available</p>
        <span className="card-arrow" aria-hidden="true">
          {"->"}
        </span>
      </div>
    </button>
  );
}

export default CategoryCard;
