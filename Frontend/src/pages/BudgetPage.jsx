import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Settings, Funnel, ArrowUpDown } from "lucide-react";
import AppLayout from "../components/AppLayout";

import { deleteBudget, getBudget } from "../services/budgetService";
import { deleteTransaction } from "../services/transactionService";

import Loading from "../components/Loading";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import TransactionRow from "../components/TransactionRow";
import Modal from "../components/Modal";
import TransactionForm from "../components/TransactionForm";
import DeleteConformation from "../components/DeleteConformation";
import BudgetForm from "../components/BudgetForm";
import Stat from "../components/Stat";
import StatsCard from "../components/StatsCard";
import { getSafeProgress } from "../utils/formatters";
import { iconRegistry } from "../utils/iconRegistry";
import { getAccentStyleVars } from "../utils/accentRegistry";
import "./BudgetPage.css";

const BudgetPage = () => {
  const navigate = useNavigate();
  const pathParams = useParams();
  const budgetId = pathParams.budgetId;
  const [budget, setBudget] = useState(null);
  const [budgetError, setBudgetError] = useState(false);
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [showTransactionDeleteConfirm, setShowTransactionDeleteConfirm] =
    useState(false);
  const [prevTransaction, setPrevTransaction] = useState();
  const [idToDelete, setIdToDelete] = useState();
  const [showBudgetForm, setShowBudgetForm] = useState();
  const [showBudgetDeleteConfirm, setShowBudgetDeleteConfirm] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState(false);
  const actionMenuRef = useRef(null);
  const gearButtonRef = useRef(null);

  async function assembleBudgetPage() {
    setBudgetError(false);
    setBudget(null);

    try {
      const response = await getBudget(budgetId);
      setBudget(response.data);
    } catch (error) {
      setBudgetError(true);
      setBudget(null);
    }
  }

  useEffect(() => {
    const assembleBudgetPageCaller = async () => assembleBudgetPage();
    assembleBudgetPageCaller();
  }, [budgetId]);

  useEffect(() => {
    if (!showActionMenu) return;

    function handlePointerDown(event) {
      const clickedOutsideMenu =
        actionMenuRef.current && !actionMenuRef.current.contains(event.target);
      const clickedOutsideButton =
        gearButtonRef.current && !gearButtonRef.current.contains(event.target);

      if (clickedOutsideMenu && clickedOutsideButton) {
        setShowActionMenu(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, [showActionMenu]);

  if (budget === null && !budgetError) return <Loading />;

  if (budgetError) {
    return (
      <AppLayout>
        <div className="budget-page">
          <ErrorState
            title="Couldn't load budgets."
            description="We couldn't fetch this budget right now."
            actionLabel="Retry"
            onAction={() => assembleBudgetPage()}
            centered
          />
        </div>
      </AppLayout>
    );
  }

  function handleEditTransactionPress(transaction) {
    setShowTransactionForm(true);
    setPrevTransaction(transaction);
  }

  async function transactionSaveHandler() {
    setShowTransactionForm(false);
    setPrevTransaction(null);
    await assembleBudgetPage();
  }

  function onDeleteTransactionPressed(transactionId) {
    setShowTransactionDeleteConfirm(true);
    setIdToDelete(transactionId);
  }

  async function onConfirmDeleteTransaction() {
    await deleteTransaction(idToDelete);
    setShowTransactionDeleteConfirm(false);
    setIdToDelete(null);
    await assembleBudgetPage();
  }

  function onDeleteBudgetPressed(budgetId) {
    setShowBudgetDeleteConfirm(true);
    setIdToDelete(budgetId);
  }

  function handleEditBudgetAction() {
    setShowActionMenu(false);
    setShowBudgetForm(true);
  }

  function handleDeleteBudgetAction() {
    setShowActionMenu(false);
    onDeleteBudgetPressed(budget.id);
  }

  async function onConfirmDeleteBudget() {
    await deleteBudget(idToDelete);
    window.dispatchEvent(new Event("budgets:changed"));
    setShowBudgetDeleteConfirm(false);
    setIdToDelete(null);
    await navigate("/dashboard");
  }

  async function budgetSaveHandler() {
    setShowBudgetForm(false);
    await assembleBudgetPage();
  }

  let BudgetInfo;
  let Transactions;

  const Icon = iconRegistry[budget.icon]?.icon;
  const accentStyle = getAccentStyleVars(budget?.accentColor);
  const budgetTypeLabel =
    budget.budgetType === "EXPENSE" ? "Expense" : "Income";

  BudgetInfo = (
    <div className="budget-page__top-area">
      <button
        className="budget-page__back-link"
        onClick={() => navigate("/dashboard")}
      >
        ← Back to Dashboard
      </button>

      <header className="budget-page__header">
        <div className="budget-page__title-group">
          {Icon && (
            <span
              className="budget-page__icon"
              aria-hidden="true"
              style={accentStyle}
            >
              <Icon size={24} />
            </span>
          )}

          <div className="budget-page__title-block">
            <div className="budget-page__title-row">
              <h2 className="budget-page__title">{budget.name}</h2>

              <span className="budget-page__badge">
                {budgetTypeLabel === "Expense"
                  ? "Expense Budget"
                  : "Income Budget"}
              </span>
            </div>

            {budget.description && (
              <p className="budget-page__description">{budget.description}</p>
            )}
          </div>
        </div>

        <div className="budget-page__actions" ref={actionMenuRef}>
          <button type="button" onClick={() => setShowTransactionForm(true)}>
            ➕ Add Transaction
          </button>
          <div className="budget-page__action-menu-wrap">
            <button
              ref={gearButtonRef}
              type="button"
              className="budget-page__icon-button"
              onClick={() => setShowActionMenu((current) => !current)}
              aria-haspopup="menu"
              aria-expanded={showActionMenu}
            >
              <Settings
                className="budget-page__settings-icon"
                size={18}
                strokeWidth={2.2}
              />
            </button>
            {showActionMenu ? (
              <div className="budget-page__action-menu" role="menu">
                <button
                  type="button"
                  className="budget-page__action-menu-item"
                  role="menuitem"
                  onClick={handleEditBudgetAction}
                >
                  Edit Budget
                </button>
                <button
                  type="button"
                  className="budget-page__action-menu-item"
                  role="menuitem"
                  onClick={handleDeleteBudgetAction}
                >
                  Delete Budget
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </header>
    </div>
  );

  const transactions = budget.transactions;

  if (transactions.length > 0)
    Transactions = (
      <div className="budget-page__transactions-card">
        <div className="budget-page__transactions-header">
          <h3 className="budget-page__transactions-title">Transactions</h3>
          <div className="budget-page__transactions-actions">
            <button
              type="button"
              className="budget-page__transactions-action-button"
            >
              <Funnel
                size={16}
                className="budget-page__transactions-action-icon"
              />
              <span>All Types</span>
              <span className="budget-page__transactions-chevron">▼</span>
            </button>
            <button
              type="button"
              className="budget-page__transactions-action-button"
            >
              <ArrowUpDown
                size={16}
                className="budget-page__transactions-action-icon"
              />
              <span>Latest First</span>
              <span className="budget-page__transactions-chevron">▼</span>
            </button>
          </div>
        </div>
        <div className="budget-page__transactions-list">
          {transactions.map((transaction) => (
            <TransactionRow
              key={transaction.id}
              transaction={transaction}
              showBudget={false}
              onEditTransactionPressed={handleEditTransactionPress}
              onDeleteTransactionPressed={onDeleteTransactionPressed}
            />
          ))}
        </div>
      </div>
    );
  else {
    Transactions = (
      <EmptyState
        icon="✨"
        title="No transactions yet"
        description="Transactions added to this budget will appear here."
        actionLabel="Add Transaction"
        onAction={() => setShowTransactionForm(true)}
        centered
      />
    );
  }

  return (
    <AppLayout>
      <div className="budget-page">
        {BudgetInfo}

        <section className="budget-page__stats">
          <StatsCard
            variant="budget"
            title="Today"
            progress={getSafeProgress(budget.daily.amount, budget.daily.limit)}
          >
            <Stat
              title={
                budget.budgetType === "EXPENSE" ? "Spent Today" : "Earned Today"
              }
              value={budget.daily.amount}
            />

            <Stat title="Limit" value={budget.daily.limit} />
            <Stat title="Left" value={budget.daily.left} />
          </StatsCard>

          <StatsCard
            variant="budget"
            title="Week"
            progress={getSafeProgress(
              budget.weekly.amount,
              budget.weekly.limit,
            )}
          >
            <Stat
              title={
                budget.budgetType === "EXPENSE" ? "Spent Week" : "Earned Week"
              }
              value={budget.weekly.amount}
            />

            <Stat title="Limit" value={budget.weekly.limit} />
            <Stat title="Left" value={budget.weekly.left} />
          </StatsCard>

          <StatsCard
            variant="budget"
            title="Month"
            progress={getSafeProgress(
              budget.monthly.amount,
              budget.monthly.limit,
            )}
          >
            <Stat
              title={
                budget.budgetType === "EXPENSE" ? "Spent Month" : "Earned Month"
              }
              value={budget.monthly.amount}
            />

            <Stat title="Limit" value={budget.monthly.limit} />
            <Stat title="Left" value={budget.monthly.left} />
          </StatsCard>
        </section>

        <section className="budget-page__transactions">{Transactions}</section>
      </div>

      {showTransactionForm && (
        <Modal
          onClose={() => {
            setShowTransactionForm(false);
            setPrevTransaction(null);
          }}
        >
          <TransactionForm
            budgets={[budget]}
            budgetId={budget.id}
            onTransactionSave={transactionSaveHandler}
            prevTransaction={prevTransaction}
            fixedTransactionType={budget.budgetType}
            hideTransactionTypeSelector={true}
          />
        </Modal>
      )}
      {showBudgetForm && (
        <Modal onClose={() => setShowBudgetForm(false)}>
          <BudgetForm oldBudget={budget} onBudgetSave={budgetSaveHandler} />
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
      {showBudgetDeleteConfirm && (
        <Modal onClose={() => setShowBudgetDeleteConfirm(false)}>
          <DeleteConformation
            deleteHandler={onConfirmDeleteBudget}
            cancelHandler={() => setShowBudgetDeleteConfirm(false)}
          />
        </Modal>
      )}
    </AppLayout>
  );
};

export default BudgetPage;
