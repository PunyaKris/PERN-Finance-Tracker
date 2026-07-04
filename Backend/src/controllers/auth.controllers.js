// import { testService } from "../services/auth.services.js";
import { registerService, loginService } from "../services/auth.services.js";

export async function registerController(req, res) {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ msg: "username, email and password required" });
  }

  try {
    const user = await registerService(username, email, password);

    return res.status(200).json({
      username: user.username,
      email: user.email,
      passwordHash: user.passwordHash,
    });
  } catch (error) {
    return res.status(409).json({ msg: error.message });
  }
}

export async function loginController(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: "Email And Password Required" });
  }

  try {
    const userToken = await loginService(email, password);

    return res.json({
      token: userToken,
    });
  } catch (error) {
    return res.status(401).json({ msg: error.message });
  }
}
