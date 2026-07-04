import prisma from "../utils/prisma.js";

export async function getUserService(userId) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      username: true,
      email: true,
      globalDailyLimit: true,
      globalMonthlyLimit: true,
      globalYearlyLimit: true,
    },
  });

  if (!user) throw new Error("User Not Found");

  return user;
}

export async function updateUserService(
  userId,
  username,
  globalDailyLimit,
  globalMonthlyLimit,
  globalYearlyLimit,
) {
  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      username: username,
      globalDailyLimit: globalDailyLimit,
      globalMonthlyLimit: globalMonthlyLimit,
      globalYearlyLimit: globalYearlyLimit,
    },
    select: {
      id: true,
      username: true,
      email: true,
      globalDailyLimit: true,
      globalMonthlyLimit: true,
      globalYearlyLimit: true,
    },
  });

  return updatedUser;
}
