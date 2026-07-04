import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import getUserStats from "../services/dashboardStatService";
import { getAllBudgetService } from "../services/budgetService";
import {
  getRecentTransactionService,
  deleteTransaction,
} from "../services/transactionService";

import Budget from "../components/Budget";
import Stat from "../components/Stat";
import Transaction from "../components/Transaction";
import Loading from "../components/Loading";
import Modal from "../components/Modal";
import TransactionForm from "../components/TransactionForm";
import DeleteConformation from "../components/DeleteConformation";
import BudgetForm from "../components/BudgetForm";

const DashboardPage = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [budgets, setBudgets] = useState(null);
  const [transactions, setTransactions] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [prevTransaction, setPrevTransaction] = useState(null);
  const [showTransactionDeleteConfirm, setShowTransactionDeleteConfirm] =
    useState(false);
  const [idToDelete, setIdToDelete] = useState();
  const [showBudgetForm, setShowBudgetForm] = useState(false);

  function handleEditTransactionPress(transaction) {
    setShowModal(true);
    setPrevTransaction({
      id: transaction.id,
      title: transaction.title,
      type: transaction.type,
      amount: transaction.amount,
      budgetId: transaction.budgetId,
    });
  }

  async function fetchDashboard() {
    const statResponse = await getUserStats();
    const budgetResponse = await getAllBudgetService();
    const transactionResponse = await getRecentTransactionService();

    setStats(statResponse.data);
    setBudgets(budgetResponse.data);
    setTransactions(transactionResponse.data);
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

  function onDeleteTransactionPressed(transactionId) {
    setShowTransactionDeleteConfirm(true);
    setIdToDelete(transactionId);
  }

  async function onConfirmDeleteTransaction() {
    await deleteTransaction(idToDelete);
    setShowTransactionDeleteConfirm(false);
    setIdToDelete(null);
    await fetchDashboard();
  }

  let Stats;
  let Budgets;
  let Transactions;

  if (stats) {
    Stats = (
      <div>
        <h3>Today</h3>
        <Stat title="Spent" value={stats.daily.spent} />
        <Stat title="Earned" value={stats.daily.earned} />
        {stats.daily.limit && (
          <>
            <Stat title="Limit" value={stats.daily.limit} />
            <Stat title="Left" value={stats.daily.left} />
          </>
        )}
        <h3>This Month</h3>
        <Stat title="Spent" value={stats.monthly.spent} />
        <Stat title="Earned" value={stats.monthly.earned} />
        {stats.monthly.limit && (
          <>
            <Stat title="Limit" value={stats.monthly.limit} />
            <Stat title="Left" value={stats.monthly.left} />
          </>
        )}
        {/* V1 UI UPDATE */}
        <h3>This Year</h3>
        <Stat title="Spent" value={stats.yearly.spent} />
        <Stat title="Earned" value={stats.yearly.earned} />
        {stats.yearly.limit && (
          <>
            <Stat title="Limit" value={stats.yearly.limit} />
            <Stat title="Left" value={stats.yearly.left} />
          </>
        )}
      </div>
    );
  } else {
    Stats = <Loading />;
  }

  if (budgets) {
    Budgets = (
      <div>
        <h3>Budgets</h3>
        {budgets.map((budget) => (
          <Budget
            key={budget.id}
            budget={budget}
            showEditAndDelete={false}
            budgetClickHandler={() => navigate(`/budget/${budget.id}`)}
            editButtonHandler={null}
            deleteButtonHandler={null}
            isBudgetPage={false}
          />
        ))}
      </div>
    );
  } else {
    Budgets = <Loading />;
  }

  if (transactions) {
    Transactions = (
      <div>
        <h3> Recent Transaction </h3>
        {transactions.map((transaction) => (
          <Transaction
            key={transaction.id}
            transaction={transaction}
            showBudget={true}
            onEditTransactionPressed={handleEditTransactionPress}
            onDeleteTransactionPressed={onDeleteTransactionPressed}
          />
        ))}
      </div>
    );
  } else {
    Transactions = <Loading />;
  }

  return (
    <AppLayout>
      <h1>DashBoard</h1>
      <button onClick={() => navigate("/profile")}>🙍‍♂️ Profile </button>
      <button onClick={() => setShowModal(true)} disabled={!budgets}>
        ➕ Add Transaction
      </button>
      <button onClick={() => setShowBudgetForm(true)}> ➕ Add Budget</button>
      <button onClick={() => navigate("/unconsideredTransaction")}>
        {" "}
        Un-Considered Transactions{" "}
      </button>
      {Stats}
      <hr />
      {Budgets}
      <hr />
      {Transactions}
      {showModal && (
        <Modal>
          <TransactionForm
            budgets={budgets}
            prevTransaction={prevTransaction}
            onTransactionSave={transactionSaveHandler}
          />
        </Modal>
      )}
      {showBudgetForm && (
        <Modal>
          <BudgetForm oldBudget={null} onBudgetSave={budgetSaveHandler} />
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
    </AppLayout>
  );
};

export default DashboardPage;
