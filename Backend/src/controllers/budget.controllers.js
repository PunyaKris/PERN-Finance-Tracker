import {
  createBudgetService,
  getAllBudgetService,
  getBudgetService,
  deleteBudgetService,
  updateBudgetService,
} from "../services/budget.services.js";

export async function createBudgetController(req, res) {
  const {
    name,
    description, // V1 UI UPDATE
    icon, // V1 UI UPDATE
    budgetType,
    dailyLimit,
    weeklyLimit,
    monthlyLimit,
  } = req.body;
  const id = req.user.id;

  if (!name || !budgetType || !["EXPENSE", "INCOME"].includes(budgetType)) {
    return res.status(400).json({
      message: "Validation failed",
    });
  }

  let createdBudget;

  try {
    createdBudget = await createBudgetService({
      ownerId: id,
      name,
      description, // V1 UI UPDATE
      icon, // V1 UI UPDATE
      budgetType,
      dailyLimit,
      weeklyLimit,
      monthlyLimit,
    });
  } catch (error) {
    return res.json({ msg: error.message });
  }

  res.status(201).json(createdBudget);
}

export async function getAllBudgetController(req, res) {
  const allBudgets = await getAllBudgetService(req.user.id);
  return res.json(allBudgets);
}

export async function getBudgetController(req, res) {
  const budgetId = req.params.budgetId;
  const userId = req.user.id;

  let budgetDetails;
  try {
    budgetDetails = await getBudgetService(budgetId, userId);
  } catch (error) {
    return res.json({ msg: error.message });
  }
  return res.json(budgetDetails);
}

export async function deleteBudgetController(req, res) {
  const userId = req.user.id;

  try {
    const budget = await deleteBudgetService(req.params.budgetId, userId);
    return res.json({ budget });
  } catch (error) {
    return res.status(404).json({
      msg: error.message,
    });
  }
}

export async function updateBudgetController(req, res) {
  const { budgetId } = req.params;
  const {
    name,
    description, // V1 UI UPDATE
    icon, // V1 UI UPDATE
    budgetType,
    dailyLimit,
    weeklyLimit,
    monthlyLimit,
  } = req.body;
  const userId = req.user.id;

  if (budgetType && !["EXPENSE", "INCOME"].includes(budgetType)) {
    return res.status(400).json({
      message: "Validation failed",
    });
  }

  try {
    const updatedBudget = await updateBudgetService(
      budgetId,
      {
        name,
        description, // V1 UI UPDATE
        icon, // V1 UI UPDATE
        budgetType,
        dailyLimit,
        weeklyLimit,
        monthlyLimit,
      },
      userId,
    );

    return res.json(updatedBudget);
  } catch (error) {
    return res.status(404).json({
      msg: error.message,
    });
  }
}
