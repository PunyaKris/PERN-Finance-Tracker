import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginButtonHandler = async () => {
    console.log(email);
    console.log(password);
    try {
      const loginInfo = await login(email, password);
      console.log(loginInfo);
      navigate("/dashboard");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <h1> Login </h1>
      <label> Email </label>
      <input
        type="email"
        value={email}
        placeholder="Email"
        onChange={(event) => {
          setEmail(event.target.value);
        }}
      />
      <label> Password </label>
      <input
        type="password"
        value={password}
        placeholder="Password"
        onChange={(event) => {
          setPassword(event.target.value);
        }}
      />
      <button onClick={loginButtonHandler}> Login </button>
      <p>
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </>
  );
};

export default LoginPage;
