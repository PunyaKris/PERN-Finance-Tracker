import prisma from "../utils/prisma.js";

async function validateBudgetCompatibility(transactionData, userId) {
  if (!transactionData.budgetId) {
    return;
  }

  const budget = await prisma.budget.findFirst({
    where: {
      id: transactionData.budgetId,
      ownerId: userId,
    },
    select: {
      id: true,
      budgetType: true,
    },
  });

  if (!budget) {
    throw new Error("Budget not found.");
  }

  const normalizedTransactionType = String(transactionData.type ?? "")
    .trim()
    .toUpperCase();
  const normalizedBudgetType = String(budget.budgetType ?? "")
    .trim()
    .toUpperCase();

  if (
    normalizedTransactionType &&
    normalizedBudgetType &&
    normalizedTransactionType !== normalizedBudgetType
  ) {
    throw new Error(
      normalizedTransactionType === "EXPENSE"
        ? "Expense transactions can only be added to Expense budgets."
        : "Income transactions can only be added to Income budgets.",
    );
  }
}

export async function createTransaction(transactionData, userId) {
  await validateBudgetCompatibility(transactionData, userId);

  const PALETTE = [
    "blue",
    "green",
    "purple",
    "orange",
    "teal",
    "pink",
    "red",
    "amber",
    "indigo",
    "cyan",
    "lime",
    "violet",
    "rose",
    "sky",
    "emerald",
  ];

  // Independent transaction accent pool: find used accents for this user's transactions
  const used = await prisma.transaction.findMany({
    where: {
      ownerId: userId,
      accentColor: { not: null },
    },
    select: { accentColor: true },
  });

  const usedSet = new Set(used.map((u) => u.accentColor));
  let accent = PALETTE.find((c) => !usedSet.has(c));

  if (!accent) {
    // All used: cycle deterministically based on current transaction count
    const count = await prisma.transaction.count({
      where: { ownerId: userId },
    });
    accent = PALETTE[count % PALETTE.length];
  }

  const createdTransction = await prisma.transaction.create({
    data: {
      ownerId: userId,
      budgetId: transactionData.budgetId,
      title: transactionData.title,
      amount: transactionData.amount,
      type: transactionData.type,
      icon: transactionData.icon, // V1 UI UPDATE
      note: transactionData.note,
      accentColor: accent,
    },
  });

  return createdTransction;
}

export async function getAllTransaction({
  userId,
  type,
  budgetId,
  startDate,
  endDate,
  limit,
  sortBy,
  order,
  search,
}) {
  const where = {
    ownerId: userId,
  };

  const query = {
    where,
  };

  if (type) {
    where.type = type;
  }

  if (budgetId === "null") {
    where.budgetId = null;
  } else if (budgetId) {
    where.budgetId = budgetId;
  }

  if (startDate || endDate) {
    where.transactionDate = {};
    if (startDate) {
      where.transactionDate.gte = new Date(startDate);
    }
    if (endDate) {
      where.transactionDate.lt = new Date(endDate);
    }
  }

  if (search) {
    where.title = {
      contains: search,
      mode: "insensitive",
    };
  }

  if (limit) {
    query.take = Number(limit);
  }

  if (sortBy) {
    query.orderBy = {
      [sortBy]: order ?? "desc",
    };
  }

  query.include = {
    budget: {
      select: {
        id: true,
        name: true,
      },
    },
  };

  return prisma.transaction.findMany(query);
}

export async function getTransaction(id, userId) {
  const transaction = await prisma.transaction.findFirst({
    where: {
      id,
      ownerId: userId,
    },
  });

  if (!transaction) throw new Error("No Such Transaction Found");

  return transaction;
}

export async function updateTransaction(id, transactionData, userId) {
  await validateBudgetCompatibility(transactionData, userId);

  const transaction = await prisma.transaction.findFirst({
    where: {
      id,
      ownerId: userId,
    },
  });

  if (!transaction) {
    throw new Error("No Such Transaction Found");
  }

  const updatedTransaction = await prisma.transaction.update({
    where: {
      id,
    },
    data: {
      budgetId: transactionData.budgetId,
      title: transactionData.title,
      amount: transactionData.amount,
      type: transactionData.type,
      icon: transactionData.icon, // V1 UI UPDATE
      note: transactionData.note,
    },
  });

  return updatedTransaction;
}

export async function deleteTransaction(id, userId) {
  const transaction = await prisma.transaction.findFirst({
    where: {
      id,
      ownerId: userId,
    },
  });

  if (!transaction) {
    throw new Error("No Such Transaction Found");
  }

  const deletedTransaction = await prisma.transaction.delete({
    where: {
      id,
    },
  });

  return deletedTransaction;
}
