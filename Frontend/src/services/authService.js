import api from "./api";

export async function login(email, password) {
  const body = { email: email, password: password };
  const loginInfo = await api.post("/auth/login", body);
  localStorage.setItem("token", loginInfo.data.token);
  return loginInfo;
}

export async function register(username, email, password) {
  const body = {
    username, // V1 UI UPDATE
    email,
    password,
  };
  const user = await api.post("/auth/register", body);
  return user;
}
