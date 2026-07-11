import { useState, useEffect } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useNavigate } from "react-router-dom";
import {
  getAllUnconsideredTransactions,
  editTransaction,
} from "../services/transactionService";
import { getAllBudgetService } from "../services/budgetService";
import InboxTransactionCard from "../components/InboxTransactionCard";
import DropBudgetCard from "../components/DropBudgetCard";
import Modal from "../components/Modal";
import TransactionForm from "../components/TransactionForm";
import DeleteConformation from "../components/DeleteConformation";
import { deleteTransaction } from "../services/transactionService";
import AppLayout from "../components/AppLayout";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import Loading from "../components/Loading";
import "./UnconsideredTransactionsPage.css";
import { Inbox, Lightbulb, RotateCcw } from "lucide-react";

function UnassignedTransaction() {
  const navigate = useNavigate();

  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [transactionBeingEdited, setTransactionBeingEdited] = useState();
  const [transactionBeingDeleted, setTransactionBeingDeleted] = useState();
  const [showDeleteModal, setShowDeleteModal] = useState();
  const [showEditModal, setShowEditModal] = useState();
  const [activeDragId, setActiveDragId] = useState(null);
  const [activeDragTransaction, setActiveDragTransaction] = useState(null);
  const [assigningBudgetId, setAssigningBudgetId] = useState(null);
  const [successBudgetId, setSuccessBudgetId] = useState(null);
  const [toast, setToast] = useState(null);
  const [undoStack, setUndoStack] = useState([]);
  const [undoingAssignment, setUndoingAssignment] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
  );

  async function getTransactions() {
    setLoading(true);
    setError(false);
    setTransactions([]);
    setBudgets(undefined);

    try {
      const _transactions = await getAllUnconsideredTransactions();
      const _budgets = await getAllBudgetService();
      setBudgets(_budgets.data);
      setTransactions(_transactions.data);
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const getTransactionsCaller = async () => {
      await getTransactions();
    };
    getTransactionsCaller();
  }, []);

  useEffect(() => {
    if (!toast) return undefined;

    const timer = window.setTimeout(() => setToast(null), 4000);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (!successBudgetId) return undefined;

    const timer = window.setTimeout(() => setSuccessBudgetId(null), 800);
    return () => window.clearTimeout(timer);
  }, [successBudgetId]);

  async function saveHandler() {
    setTransactionBeingEdited(null);
    setTransactionBeingDeleted(null);
    setShowDeleteModal(false);
    setShowEditModal(false);
    await getTransactions();
  }

  function handleDragStart(event) {
    setActiveDragId(event.active?.id ?? null);
    setActiveDragTransaction(event.active?.data?.current?.transaction ?? null);
  }

  function handleDragCancel() {
    setActiveDragId(null);
    setActiveDragTransaction(null);
  }

  async function handleDragEnd(event) {
    const { active, over } = event;
    setActiveDragId(null);
    setActiveDragTransaction(null);

    if (!over) return;

    const draggedTransaction = active?.data?.current?.transaction;
    const targetBudget = over?.data?.current?.budget;

    if (!draggedTransaction || !targetBudget) return;

    if (draggedTransaction.type !== targetBudget.budgetType) {
      const message =
        draggedTransaction.type === "EXPENSE"
          ? "Expense transactions can only be assigned to Expense budgets."
          : "Income transactions can only be assigned to Income budgets.";
      setToast({ message, actionLabel: null });
      return;
    }

    setAssigningBudgetId(targetBudget.id);

    try {
      const updatedTransaction = await editTransaction(
        { ...draggedTransaction, budgetId: targetBudget.id },
        draggedTransaction,
      );
      setTransactions((prevTransactions) =>
        prevTransactions.filter((item) => item.id !== draggedTransaction.id),
      );

      const refreshedBudgets = await getAllBudgetService();
      setBudgets(refreshedBudgets.data);
      setSuccessBudgetId(targetBudget.id);
      setUndoStack((prev) => [
        ...prev,
        {
          transactionId: draggedTransaction.id,
          previousBudgetId: draggedTransaction.budgetId ?? null,
          newBudgetId: targetBudget.id,
          transaction: updatedTransaction.data ?? updatedTransaction,
          transactionTitle: draggedTransaction.title,
          budgetName: targetBudget.name,
        },
      ]);
      setToast({
        message: `Assigned “${draggedTransaction.title}” to ${targetBudget.name}`,
        actionLabel: null,
      });
    } catch (error) {
      setToast({
        message: "Assignment failed. Please try again.",
        actionLabel: null,
      });
    } finally {
      setAssigningBudgetId(null);
    }
  }

  async function handleUndoAssignment() {
    if (undoingAssignment || undoStack.length === 0) return;

    const lastAction = undoStack[undoStack.length - 1];
    if (!lastAction) return;

    setUndoingAssignment(true);
    setToast(null);

    try {
      const restoredTransaction = await editTransaction(
        {
          ...(lastAction.transaction ?? {}),
          budgetId: lastAction.previousBudgetId ?? null,
        },
        lastAction.transaction ?? { id: lastAction.transactionId },
      );
      const restoredItem = restoredTransaction.data ?? restoredTransaction;
      setTransactions((prevTransactions) => [
        restoredItem,
        ...prevTransactions,
      ]);
      const refreshedBudgets = await getAllBudgetService();
      setBudgets(refreshedBudgets.data);
      setUndoStack((prev) => prev.slice(0, -1));
      setToast({
        message: `Removed “${lastAction.transactionTitle}” from ${lastAction.budgetName}`,
        actionLabel: null,
      });
    } catch (error) {
      setToast({
        message: "Couldn't undo assignment. Please try again.",
        actionLabel: null,
      });
    } finally {
      setUndoingAssignment(false);
    }
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

  if (loading) {
    Transactions = <Loading />;
  } else if (error) {
    Transactions = (
      <ErrorState
        title="Couldn't load transactions."
        description="We couldn't fetch your unassigned transactions right now."
        actionLabel="Retry"
        onAction={() => getTransactions()}
        compact
      />
    );
  } else if (transactions.length > 0) {
    Transactions = (
      <div className="unconsidered-transactions-page__transactions-list">
        {transactions.map((transaction) => (
          <InboxTransactionCard
            key={transaction.id}
            transaction={transaction}
          />
        ))}
      </div>
    );
  } else {
    Transactions = (
      <EmptyState
        icon="🎉"
        title="Everything is organized"
        description="All your transactions are already assigned to a budget."
        centered
      />
    );
  }

  const hasBudgets = Array.isArray(budgets) && budgets.length > 0;
  const budgetCards = hasBudgets ? budgets : [];

  return (
    <AppLayout>
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
        modifiers={[]}
      >
        <div className="unconsidered-transactions-page">
          <div className="unconsidered-transactions-page__top-area">
            <button
              className="unconsidered-transactions-page__back"
              onClick={() => navigate("/dashboard")}
            >
              ← Back to Dashboard
            </button>

            <header className="unconsidered-transactions-page__header">
              <div className="unconsidered-transactions-page__title-group">
                <div className="unconsidered-transactions-page__title-block">
                  <div className="unconsidered-transactions-page__title-row">
                    <h1 className="unconsidered-transactions-page__title">
                      Unconsidered Transactions
                    </h1>
                  </div>
                  <p className="unconsidered-transactions-page__subtitle">
                    Transactions that have not yet been assigned to any budget.
                  </p>
                </div>
              </div>

              <div className="unconsidered-transactions-page__actions">
                <button
                  type="button"
                  className="unconsidered-transactions-page__undo-button"
                  onClick={handleUndoAssignment}
                  disabled={undoStack.length === 0 || undoingAssignment}
                >
                  <RotateCcw
                    size={16}
                    className="unconsidered-transactions-page__undo-icon"
                  />
                  Undo
                  <span className="unconsidered-transactions-page__undo-badge">
                    {undoStack.length}
                  </span>
                </button>
              </div>
            </header>
          </div>

          <div className="unconsidered-transactions-page__summary-card">
            <div className="unconsidered-transactions-page__summary-copy">
              <div
                className="unconsidered-transactions-page__summary-icon"
                aria-hidden="true"
              >
                <Inbox size={25} />
              </div>
              <div>
                <p className="unconsidered-transactions-page__summary-title">
                  {transactions.length} Transaction
                  {transactions.length === 1 ? "" : "s"} Waiting...
                </p>
                <p className="unconsidered-transactions-page__summary-subtitle">
                  {transactions.length > 0
                    ? "Assign all Transactions to suitable Budgets"
                    : "All caught up — no transactions waiting."}
                </p>
              </div>
            </div>

            <div className="unconsidered-transactions-page__summary-tip">
              <div
                className="unconsidered-transactions-page__summary-tip-icon"
                aria-hidden="true"
              >
                <Lightbulb size={18} />
              </div>
              <p className="unconsidered-transactions-page__summary-tip-text">
                Tip: drag & drop Transactions on Budgets to assign
              </p>
            </div>
          </div>

          <section className="unconsidered-transactions-page__workspace">
            <div className="unconsidered-transactions-page__panel">
              <div className="unconsidered-transactions-page__panel-header">
                <h2 className="unconsidered-transactions-page__panel-title">
                  Transactions Inbox
                </h2>
                <p className="unconsidered-transactions-page__panel-subtitle">
                  Drag a transaction onto a budget to organize it.
                </p>
              </div>
              <div className="unconsidered-transactions-page__panel-body">
                {Transactions}
              </div>
            </div>

            <div className="unconsidered-transactions-page__panel">
              <div className="unconsidered-transactions-page__panel-header">
                <h2 className="unconsidered-transactions-page__panel-title">
                  Your Budgets
                </h2>
                <p className="unconsidered-transactions-page__panel-subtitle">
                  Choose a budget to organize your transactions.
                </p>
              </div>
              {hasBudgets ? (
                <div className="unconsidered-transactions-page__budget-grid">
                  {budgetCards.map((budget) => (
                    <DropBudgetCard
                      key={budget.id}
                      budget={budget}
                      isActiveDrag={Boolean(activeDragId)}
                      isAssigning={assigningBudgetId === budget.id}
                      isSuccess={successBudgetId === budget.id}
                    />
                  ))}
                </div>
              ) : (
                <div className="unconsidered-transactions-page__empty">
                  <h4>Create your first budget</h4>
                  <p>
                    Add a budget to start organizing the transactions in this
                    inbox.
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>

        <DragOverlay dropAnimation={null}>
          {activeDragTransaction ? (
            <InboxTransactionCard
              transaction={activeDragTransaction}
              isOverlay
            />
          ) : null}
        </DragOverlay>
      </DndContext>

      {toast && (
        <div
          className="unconsidered-transactions-page__toast"
          role="status"
          aria-live="polite"
        >
          <span>{toast.message}</span>
          {toast.actionLabel && (
            <button
              type="button"
              className="unconsidered-transactions-page__toast-action"
              onClick={() => toast.onAction?.()}
            >
              {toast.actionLabel}
            </button>
          )}
        </div>
      )}

      {showEditModal && (
        <Modal
          onClose={() => {
            setShowEditModal(false);
            setTransactionBeingEdited(null);
          }}
        >
          <TransactionForm
            budgets={budgets}
            onTransactionSave={saveHandler}
            prevTransaction={transactionBeingEdited}
          />
        </Modal>
      )}
      {showDeleteModal && (
        <Modal onClose={deleteCancelHandler}>
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
