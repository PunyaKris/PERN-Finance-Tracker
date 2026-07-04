import api from "./api.js";

async function getUserStats() {
  const dashboard = await api.get("/dashboard");
  return dashboard;
}

export default getUserStats;
