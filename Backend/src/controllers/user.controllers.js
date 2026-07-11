import {
  getUserService,
  updateUserService,
} from "../services/user.services.js";

export function normalizeLimitValue(value) {
  if (value === undefined) {
    return undefined;
  }

  if (
    value === null ||
    value === "" ||
    (typeof value === "string" && value.trim() === "")
  ) {
    return null;
  }

  const parsedValue = Number(value);

  if (!Number.isInteger(parsedValue) || parsedValue < 0) {
    return { invalid: true };
  }

  return parsedValue;
}

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

  const normalizedDailyLimit = normalizeLimitValue(globalDailyLimit);
  const normalizedMonthlyLimit = normalizeLimitValue(globalMonthlyLimit);
  const normalizedYearlyLimit = normalizeLimitValue(globalYearlyLimit);

  if (normalizedDailyLimit?.invalid) {
    return res.status(400).json({
      msg: "globalDailyLimit must be a non-negative integer",
    });
  }

  if (normalizedMonthlyLimit?.invalid) {
    return res.status(400).json({
      msg: "globalMonthlyLimit must be a non-negative integer",
    });
  }

  if (normalizedYearlyLimit?.invalid) {
    return res.status(400).json({
      msg: "globalYearlyLimit must be a non-negative integer",
    });
  }

  let updatedUser;

  try {
    updatedUser = await updateUserService(
      userId,
      username,
      normalizedDailyLimit,
      normalizedMonthlyLimit,
      normalizedYearlyLimit,
    );
  } catch (error) {
    return res.status(404).json({ msg: error.message });
  }

  return res.json(updatedUser);
}
