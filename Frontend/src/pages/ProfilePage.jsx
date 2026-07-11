import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Settings } from "lucide-react";
import { getUserServices, editUserService } from "../services/userServices";
import AppLayout from "../components/AppLayout";
import Loading from "../components/Loading";
import ErrorState from "../components/ErrorState";
import "./ProfilePage.css";

const ProfilePage = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [globalDailyLimit, setGlobalDailyLimit] = useState(0);
  const [globalMonthlyLimit, setGlobalMonthlyLimit] = useState(0);
  const [globalYearlyLimit, setGlobalYearlyLimit] = useState(0);
  const [editingMode, setEditingMode] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [editSnapshot, setEditSnapshot] = useState(null);

  async function getUser() {
    setProfileError(false);
    setProfileLoading(true);

    try {
      const response = await getUserServices();
      const user = response.data;
      setEmail(user.email || "");
      setUsername(user.username || "");
      setGlobalDailyLimit(user.globalDailyLimit ?? 0);
      setGlobalMonthlyLimit(user.globalMonthlyLimit ?? 0);
      setGlobalYearlyLimit(user.globalYearlyLimit ?? 0);
    } catch (error) {
      setProfileError(true);
    } finally {
      setProfileLoading(false);
    }
  }

  useEffect(() => {
    const getUserCaller = async () => await getUser();
    getUserCaller();
  }, []);

  function handleEnterEditMode() {
    setEditSnapshot({
      username,
      globalDailyLimit,
      globalMonthlyLimit,
      globalYearlyLimit,
    });
    setEditingMode(true);
    setSaveError(false);
  }

  function handleCancelEdit() {
    if (editSnapshot) {
      setUsername(editSnapshot.username || "");
      setGlobalDailyLimit(editSnapshot.globalDailyLimit ?? 0);
      setGlobalMonthlyLimit(editSnapshot.globalMonthlyLimit ?? 0);
      setGlobalYearlyLimit(editSnapshot.globalYearlyLimit ?? 0);
    }
    setEditingMode(false);
    setSaveError(false);
  }

  function serializeLimitValue(value) {
    if (value === null || value === undefined || value === "") {
      return null;
    }

    const numericValue = Number(value);

    if (Number.isNaN(numericValue)) {
      return null;
    }

    return numericValue < 0 ? null : numericValue;
  }

  async function saveUserHandler() {
    setSaveError(false);

    try {
      await editUserService(
        username,
        serializeLimitValue(globalDailyLimit),
        serializeLimitValue(globalMonthlyLimit),
        serializeLimitValue(globalYearlyLimit),
      );
      setEditingMode(false);
      await getUser();
    } catch (error) {
      setSaveError(true);
    }
  }

  function formatLimitValue(value) {
    const numericValue = Number(value);

    if (
      value === null ||
      value === undefined ||
      value === "" ||
      Number.isNaN(numericValue) ||
      numericValue <= 0
    ) {
      return "Not set";
    }

    return `₹${numericValue.toLocaleString("en-IN")}`;
  }

  const profileInitial = (username || email || "U").charAt(0).toUpperCase();

  if (profileLoading && !profileError) {
    return (
      <AppLayout>
        <div className="profile-page">
          <Loading />
        </div>
      </AppLayout>
    );
  }

  if (profileError) {
    return (
      <AppLayout>
        <div className="profile-page">
          <ErrorState
            title="Couldn't load profile."
            description="We couldn't fetch your profile details right now."
            actionLabel="Retry"
            onAction={() => getUser()}
            centered
          />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="profile-page">
        <div className="profile-page__top-area">
          <button
            className="profile-page__back-link"
            onClick={() => navigate("/dashboard")}
          >
            ← Back to Dashboard
          </button>

          <header className="profile-page__header">
            <div className="profile-page__title-group">
              <h1 className="profile-page__title">Profile</h1>
              <p className="profile-page__subtitle">
                Manage your profile and spending limits.
              </p>
            </div>

            <div className="profile-page__actions">
              {editingMode ? (
                <>
                  <button
                    type="button"
                    className="profile-page__button profile-page__button--secondary"
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="profile-page__button"
                    onClick={saveUserHandler}
                  >
                    Save Changes
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className="profile-page__icon-button"
                  onClick={handleEnterEditMode}
                  aria-label="Edit profile"
                >
                  <Settings
                    className="profile-page__settings-icon"
                    size={18}
                    strokeWidth={2.2}
                  />
                </button>
              )}
            </div>
          </header>
        </div>

        <section className="profile-page__section">
          <div className="profile-page__card profile-page__card--profile">
            <div className="profile-page__avatar" aria-hidden="true">
              {profileInitial}
            </div>

            <div className="profile-page__profile-meta">
              <h2 className="profile-page__profile-name">
                {username || "Member"}
              </h2>
              <p className="profile-page__profile-subtitle">
                Manage your profile and spending limits
              </p>

              <div className="profile-page__profile-info">
                <div className="profile-page__profile-info-row">
                  <span className="profile-page__profile-info-label">Name</span>
                  {editingMode ? (
                    <input
                      className="profile-page__input"
                      value={username}
                      type="text"
                      onChange={(event) => setUsername(event.target.value)}
                    />
                  ) : (
                    <span className="profile-page__profile-info-value">
                      {username || "Not set"}
                    </span>
                  )}
                </div>

                <div className="profile-page__profile-info-row">
                  <span className="profile-page__profile-info-label">
                    Email
                  </span>
                  <span className="profile-page__profile-info-value">
                    {email || "Not set"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="profile-page__section">
          <div className="profile-page__section-heading">
            <h2 className="profile-page__section-title">Global Limits</h2>
            <p className="profile-page__section-subtitle">
              Set your overall spending limits
            </p>
          </div>

          <div className="profile-page__limits-list">
            <div className="profile-page__limit-card">
              <span className="profile-page__limit-icon">☀</span>
              <div className="profile-page__limit-copy">
                <h3 className="profile-page__limit-title">Daily Limit</h3>
                <p className="profile-page__limit-subtitle">
                  Maximum you can spend per day
                </p>
              </div>
              <div className="profile-page__limit-value">
                {editingMode ? (
                  <input
                    className="profile-page__input"
                    value={globalDailyLimit ?? 0}
                    type="number"
                    min="0"
                    inputMode="numeric"
                    onChange={(event) =>
                      setGlobalDailyLimit(event.target.value)
                    }
                  />
                ) : (
                  <span>{formatLimitValue(globalDailyLimit)}</span>
                )}
              </div>
            </div>

            <div className="profile-page__limit-card">
              <span className="profile-page__limit-icon profile-page__limit-icon--monthly">
                ◷
              </span>
              <div className="profile-page__limit-copy">
                <h3 className="profile-page__limit-title">Monthly Limit</h3>
                <p className="profile-page__limit-subtitle">
                  Maximum you can spend per month
                </p>
              </div>
              <div className="profile-page__limit-value">
                {editingMode ? (
                  <input
                    className="profile-page__input"
                    value={globalMonthlyLimit ?? 0}
                    type="number"
                    min="0"
                    inputMode="numeric"
                    onChange={(event) =>
                      setGlobalMonthlyLimit(event.target.value)
                    }
                  />
                ) : (
                  <span>{formatLimitValue(globalMonthlyLimit)}</span>
                )}
              </div>
            </div>

            <div className="profile-page__limit-card">
              <span className="profile-page__limit-icon profile-page__limit-icon--yearly">
                ◆
              </span>
              <div className="profile-page__limit-copy">
                <h3 className="profile-page__limit-title">Yearly Limit</h3>
                <p className="profile-page__limit-subtitle">
                  Maximum you can spend per year
                </p>
              </div>
              <div className="profile-page__limit-value">
                {editingMode ? (
                  <input
                    className="profile-page__input"
                    value={globalYearlyLimit ?? 0}
                    type="number"
                    min="0"
                    inputMode="numeric"
                    onChange={(event) =>
                      setGlobalYearlyLimit(event.target.value)
                    }
                  />
                ) : (
                  <span>{formatLimitValue(globalYearlyLimit)}</span>
                )}
              </div>
            </div>
          </div>
        </section>

        {saveError && (
          <ErrorState
            title="Something went wrong."
            description="We couldn't save your profile changes right now."
            compact
          />
        )}
      </div>
    </AppLayout>
  );
};

export default ProfilePage;
