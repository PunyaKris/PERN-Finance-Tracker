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
import Budget from "../components/Budget";
import BudgetForm from "../components/BudgetForm";

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

  BudgetInfo = (
    <Budget
      budget={budget}
      budgetClickHandler={null}
      editBudgetHandler={() => setShowBudgetForm(true)}
      deleteBudgetHandler={onDeleteBudgetPressed}
      showEditAndDelete={true}
      isBudgetPage={true}
    />
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
      <button onClick={() => setShowTransactionForm(true)}>
        ➕ Add Transaction
      </button>
      {BudgetInfo}
      {Transactions}
      <button onClick={() => navigate("/dashboard")}> Back </button>
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
