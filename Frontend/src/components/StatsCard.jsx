import "./StatsCard.css";

const StatsCard = ({ title, progress, children }) => {
  return (
    <section className="stats-card">
      <header className="stats-card__header">
        {title && <h3 className="stats-card__title">{title}</h3>}

        {progress != null && (
          <span className="stats-card__percent">{progress}%</span>
        )}
      </header>

      <div className="stats-card__stats">{children}</div>

      {progress != null && (
        <div className="stats-card__progress">
          <div
            className="stats-card__progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </section>
  );
};

export default StatsCard;
