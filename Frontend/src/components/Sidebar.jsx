import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllBudgetService } from "../services/budgetService";
import { iconRegistry } from "../utils/iconRegistry";

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
    <aside>
      <h2>Finance Tracker</h2>

      <nav>
        <ul>
          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>

          <li>
            <button type="button" onClick={() => setShowBudgets(!showBudgets)}>
              Budgets {showBudgets ? "▲" : "▼"}
            </button>

            {showBudgets && (
              <ul>
                {budgets.map((budget) => {
                  const Icon = iconRegistry[budget.icon]?.icon;
                  return (
                    <li key={budget.id}>
                      <Link to={`/budget/${budget.id}`}>
                        {Icon && <Icon size={16} />} {budget.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </li>

          <li>
            <Link to="/unconsideredTransaction">Unconsidered Transactions</Link>
          </li>

          <li>
            <Link to="/profile">Profile</Link>
          </li>

          <li>
            <button type="button">Settings</button>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
