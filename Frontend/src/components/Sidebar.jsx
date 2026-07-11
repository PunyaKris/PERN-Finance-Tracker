import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { CircleHelp, Home, Settings, User, Wallet } from "lucide-react";
import { getAllBudgetService } from "../services/budgetService";
import { iconRegistry } from "../utils/iconRegistry";
import { getAccentStyleVars } from "../utils/accentRegistry";
import "./Sidebar.css";

const Sidebar = () => {
  const location = useLocation();
  const [budgets, setBudgets] = useState([]);
  const [showBudgets, setShowBudgets] = useState(false);

  const pathname = location.pathname;
  const isProfileActive = pathname === "/profile";
  const isDashboardActive = pathname === "/dashboard";
  const isBudgetActive = pathname.startsWith("/budget");
  const isUnconsideredActive = pathname === "/unconsideredTransaction";
  const isSettingsActive = pathname === "/settings";

  useEffect(() => {
    const getBudgets = async () => {
      const response = await getAllBudgetService();
      setBudgets(response.data);
    };

    getBudgets();

    window.addEventListener("budgets:changed", getBudgets);

    return () => {
      window.removeEventListener("budgets:changed", getBudgets);
    };
  }, []);

  useEffect(() => {
    if (isBudgetActive) {
      setShowBudgets(true);
    }
  }, [isBudgetActive]);

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
            <NavLink
              className={({ isActive }) =>
                `sidebar__link ${isActive || isProfileActive ? "sidebar__link--active" : ""}`.trim()
              }
              to="/profile"
            >
              <User className="sidebar__nav-icon" size={18} />
              Profile
            </NavLink>
          </li>

          <li className="sidebar__item">
            <NavLink
              className={({ isActive }) =>
                `sidebar__link ${isActive || isDashboardActive ? "sidebar__link--active" : ""}`.trim()
              }
              to="/dashboard"
            >
              <Home className="sidebar__nav-icon" size={18} />
              Dashboard
            </NavLink>
          </li>

          <li className="sidebar__item">
            <button
              className={`sidebar__button ${isBudgetActive ? "sidebar__button--active" : ""}`.trim()}
              type="button"
              onClick={() => setShowBudgets(!showBudgets)}
            >
              <span className="sidebar__button-label">
                <Wallet className="sidebar__nav-icon" size={18} />
                Budgets
              </span>
              <span>{showBudgets ? "▲" : "▼"}</span>
            </button>

            {showBudgets && (
              <ul className="sidebar__sublist">
                {budgets.map((budget) => {
                  const Icon = iconRegistry[budget.icon]?.icon;
                  const accentStyle = getAccentStyleVars(budget?.accentColor);
                  return (
                    <li key={budget.id}>
                      <NavLink
                        className={({ isActive }) =>
                          `sidebar__sublink ${isActive ? "sidebar__sublink--active" : ""}`.trim()
                        }
                        to={`/budget/${budget.id}`}
                      >
                        {Icon && (
                          <span
                            className="sidebar__budget-icon"
                            style={{
                              background: accentStyle["--accent-icon-bg"],
                              color: accentStyle["--accent-icon-color"],
                              borderColor: accentStyle["--accent-hover-border"],
                            }}
                          >
                            <Icon size={16} />
                          </span>
                        )}
                        {budget.name}
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            )}
          </li>

          <li className="sidebar__item">
            <NavLink
              className={({ isActive }) =>
                `sidebar__link ${isActive || isUnconsideredActive ? "sidebar__link--active" : ""}`.trim()
              }
              to="/unconsideredTransaction"
            >
              <CircleHelp className="sidebar__nav-icon" size={18} />
              Unconsidered Transactions
            </NavLink>
          </li>

          <li className="sidebar__item">
            <button
              className={`sidebar__button ${isSettingsActive ? "sidebar__button--active" : ""}`.trim()}
              type="button"
            >
              <span className="sidebar__button-label">
                <Settings className="sidebar__nav-icon" size={18} />
                Settings
              </span>
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
