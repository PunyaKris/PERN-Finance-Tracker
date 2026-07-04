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
      <div>
        {transactions.map((transaction) => (
          <Transaction
            key={transaction.id}
            transaction={transaction}
            showBudget={false}
            onEditTransactionPressed={handleEditPress}
            onDeleteTransactionPressed={handleDeletePress}
          />
        ))}
      </div>
    );
  } else {
    Transactions = <h4>No Unconsidered Transactions</h4>;
  }

  return (
    <AppLayout>
      <p>Transactions that are not assigned to any budget.</p>
      <h1> Unconsidered Transactions</h1>
      {Transactions}
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
      <button onClick={() => navigate("/dashboard")}> Back </button>
    </AppLayout>
  );
}
export default UnassignedTransaction;
