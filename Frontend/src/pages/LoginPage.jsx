import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";
import Loading from "../components/Loading";
import ErrorState from "../components/ErrorState";
import "./AuthPage.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [sessionMessage, setSessionMessage] = useState("");

  useEffect(() => {
    const storedMessage = sessionStorage.getItem("authMessage");

    if (storedMessage) {
      setSessionMessage(storedMessage);
      sessionStorage.removeItem("authMessage");
      sessionStorage.removeItem("authRedirectInProgress");
    }
  }, []);

  const loginButtonHandler = async () => {
    setSubmitError("");
    setIsSubmitting(true);

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (error) {
      setSubmitError("Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-page__card">
        <h1> Login </h1>
        <label> Email </label>
        <input
          className="auth-page__input"
          type="email"
          value={email}
          placeholder="Email"
          onChange={(event) => {
            setEmail(event.target.value);
          }}
        />
        <label> Password </label>
        <input
          className="auth-page__input"
          type="password"
          value={password}
          placeholder="Password"
          onChange={(event) => {
            setPassword(event.target.value);
          }}
        />
        {isSubmitting && <Loading />}
        {sessionMessage && (
          <ErrorState
            title="Please log in again."
            description={sessionMessage}
            compact
          />
        )}
        {submitError && (
          <ErrorState
            title="Couldn't load dashboard."
            description="We couldn't sign you in right now."
            compact
          />
        )}
        <button className="auth-page__button" onClick={loginButtonHandler}>
          Login
        </button>
        <p>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </section>
    </main>
  );
};

export default LoginPage;
