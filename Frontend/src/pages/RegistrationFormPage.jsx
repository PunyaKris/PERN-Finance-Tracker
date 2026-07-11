import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register, login } from "../services/authService";
import Loading from "../components/Loading";
import ErrorState from "../components/ErrorState";
import "./AuthPage.css";
const RegisterPage = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState(""); // V1 UI UPDATE
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  async function registerClickHandler() {
    setSubmitError("");
    setIsSubmitting(true);

    try {
      await register(username, email, password);
      await login(email, password);
      navigate("/profile");
    } catch (error) {
      setSubmitError("Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-page__card">
        <h1> Register </h1>
        <label>Username:</label>
        <input
          className="auth-page__input"
          value={username}
          type="text"
          onChange={(event) => setUsername(event.target.value)}
        />
        <label>Email:</label>
        <input
          className="auth-page__input"
          value={email}
          type="text"
          onChange={(event) => setEmail(event.target.value)}
        />
        <label>Password:</label>
        <input
          className="auth-page__input"
          value={password}
          type="password"
          onChange={(event) => setPassword(event.target.value)}
        />
        {isSubmitting && <Loading />}
        {submitError && (
          <ErrorState
            title="Something went wrong."
            description="We couldn't complete your registration right now."
            compact
          />
        )}
        <button className="auth-page__button" onClick={registerClickHandler}>
          Register
        </button>
      </section>
    </main>
  );
};

export default RegisterPage;
