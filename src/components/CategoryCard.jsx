function CategoryCard({ title, count, active, onClick }) {
  return (
    <button
      type="button"
      className={`category-card ${active ? "active" : ""}`}
      onClick={() => onClick(title)}
    >
      <h3>{title}</h3>
      <p>{count} jobs available</p>
    </button>
  );
}

export default CategoryCard;
