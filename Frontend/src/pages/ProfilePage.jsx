import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserServices, editUserService } from "../services/userServices";
import AppLayout from "../components/AppLayout";
const ProfilePage = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState(""); // V1 UI UPDATE
  const [email, setEmail] = useState("");
  const [globalDailyLimit, setGlobalDailyLimit] = useState(0);
  const [globalMonthlyLimit, setGlobalMonthlyLimit] = useState(0);
  const [globalYearlyLimit, setGlobalYearlyLimit] = useState(0); // V1 UI UPDATE
  const [editingMode, setEditingMode] = useState(false);

  async function getUser() {
    const response = await getUserServices();
    const user = response.data;
    setEmail(user.email);
    setUsername(user.username); // V1 UI UPDATE
    if (user.globalDailyLimit) setGlobalDailyLimit(user.globalDailyLimit);
    if (user.globalMonthlyLimit) setGlobalMonthlyLimit(user.globalMonthlyLimit);
    if (user.globalYearlyLimit) setGlobalYearlyLimit(user.globalYearlyLimit); // V1 UI UPDATE
  }

  useEffect(() => {
    const getUserCaller = async () => await getUser();
    getUserCaller();
  }, []);

  async function saveUserHandler() {
    const response = await editUserService(
      username,
      Number(globalDailyLimit),
      Number(globalMonthlyLimit),
      Number(globalYearlyLimit),
    );
    const editedUser = response.data;
    console.log(editedUser);
    setEditingMode(false);
    await getUser();
  }

  return (
    <AppLayout>
      <h1>User</h1>
      {editingMode ? (
        <>
          <label>Username</label>
          <input
            value={username}
            type="text"
            onChange={(event) => setUsername(event.target.value)}
          />
        </>
      ) : (
        <h3> Username: {username} </h3>
      )}
      <h3> Email: {email} </h3>

      {editingMode ? (
        <>
          <label>Daily Limit</label>
          <input
            value={globalDailyLimit}
            type="number"
            onChange={(event) => setGlobalDailyLimit(event.target.value)}
          />
        </>
      ) : (
        <h3> Daily Limit: {globalDailyLimit} </h3>
      )}

      {editingMode ? (
        <>
          <label>Monthly Limit</label>
          <input
            value={globalMonthlyLimit}
            type="number"
            onChange={(event) => setGlobalMonthlyLimit(event.target.value)}
          />
        </>
      ) : (
        <h3> Monthly Limit: {globalMonthlyLimit} </h3>
      )}

      {editingMode ? (
        <>
          <label>Yearly Limit</label>
          <input
            value={globalYearlyLimit}
            type="number"
            onChange={(event) => setGlobalYearlyLimit(event.target.value)}
          />
        </>
      ) : (
        <h3> Yearly Limit: {globalYearlyLimit} </h3>
      )}

      <button
        onClick={editingMode ? saveUserHandler : () => setEditingMode(true)}
      >
        {editingMode ? "Save" : "✏️ Edit"}
      </button>
      <button onClick={() => navigate("/dashboard")}> 🔙 Dashboard</button>
    </AppLayout>
  );
};

export default ProfilePage;
