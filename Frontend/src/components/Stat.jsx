import "./Stat.css";

const Stat = ({ title, value }) => {
  return (
    <div className="stat">
      <span className="stat__title">{title}</span>
      <span className="stat__value">{value}</span>
    </div>
  );
};

export default Stat;
