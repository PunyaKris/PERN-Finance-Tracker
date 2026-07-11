import { formatCurrency } from "../utils/formatters";
import "./Stat.css";

const Stat = ({ title, value }) => {
  return (
    <div className="stat">
      <span className="stat__title">{title}</span>
      <span className="stat__value">{formatCurrency(value)}</span>
    </div>
  );
};

export default Stat;
