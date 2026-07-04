import prisma from "../utils/prisma.js";

function calculateBudgetStats(budget) {
  const now = new Date();

  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const MonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const thisWeekStart = new Date(now);
  const daysSinceMonday = (now.getDay() + 6) % 7;
  thisWeekStart.setDate(now.getDate() - daysSinceMonday);
  thisWeekStart.setHours(0, 0, 0, 0);

  const nextWeekStart = new Date(thisWeekStart);
  nextWeekStart.setDate(thisWeekStart.getDate() + 7);

  let dailyAmount = 0;
  let weeklyAmount = 0;
  let monthlyAmount = 0;

  budget.transactions.forEach((transaction) => {
    if (transaction.transactionDate >= todayStart)
      dailyAmount += Number(transaction.amount);
    if (transaction.transactionDate >= MonthStart)
      monthlyAmount += Number(transaction.amount);
    if (
      transaction.transactionDate >= thisWeekStart &&
      transaction.transactionDate < nextWeekStart
    )
      weeklyAmount += Number(transaction.amount);
  });

  let dailyRemaining;
  let weeklyRemaining;
  let monthlyRemaining;

  if (budget.dailyLimit) dailyRemaining = budget.dailyLimit - dailyAmount;
  if (budget.weeklyLimit) weeklyRemaining = budget.weeklyLimit - weeklyAmount;
  if (budget.monthlyLimit)
    monthlyRemaining = budget.monthlyLimit - monthlyAmount;
  // Only send remaining info to frontend if the limit is not Zero, null or undefined

  return {
    daily: {
      amount: dailyAmount,
      limit: budget.dailyLimit ?? 0,
      left: dailyRemaining,
    },
    weekly: {
      amount: weeklyAmount,
      limit: budget.weeklyLimit ?? 0,
      left: weeklyRemaining,
    },
    monthly: {
      amount: monthlyAmount,
      limit: budget.monthlyLimit ?? 0,
      left: monthlyRemaining,
    },
  };
}

export async function createBudgetService(budgetData) {
  const createdBudget = await prisma.budget.create({
    data: {
      ownerId: budgetData.ownerId, // temporary until JWT auth exists
      name: budgetData.name,
      description: budgetData.description, // V1 UI UPDATE
      icon: budgetData.icon, // V1 UI UPDATE
      budgetType: budgetData.budgetType,
      dailyLimit: budgetData.dailyLimit,
      weeklyLimit: budgetData.weeklyLimit,
      monthlyLimit: budgetData.monthlyLimit,
    },
  });

  return createdBudget;
}

export async function getAllBudgetService(ownerId) {
  const now = new Date();
  const MonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const MonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  const budgets = await prisma.budget.findMany({
    where: {
      ownerId: ownerId,
    },
    include: {
      transactions: {
        where: {
          transactionDate: {
            gte: MonthStart,
            lt: MonthEnd,
          },
        },
      },
    },
  });

  const allBudgets = budgets.map((budget) => ({
    ...budget,
    ...calculateBudgetStats(budget),
  }));

  return allBudgets;
}

export async function getBudgetService(id, userId) {
  const now = new Date();

  const twoMonthAgo = new Date(now);
  twoMonthAgo.setDate(now.getDate() - 62);
  twoMonthAgo.setHours(0, 0, 0, 0);

  const budget = await prisma.budget.findFirst({
    where: {
      id: id,
      ownerId: userId,
    },
    include: {
      transactions: {
        where: {
          transactionDate: {
            gte: twoMonthAgo,
          },
        },
        orderBy: {
          transactionDate: "desc",
        },
      },
    },
  });

  if (!budget) throw new Error("Budget not found");

  const budgetStats = calculateBudgetStats(budget);

  return {
    ...budget,
    ...budgetStats,
  };
}

export async function deleteBudgetService(id, userId) {
  const budget = await prisma.budget.findFirst({
    where: {
      id,
      ownerId: userId,
    },
  });

  if (!budget) {
    throw new Error("Budget not found");
  }

  const deletedBudget = await prisma.budget.delete({
    where: {
      id: id,
    },
  });

  return deletedBudget;
}

export async function updateBudgetService(id, budgetData, userId) {
  const budget = await prisma.budget.findFirst({
    where: {
      id,
      ownerId: userId,
    },
  });

  if (!budget) {
    throw new Error("Budget not found");
  }

  const updatedBudget = await prisma.budget.update({
    where: {
      id: id,
    },
    data: {
      name: budgetData.name,
      description: budgetData.description, // V1 UI UPDATE
      icon: budgetData.icon, // V1 UI UPDATE
      budgetType: budgetData.budgetType,
      dailyLimit: budgetData.dailyLimit,
      weeklyLimit: budgetData.weeklyLimit,
      monthlyLimit: budgetData.monthlyLimit,
    },
  });

  return updatedBudget;
}
