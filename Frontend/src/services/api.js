import axios from "axios";

const authMessageStorageKey = "authMessage";
const authRedirectStorageKey = "authRedirectInProgress";
const redirectPath = "/login";
const protectedAuthPages = new Set(["/login", "/register"]);

const api = axios.create({
  baseURL: "http://localhost:8000/api",
});

const clearAuthState = () => {
  localStorage.removeItem("token");
};

const redirectToLogin = () => {
  const currentPath = window.location.pathname;

  if (protectedAuthPages.has(currentPath)) {
    return;
  }

  if (sessionStorage.getItem(authRedirectStorageKey) === "true") {
    return;
  }

  sessionStorage.setItem(authRedirectStorageKey, "true");
  sessionStorage.setItem(
    authMessageStorageKey,
    "Your session has expired. Please log in again.",
  );
  window.location.replace(redirectPath);
};

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const responseMessage = String(error?.response?.data?.msg ?? "").trim();
    const normalizedMessage = responseMessage.toLowerCase();
    const isAuthFailure =
      status === 401 ||
      normalizedMessage.includes("invalid token") ||
      normalizedMessage.includes("no token provided") ||
      normalizedMessage.includes("invalid authorization header");

    if (isAuthFailure) {
      clearAuthState();
      redirectToLogin();
    }

    return Promise.reject(error);
  },
);

export default api;
