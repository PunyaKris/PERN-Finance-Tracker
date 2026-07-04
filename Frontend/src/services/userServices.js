import api from "./api";

export const getUserServices = async () => {
  const userResponse = await api.get("/user/me");
  return userResponse;
};

export const editUserService = async (
  username,
  globalDailyLimit,
  globalMonthlyLimit,
  globalYearlyLimit,
) => {
  const body = {
    username, // V1 UI UPDATE
    globalDailyLimit,
    globalMonthlyLimit,
    globalYearlyLimit, // V1 UI UPDATE
  };
  const editedUserResponse = await api.patch("/user/me", body);
  return editedUserResponse;
};
