import { useState, useEffect } from "react";
import { CalendarDays } from "lucide-react";
import { Plus } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import getUserStats from "../services/dashboardStatService";
import { getAllBudgetService } from "../services/budgetService";
import {
  getRecentTransactionService,
  deleteTransaction,
} from "../services/transactionService";

import DashboardBudgetList from "../components/DashboardBudgetList";
import Stat from "../components/Stat";
import StatsCard from "../components/StatsCard";
import { getSafeProgress } from "../utils/formatters";
import RecentTransaction from "../components/RecentTransaction";
import Loading from "../components/Loading";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import Modal from "../components/Modal";
import TransactionForm from "../components/TransactionForm";
import DeleteConformation from "../components/DeleteConformation";
import BudgetForm from "../components/BudgetForm";
import "./DashboardPage.css";

const DashboardPage = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [statsError, setStatsError] = useState(false);
  const [budgets, setBudgets] = useState(null);
  const [budgetsError, setBudgetsError] = useState(false);
  const [transactions, setTransactions] = useState(null);
  const [transactionsError, setTransactionsError] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [prevTransaction, setPrevTransaction] = useState(null);
  const [showTransactionDeleteConfirm, setShowTransactionDeleteConfirm] =
    useState(false);
  const [idToDelete, setIdToDelete] = useState();
  const [showBudgetForm, setShowBudgetForm] = useState(false);

  async function fetchDashboard() {
    setStatsError(false);
    setBudgetsError(false);
    setTransactionsError(false);
    setStats(null);
    setBudgets(null);
    setTransactions(null);

    const [statsResult, budgetsResult, transactionsResult] =
      await Promise.allSettled([
        getUserStats(),
        getAllBudgetService(),
        getRecentTransactionService(),
      ]);

    if (statsResult.status === "fulfilled") {
      setStats(statsResult.value.data);
    } else {
      setStats(null);
      setStatsError(true);
    }

    if (budgetsResult.status === "fulfilled") {
      setBudgets(budgetsResult.value.data);
    } else {
      setBudgets(null);
      setBudgetsError(true);
    }

    if (transactionsResult.status === "fulfilled") {
      setTransactions(transactionsResult.value.data);
    } else {
      setTransactions(null);
      setTransactionsError(true);
    }
  }

  useEffect(() => {
    const fetchDashboardCaller = async () => fetchDashboard();
    fetchDashboardCaller();
  }, []);

  async function budgetSaveHandler() {
    setShowBudgetForm(false);
    await fetchDashboard();
  }

  async function transactionSaveHandler() {
    setShowModal(false);
    setPrevTransaction(null);
    await fetchDashboard();
  }

  async function onConfirmDeleteTransaction() {
    await deleteTransaction(idToDelete);
    setShowTransactionDeleteConfirm(false);
    setIdToDelete(null);
    await fetchDashboard();
  }

  let Stats;
  let Transactions;

  if (stats === null && !statsError) {
    Stats = <Loading />;
  } else if (statsError) {
    Stats = (
      <ErrorState
        title="Couldn't load dashboard."
        description="We couldn't fetch your dashboard summary right now."
        actionLabel="Retry"
        onAction={() => fetchDashboard()}
      />
    );
  } else {
    Stats = (
      <div>
        <StatsCard
          variant="dashboard"
          title="Today"
          progress={getSafeProgress(stats.daily.spent, stats.daily.limit)}
          headerIcon={<CalendarDays size={18} />}
        >
          <Stat title="Earned" value={stats.daily.earned} />
          <Stat title="Spent" value={stats.daily.spent} />
          <Stat title="Limit" value={stats.daily.limit ?? null} />
          <Stat title="Left" value={stats.daily.left ?? null} />
        </StatsCard>

        <StatsCard
          variant="dashboard"
          title="This Month"
          progress={getSafeProgress(stats.monthly.spent, stats.monthly.limit)}
          headerIcon={<CalendarDays size={18} />}
        >
          <Stat title="Earned" value={stats.monthly.earned} />
          <Stat title="Spent" value={stats.monthly.spent} />
          <Stat title="Limit" value={stats.monthly.limit ?? null} />
          <Stat title="Left" value={stats.monthly.left ?? null} />
        </StatsCard>

        <StatsCard
          variant="dashboard"
          title="This Year"
          progress={getSafeProgress(stats.yearly.spent, stats.yearly.limit)}
          headerIcon={<CalendarDays size={18} />}
        >
          <Stat title="Earned" value={stats.yearly.earned} />
          <Stat title="Spent" value={stats.yearly.spent} />
          <Stat title="Limit" value={stats.yearly.limit ?? null} />
          <Stat title="Left" value={stats.yearly.left ?? null} />
        </StatsCard>
      </div>
    );
  }

  if (transactions === null && !transactionsError) {
    Transactions = <Loading />;
  } else if (transactionsError) {
    Transactions = (
      <ErrorState
        title="Couldn't load transactions."
        description="We couldn't fetch your recent transactions right now."
        actionLabel="Retry"
        onAction={() => fetchDashboard()}
        compact
      />
    );
  } else if (transactions.length === 0) {
    Transactions = (
      <EmptyState
        icon="🧾"
        title="No recent transactions"
        description="Your latest activity will appear here as soon as you add transactions."
        compact
      />
    );
  } else {
    Transactions = (
      <div className="dashboard-page__list dashboard-page__list--stacked">
        {transactions.map((transaction) => (
          <RecentTransaction key={transaction.id} transaction={transaction} />
        ))}
      </div>
    );
  }

  const username =
    stats?.user?.username ??
    stats?.user?.name ??
    stats?.username ??
    stats?.userName ??
    stats?.name ??
    "";
  const currentHour = new Date().getHours();
  const greetingPrefix =
    currentHour >= 5 && currentHour < 12
      ? "Good Morning"
      : currentHour >= 12 && currentHour < 17
        ? "Good Afternoon"
        : "Good Evening";
  const greeting = username
    ? `${greetingPrefix}, ${username} 👋`
    : `${greetingPrefix} 👋`;

  return (
    <AppLayout>
      <div className="dashboard-page">
        <header className="dashboard-page__header">
          <div className="dashboard-page__heading">
            <h1 className="dashboard-page__title">{greeting}</h1>
            <p className="dashboard-page__subtitle">
              Here's your financial overview.
            </p>
          </div>

          <div className="dashboard-page__actions">
            <button onClick={() => setShowModal(true)} disabled={!budgets}>
              <Plus size={18} weight="bold" />
              Add Transaction
            </button>
            <button onClick={() => setShowBudgetForm(true)}>
              <Plus size={18} weight="bold" />
              Add Budget
            </button>
          </div>
        </header>

        <section className="dashboard-page__stats">{Stats}</section>

        <div className="dashboard-page__content">
          <DashboardBudgetList
            budgets={budgets ?? []}
            loading={budgets === null && !budgetsError}
            error={budgetsError}
            onRetry={() => fetchDashboard()}
            onCreateBudget={() => setShowBudgetForm(true)}
            onBudgetClick={(budget) => navigate(`/budget/${budget.id}`)}
          />

          <aside className="dashboard-page__transactions">
            <div className="dashboard-page__section-heading">
              <h2 className="dashboard-page__section-title">
                Recent Transactions
              </h2>
              <p className="dashboard-page__section-copy">
                Your latest activity at a glance
              </p>
            </div>
            {Transactions}
          </aside>
        </div>

        {showModal && (
          <Modal
            onClose={() => {
              setShowModal(false);
              setPrevTransaction(null);
            }}
          >
            <TransactionForm
              budgets={budgets}
              prevTransaction={prevTransaction}
              onTransactionSave={transactionSaveHandler}
            />
          </Modal>
        )}
        {showBudgetForm && (
          <Modal onClose={() => setShowBudgetForm(false)}>
            <BudgetForm oldBudget={null} onBudgetSave={budgetSaveHandler} />
          </Modal>
        )}
        {showTransactionDeleteConfirm && (
          <Modal onClose={() => setShowTransactionDeleteConfirm(false)}>
            <DeleteConformation
              deleteHandler={onConfirmDeleteTransaction}
              cancelHandler={() => setShowTransactionDeleteConfirm(false)}
            />
          </Modal>
        )}
      </div>
    </AppLayout>
  );
};

export default DashboardPage;
