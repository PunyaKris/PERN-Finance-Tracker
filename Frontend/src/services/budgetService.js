import api from "./api";

export const createBudget = async (budget) => {
  const createdBudget = await api.post("/budget", budget);
  return createdBudget;
};

export const getAllBudgetService = async () => {
  const budget = await api.get("/budget");
  return budget;
};

export const getBudget = async (budgetId) => {
  const budget = await api.get(`/budget/${budgetId}`);
  return budget;
};

export const editBudget = async (budgetId, budget) => {
  const editedBudget = await api.patch(`/budget/${budgetId}`, budget);
  return editedBudget;
};

export const deleteBudget = async (budgetId) => {
  const deletedBudget = await api.delete(`/budget/${budgetId}`);
  return deletedBudget;
};
