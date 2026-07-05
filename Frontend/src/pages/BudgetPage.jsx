import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AppLayout from "../components/AppLayout";

import { deleteBudget, getBudget } from "../services/budgetService";
import { deleteTransaction } from "../services/transactionService";

import Loading from "../components/Loading";
import Transaction from "../components/Transaction";
import Modal from "../components/Modal";
import TransactionForm from "../components/TransactionForm";
import DeleteConformation from "../components/DeleteConformation";
import BudgetForm from "../components/BudgetForm";
import Stat from "../components/Stat";
import StatsCard from "../components/StatsCard";
import { iconRegistry } from "../utils/iconRegistry";
import "./BudgetPage.css";

const BudgetPage = () => {
  const navigate = useNavigate();
  const pathParams = useParams();
  const budgetId = pathParams.budgetId;
  const [budget, setBudget] = useState(null);
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [showTransactionDeleteConfirm, setShowTransactionDeleteConfirm] =
    useState(false);
  const [prevTransaction, setPrevTransaction] = useState();
  const [idToDelete, setIdToDelete] = useState();
  const [showBudgetForm, setShowBudgetForm] = useState();
  const [showBudgetDeleteConfirm, setShowBudgetDeleteConfirm] = useState(false);

  async function assembleBudgetPage() {
    const response = await getBudget(budgetId);
    setBudget(response.data);
  }

  useEffect(() => {
    const assembleBudgetPageCaller = async () => assembleBudgetPage();
    assembleBudgetPageCaller();
  }, [budgetId]);

  if (!budget) return <Loading />;

  function handleEditTransactionPress(transaction) {
    setShowTransactionForm(true);
    setPrevTransaction({
      id: transaction.id,
      title: transaction.title,
      type: transaction.type,
      amount: transaction.amount,
      budgetId: transaction.budgetId,
    });
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

  async function onConfirmDeleteBudget() {
    await deleteBudget(idToDelete);
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
          <div className="budget-page__title-row">
            {Icon && (
              <span className="budget-page__icon" aria-hidden="true">
                <Icon size={24} />
              </span>
            )}
            <div className="budget-page__title-block">
              <h2 className="budget-page__title">{budget.name}</h2>
              <span className="budget-page__badge">{budgetTypeLabel}</span>
            </div>
          </div>

          {budget.description && (
            <p className="budget-page__description">{budget.description}</p>
          )}
        </div>

        <div className="budget-page__actions">
          <button onClick={() => setShowTransactionForm(true)}>
            ➕ Add Transaction
          </button>
          <button onClick={() => setShowBudgetForm(true)}>Edit Budget</button>
          <button onClick={() => onDeleteBudgetPressed(budget.id)}>
            Delete Budget
          </button>
        </div>
      </header>
    </div>
  );

  const transactions = budget.transactions;

  if (transactions.length > 0)
    Transactions = (
      <div>
        <h3> Transaction </h3>
        {transactions.map((transaction) => (
          <Transaction
            key={transaction.id}
            transaction={transaction}
            showBudget={false}
            onEditTransactionPressed={handleEditTransactionPress}
            onDeleteTransactionPressed={onDeleteTransactionPressed}
          />
        ))}
      </div>
    );
  else {
    Transactions = <h6>No Transaction In This Budget Yet</h6>;
  }

  return (
    <AppLayout>
      <div className="budget-page">
        {BudgetInfo}

        <section className="budget-page__stats">
          <StatsCard
            title="Today"
            progress={
              budget.dailyLimit
                ? (budget.daily.amount / budget.daily.limit) * 100
                : null
            }
          >
            <Stat
              title={budget.budgetType === "EXPENSE" ? "Spent" : "Earned"}
              value={budget.daily.amount}
            />

            {budget.dailyLimit && (
              <>
                <Stat title="Limit" value={budget.daily.limit} />
                <Stat title="Left" value={budget.daily.left} />
              </>
            )}
          </StatsCard>

          <StatsCard
            title="Week"
            progress={
              budget.weeklyLimit
                ? (budget.weekly.amount / budget.weekly.limit) * 100
                : null
            }
          >
            <Stat
              title={budget.budgetType === "EXPENSE" ? "Spent" : "Earned"}
              value={budget.weekly.amount}
            />

            {budget.weeklyLimit && (
              <>
                <Stat title="Limit" value={budget.weekly.limit} />
                <Stat title="Left" value={budget.weekly.left} />
              </>
            )}
          </StatsCard>

          <StatsCard
            title="Month"
            progress={
              budget.monthlyLimit
                ? (budget.monthly.amount / budget.monthly.limit) * 100
                : null
            }
          >
            <Stat
              title={budget.budgetType === "EXPENSE" ? "Spent" : "Earned"}
              value={budget.monthly.amount}
            />

            {budget.monthlyLimit && (
              <>
                <Stat title="Limit" value={budget.monthly.limit} />
                <Stat title="Left" value={budget.monthly.left} />
              </>
            )}
          </StatsCard>
        </section>

        <section className="budget-page__transactions">{Transactions}</section>
      </div>

      {showTransactionForm && (
        <Modal>
          <TransactionForm
            budgets={[budget]}
            budgetId={budget.id}
            onTransactionSave={transactionSaveHandler}
            prevTransaction={prevTransaction}
          />
        </Modal>
      )}
      {showBudgetForm && (
        <Modal>
          <BudgetForm oldBudget={budget} onBudgetSave={budgetSaveHandler} />
        </Modal>
      )}
      {showTransactionDeleteConfirm && (
        <Modal>
          <DeleteConformation
            deleteHandler={onConfirmDeleteTransaction}
            cancelHandler={() => setShowTransactionDeleteConfirm(false)}
          />
        </Modal>
      )}
      {showBudgetDeleteConfirm && (
        <Modal>
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
