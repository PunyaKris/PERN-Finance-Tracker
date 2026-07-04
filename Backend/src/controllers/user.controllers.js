import {
  getUserService,
  updateUserService,
} from "../services/user.services.js";

export async function getUserController(req, res) {
  const userId = req.user.id;

  let user;

  try {
    user = await getUserService(userId);
  } catch (error) {
    return res.status(404).json({ msg: error.message });
  }

  return res.json(user);
}

export async function updateUserController(req, res) {
  const userId = req.user.id;
  const { username, globalDailyLimit, globalMonthlyLimit, globalYearlyLimit } =
    req.body;

  if (
    globalDailyLimit !== undefined &&
    (!Number.isInteger(globalDailyLimit) || globalDailyLimit <= 0)
  ) {
    return res.status(400).json({
      msg: "globalDailyLimit must be a positive integer",
    });
  }

  if (
    globalMonthlyLimit !== undefined &&
    (!Number.isInteger(globalMonthlyLimit) || globalMonthlyLimit <= 0)
  ) {
    return res.status(400).json({
      msg: "globalMonthlyLimit must be a positive integer",
    });
  }

  if (
    globalYearlyLimit !== undefined &&
    (!Number.isInteger(globalYearlyLimit) || globalYearlyLimit <= 0)
  ) {
    return res.status(400).json({
      msg: "globalYearlyLimit must be a positive integer",
    });
  }

  let updatedUser;

  try {
    updatedUser = await updateUserService(
      userId,
      username,
      globalDailyLimit,
      globalMonthlyLimit,
      globalYearlyLimit,
    );
  } catch (error) {
    return res.status(404).json({ msg: error.message });
  }

  return res.json(updatedUser);
}
