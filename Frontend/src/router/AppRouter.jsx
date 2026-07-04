import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import RegistrationFormPage from "../pages/RegistrationFormPage";
import DashboardPage from "../pages/DashboardPage";
import BudgetPage from "../pages/BudgetPage";
import ProfilePage from "../pages/ProfilePage";
import NotFoundPage from "../pages/NotFoundPage";
import UnassignedTransactionPage from "../pages/UnassignedTransactionPage";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationFormPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/budget/:budgetId" element={<BudgetPage />} />
        <Route
          path="/unconsideredTransaction"
          element={<UnassignedTransactionPage />}
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
