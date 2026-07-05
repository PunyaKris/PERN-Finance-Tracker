import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserServices, editUserService } from "../services/userServices";
import AppLayout from "../components/AppLayout";
import StatsCard from "../components/StatsCard";
import Stat from "../components/Stat";
import "./ProfilePage.css";

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
      <div className="profile-page">
        <header className="profile-page__header">
          <div className="profile-page__title-group">
            <h1 className="profile-page__title">Profile</h1>
            <p className="profile-page__subtitle">
              Manage your personal information and global spending limits.
            </p>
          </div>
        </header>

        <section className="profile-page__section">
          <h2 className="profile-page__section-title">Profile Information</h2>
          <div className="profile-page__card">
            {editingMode ? (
              <div className="profile-page__field-group">
                <label className="profile-page__label">Username</label>
                <input
                  className="profile-page__input"
                  value={username}
                  type="text"
                  onChange={(event) => setUsername(event.target.value)}
                />
              </div>
            ) : (
              <div className="profile-page__info-row">
                <span className="profile-page__info-label">Name</span>
                <span className="profile-page__info-value">{username}</span>
              </div>
            )}

            <div className="profile-page__info-row">
              <span className="profile-page__info-label">Email</span>
              <span className="profile-page__info-value">{email}</span>
            </div>
          </div>
        </section>

        <section className="profile-page__section">
          <h2 className="profile-page__section-title">Global Budget Limits</h2>
          <div className="profile-page__stats-grid">
            <StatsCard title="Daily Limit">
              {editingMode ? (
                <div className="profile-page__field-group">
                  <label className="profile-page__label">Daily Limit</label>
                  <input
                    className="profile-page__input"
                    value={globalDailyLimit}
                    type="number"
                    onChange={(event) =>
                      setGlobalDailyLimit(event.target.value)
                    }
                  />
                </div>
              ) : (
                <>
                  <Stat title="Spent Today" value={globalDailyLimit} />
                  <Stat title="Daily Limit" value={globalDailyLimit} />
                  <Stat title="Today Left" value={globalDailyLimit} />
                </>
              )}
            </StatsCard>

            <StatsCard title="Monthly Limit">
              {editingMode ? (
                <div className="profile-page__field-group">
                  <label className="profile-page__label">Monthly Limit</label>
                  <input
                    className="profile-page__input"
                    value={globalMonthlyLimit}
                    type="number"
                    onChange={(event) =>
                      setGlobalMonthlyLimit(event.target.value)
                    }
                  />
                </div>
              ) : (
                <>
                  <Stat title="Spent This Month" value={globalMonthlyLimit} />
                  <Stat title="Monthly Limit" value={globalMonthlyLimit} />
                  <Stat title="Month Left" value={globalMonthlyLimit} />
                </>
              )}
            </StatsCard>

            <StatsCard title="Yearly Limit">
              {editingMode ? (
                <div className="profile-page__field-group">
                  <label className="profile-page__label">Yearly Limit</label>
                  <input
                    className="profile-page__input"
                    value={globalYearlyLimit}
                    type="number"
                    onChange={(event) =>
                      setGlobalYearlyLimit(event.target.value)
                    }
                  />
                </div>
              ) : (
                <>
                  <Stat title="Spent This Year" value={globalYearlyLimit} />
                  <Stat title="Yearly Limit" value={globalYearlyLimit} />
                  <Stat title="Year Left" value={globalYearlyLimit} />
                </>
              )}
            </StatsCard>
          </div>
        </section>

        <section className="profile-page__section">
          <h2 className="profile-page__section-title">Account Actions</h2>
          <div className="profile-page__actions">
            <button
              className="profile-page__button"
              onClick={
                editingMode ? saveUserHandler : () => setEditingMode(true)
              }
            >
              {editingMode ? "Save" : "Edit Profile"}
            </button>
            <button
              className="profile-page__button profile-page__button--secondary"
              onClick={() => navigate("/dashboard")}
            >
              Back to Dashboard
            </button>
          </div>
        </section>
      </div>
    </AppLayout>
  );
};

export default ProfilePage;
