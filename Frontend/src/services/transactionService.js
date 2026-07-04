import api from "./api";

export const getRecentTransactionService = async () => {
  const transactions = await api.get("/transaction?limit=7");
  return transactions;
};

export const createTransaction = async (transaction) => {
  const createdTransction = await api.post("/transaction", transaction);
  return createdTransction;
};

export const editTransaction = async (newTransaction, prevTransaction) => {
  const editedTransaction = await api.patch(
    `/transaction/${prevTransaction.id}`,
    newTransaction,
  );
  return editedTransaction;
};

export const deleteTransaction = async (transactionId) => {
  const deletedTransaction = await api.delete(`/transaction/${transactionId}`);
  return deletedTransaction;
};

export const getAllUnconsideredTransactions = async () => {
  const transaction = await api.get("/transaction?budgetId=null");
  return transaction;
};
