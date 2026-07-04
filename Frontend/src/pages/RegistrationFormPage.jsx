import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register, login } from "../services/authService";
const RegisterPage = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState(""); // V1 UI UPDATE
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function registerClickHandler() {
    await register(username, email, password);
    await login(email, password);
    navigate("/profile");
  }

  return (
    <>
      <h1> Register </h1>
      <label>Username:</label>
      <input
        value={username}
        type="text"
        onChange={(event) => setUsername(event.target.value)}
      />
      <label>Email:</label>
      <input
        value={email}
        type="text"
        onChange={(event) => setEmail(event.target.value)}
      />
      <label>Password:</label>
      <input
        value={password}
        type="password"
        onChange={(event) => setPassword(event.target.value)}
      />
      <button onClick={registerClickHandler}> Register </button>
    </>
  );
};

export default RegisterPage;
