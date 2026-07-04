import jwt from "jsonwebtoken";

export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({
      msg: "No token provided",
    });
  }

  const parts = authHeader.split(" ");

  if (parts.length !== 2) {
    return res.status(401).json({
      msg: "Invalid Authorization Header",
    });
  }

  if (parts[0] !== "Bearer") {
    return res.status(401).json({
      msg: "Invalid Authorization Header",
    });
  }

  const userToken = parts[1];

  try {
    const decodedToken = jwt.verify(userToken, process.env.JWT_SECRET);
    req.user = {
      id: decodedToken.userId,
    };
    next();
  } catch (error) {
    return res.status(401).json({
      msg: "Invalid Token",
    });
  }
}
