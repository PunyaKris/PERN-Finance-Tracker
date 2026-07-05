import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllBudgetService } from "../services/budgetService";
import { iconRegistry } from "../utils/iconRegistry";
import "./Sidebar.css";

const Sidebar = () => {
  const [budgets, setBudgets] = useState([]);
  const [showBudgets, setShowBudgets] = useState(false);

  useEffect(() => {
    const getBudgets = async () => {
      const response = await getAllBudgetService();
      setBudgets(response.data);
    };
    getBudgets();
  }, []);

  return (
    <aside className="sidebar">
      <header className="sidebar__header">
        <div className="sidebar__brand-mark" aria-hidden="true" />
        <div className="sidebar__brand-copy">
          <h2 className="sidebar__brand">Finance Tracker</h2>
          <p className="sidebar__tagline">Track every move</p>
        </div>
      </header>

      <nav className="sidebar__nav">
        <ul className="sidebar__list">
          <li className="sidebar__item">
            <Link className="sidebar__link" to="/profile">
              Profile
            </Link>
          </li>

          <li className="sidebar__item">
            <Link className="sidebar__link" to="/dashboard">
              Dashboard
            </Link>
          </li>

          <li className="sidebar__item">
            <button
              className="sidebar__button"
              type="button"
              onClick={() => setShowBudgets(!showBudgets)}
            >
              <span>Budgets</span>
              <span>{showBudgets ? "▲" : "▼"}</span>
            </button>

            {showBudgets && (
              <ul className="sidebar__sublist">
                {budgets.map((budget) => {
                  const Icon = iconRegistry[budget.icon]?.icon;
                  return (
                    <li key={budget.id}>
                      <Link
                        className="sidebar__sublink"
                        to={`/budget/${budget.id}`}
                      >
                        {Icon && <Icon size={16} />} {budget.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </li>

          <li className="sidebar__item">
            <Link className="sidebar__link" to="/unconsideredTransaction">
              Unconsidered Transactions
            </Link>
          </li>

          <li className="sidebar__item">
            <button className="sidebar__button" type="button">
              <span>Settings</span>
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
