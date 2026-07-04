import prisma from "../utils/prisma.js";

const dashboardService = async (userId) => {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  // V1 UI UPDATE
  const yearStart = new Date(now.getFullYear(), 0, 1);
  // V1 UI UPDATE
  const nextYearStart = new Date(now.getFullYear() + 1, 0, 1);
  // V1 UI UPDATE
  const todayStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    0,
  );
  const tommorowStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1,
    0,
  );

  const [
    budgetCount,
    monthlyIncome,
    monthlyExpense,
    dailyIncome,
    dailyExpense,
    // V1 UI UPDATE
    yearlyIncome,
    // V1 UI UPDATE
    yearlyExpense,
    // V1 UI UPDATE
    user,
  ] = await Promise.all([
    prisma.budget.count({
      where: {
        ownerId: userId,
      },
    }),

    prisma.transaction.aggregate({
      where: {
        ownerId: userId,
        type: "INCOME",
        transactionDate: {
          gte: monthStart,
          lt: nextMonthStart,
        },
      },
      _sum: {
        amount: true,
      },
    }),

    prisma.transaction.aggregate({
      where: {
        ownerId: userId,
        type: "EXPENSE",
        transactionDate: {
          gte: monthStart,
          lt: nextMonthStart,
        },
      },
      _sum: {
        amount: true,
      },
    }),

    prisma.transaction.aggregate({
      where: {
        ownerId: userId,
        type: "INCOME",
        transactionDate: {
          gte: todayStart,
          lt: tommorowStart,
        },
      },
      _sum: {
        amount: true,
      },
    }),

    prisma.transaction.aggregate({
      where: {
        ownerId: userId,
        type: "EXPENSE",
        transactionDate: {
          gte: todayStart,
          lt: tommorowStart,
        },
      },
      _sum: {
        amount: true,
      },
    }),

    // V1 UI UPDATE
    prisma.transaction.aggregate({
      where: {
        ownerId: userId,
        type: "INCOME",
        transactionDate: {
          gte: yearStart,
          lt: nextYearStart,
        },
      },
      _sum: {
        amount: true,
      },
    }),

    // V1 UI UPDATE
    prisma.transaction.aggregate({
      where: {
        ownerId: userId,
        type: "EXPENSE",
        transactionDate: {
          gte: yearStart,
          lt: nextYearStart,
        },
      },
      _sum: {
        amount: true,
      },
    }),

    prisma.user.findUnique({
      where: {
        id: userId,
      },
    }),
  ]);

  const totalMonthlyIncome = monthlyIncome._sum.amount ?? 0;
  const totalMonthlyExpense = monthlyExpense._sum.amount ?? 0;
  const totalDailyIncome = dailyIncome._sum.amount ?? 0;
  const totalDailyExpense = dailyExpense._sum.amount ?? 0;
  // V1 UI UPDATE
  const totalYearlyIncome = yearlyIncome._sum.amount ?? 0;
  // V1 UI UPDATE
  const totalYearlyExpense = yearlyExpense._sum.amount ?? 0;
  const dailyLimit = user.globalDailyLimit ?? 0;
  const monthlyLimit = user.globalMonthlyLimit ?? 0;
  // V1 UI UPDATE
  const yearlyLimit = user.globalYearlyLimit ?? 0;

  return {
    budgetCount,

    daily: {
      earned: totalDailyIncome,
      spent: totalDailyExpense,
      netSum: totalDailyIncome - totalDailyExpense,
      limit: dailyLimit,
      left: dailyLimit - totalDailyExpense,
    },

    monthly: {
      earned: totalMonthlyIncome,
      spent: totalMonthlyExpense,
      netSum: totalMonthlyIncome - totalMonthlyExpense,
      limit: monthlyLimit,
      left: monthlyLimit - totalMonthlyExpense,
    },

    // V1 UI UPDATE
    yearly: {
      earned: totalYearlyIncome,
      spent: totalYearlyExpense,
      netSum: totalYearlyIncome - totalYearlyExpense,
      limit: yearlyLimit,
      left: yearlyLimit - totalYearlyExpense,
    },
  };
};

export default dashboardService;
