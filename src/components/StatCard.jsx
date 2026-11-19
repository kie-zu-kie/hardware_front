import "./../astylecomp/StatCard.css";

function StatCard({
  icon: Icon,
  label,
  value,
  description,
  trend
}) {
  return (
    <div className="stat-card">
      <div className="stat-card-top">
        <div className="stat-icon">
          <Icon size={19} />
        </div>

        {trend && (
          <span className="trend">
            ↑ {trend}
          </span>
        )}
      </div>

      <div className="stat-value">
        {value}
      </div>

      <div className="stat-label">
        {label}
      </div>

      {description && (
        <div className="stat-description">
          {description}
        </div>
      )}
    </div>
  );
}

export default StatCard;