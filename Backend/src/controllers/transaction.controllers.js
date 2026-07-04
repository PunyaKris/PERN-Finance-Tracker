import {
  getAllTransaction,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "../services/transaction.services.js";

export async function createTransactionController(req, res) {
  const userId = req.user.id;

  const { budgetId, title, amount, type, icon } = req.body; // V1 UI UPDATE

  if (!title || amount === undefined || (type != "EXPENSE" && type != "INCOME"))
    return res.status(400).json({ msg: "Not Valid Data" });

  let createdTransaction;

  try {
    createdTransaction = await createTransaction(
      {
        budgetId,
        title,
        amount,
        type,
        icon, // V1 UI UPDATE
      },
      userId,
    );
  } catch (error) {
    return res.status(404).json({
      msg: error.message,
    });
  }

  return res.json(createdTransaction);
}

export async function getAllTransactionController(req, res) {
  const userId = req.user.id;

  const { type, budgetId, startDate, endDate, limit, sortBy, order, search } =
    req.query;

  let allTransaction;

  try {
    allTransaction = await getAllTransaction({
      userId,
      type,
      budgetId,
      startDate,
      endDate,
      limit,
      sortBy,
      order,
      search,
    });
  } catch (error) {
    return res.status(404).json({
      msg: error.message,
    });
  }
  return res.json(allTransaction);
}

export async function getTransactionController(req, res) {
  const userId = req.user.id;

  const { transactionId } = req.params;

  let transaction;

  try {
    transaction = await getTransaction(transactionId, userId);
  } catch (error) {
    return res.status(404).json({
      msg: error.message,
    });
  }

  return res.json(transaction);
}

export async function updateTransactionController(req, res) {
  const userId = req.user.id;
  const { transactionId } = req.params;
  const { budgetId, title, amount, type, icon } = req.body; // V1 UI UPDATE

  if (type && type !== "EXPENSE" && type !== "INCOME") {
    return res.status(400).json({ msg: "Not Valid Data" });
  }

  let updatedTransaction;

  try {
    updatedTransaction = await updateTransaction(
      transactionId,
      {
        budgetId,
        title,
        amount,
        type,
        icon, // V1 UI UPDATE
      },
      userId,
    );
  } catch (error) {
    return res.status(404).json({
      msg: error.message,
    });
  }

  return res.json(updatedTransaction);
}

export async function deleteTransactionController(req, res) {
  const userId = req.user.id;
  const { transactionId } = req.params;

  let deletedTransaction;

  try {
    deletedTransaction = await deleteTransaction(transactionId, userId);
  } catch (error) {
    return res.status(404).json({
      msg: error.message,
    });
  }
  return res.json(deletedTransaction);
}
