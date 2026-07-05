import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllUnconsideredTransactions } from "../services/transactionService";
import { getAllBudgetService } from "../services/budgetService";
import Transaction from "../components/Transaction";
import Modal from "../components/Modal";
import TransactionForm from "../components/TransactionForm";
import DeleteConformation from "../components/DeleteConformation";
import { deleteTransaction } from "../services/transactionService";
import AppLayout from "../components/AppLayout";
import "./UnconsideredTransactionsPage.css";

function UnassignedTransaction() {
  const navigate = useNavigate();

  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState();
  const [transactionBeingEdited, setTransactionBeingEdited] = useState();
  const [transactionBeingDeleted, setTransactionBeingDeleted] = useState();
  const [showDeleteModal, setShowDeleteModal] = useState();
  const [showEditModal, setShowEditModal] = useState();

  async function getTransactions() {
    const _transactions = await getAllUnconsideredTransactions();
    const _budgets = await getAllBudgetService();
    setBudgets(_budgets.data);
    setTransactions(_transactions.data);
  }

  useEffect(() => {
    const getTransactionsCaller = async () => {
      await getTransactions();
    };
    getTransactionsCaller();
  }, []);

  async function saveHandler() {
    setTransactionBeingEdited(null);
    setTransactionBeingDeleted(null);
    setShowDeleteModal(false);
    setShowEditModal(false);
    await getTransactions();
  }

  function handleEditPress(transaction) {
    setShowEditModal(true);
    setTransactionBeingEdited(transaction);
  }

  function handleDeletePress(transactionId) {
    setTransactionBeingDeleted(transactionId);
    setShowDeleteModal(true);
  }

  const deleteConformationHandler = async () => {
    await deleteTransaction(transactionBeingDeleted);
    await saveHandler();
  };

  function deleteCancelHandler() {
    setTransactionBeingDeleted(null);
    setShowDeleteModal(false);
  }

  let Transactions;

  if (transactions.length > 0) {
    Transactions = (
      <section className="unconsidered-transactions-page__transactions">
        {transactions.map((transaction) => (
          <Transaction
            key={transaction.id}
            transaction={transaction}
            showBudget={false}
            onEditTransactionPressed={handleEditPress}
            onDeleteTransactionPressed={handleDeletePress}
          />
        ))}
      </section>
    );
  } else {
    Transactions = (
      <div className="unconsidered-transactions-page__empty">
        <h4>No unconsidered transactions.</h4>
        <p>Everything currently looks assigned and tidy.</p>
      </div>
    );
  }

  return (
    <AppLayout>
      <div className="unconsidered-transactions-page">
        <button
          className="unconsidered-transactions-page__back"
          onClick={() => navigate("/dashboard")}
        >
          ← Back to Dashboard
        </button>

        <header className="unconsidered-transactions-page__header">
          <div className="unconsidered-transactions-page__title-group">
            <h1 className="unconsidered-transactions-page__title">
              Unconsidered Transactions
            </h1>
            <p className="unconsidered-transactions-page__subtitle">
              Transactions that have not yet been assigned to any budget.
            </p>
          </div>

          <button
            className="unconsidered-transactions-page__action"
            onClick={() => setShowEditModal(true)}
          >
            ➕ Add Transaction
          </button>
        </header>

        {Transactions}
      </div>

      {showEditModal && (
        <Modal>
          <TransactionForm
            budgets={budgets}
            onTransactionSave={saveHandler}
            prevTransaction={transactionBeingEdited}
          />
        </Modal>
      )}
      {showDeleteModal && (
        <Modal>
          <DeleteConformation
            deleteHandler={deleteConformationHandler}
            cancelHandler={deleteCancelHandler}
          />
        </Modal>
      )}
    </AppLayout>
  );
}
export default UnassignedTransaction;
