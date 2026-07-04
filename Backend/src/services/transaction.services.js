import prisma from "../utils/prisma.js";

export async function createTransaction(transactionData, userId) {
  const createdTransction = await prisma.transaction.create({
    data: {
      ownerId: userId,
      budgetId: transactionData.budgetId,
      title: transactionData.title,
      amount: transactionData.amount,
      type: transactionData.type,
      icon: transactionData.icon, // V1 UI UPDATE
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
