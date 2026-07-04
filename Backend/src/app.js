import express from "express";
import authRouter from "./routes/auth.routes.js";
import budgetRouter from "./routes/budget.routes.js";
import transactionRouter from "./routes/transaction.routes.js";
import userRouter from "./routes/user.routes.js";
import dashboardRouter from "./routes/dashboard.routes.js";
import logger from "./middleware/logger.js";
import cors from "cors";
import { authMiddleware } from "./middleware/auth.middleware.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);
app.use(logger);
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/budget", authMiddleware, budgetRouter);
app.use("/api/transaction", authMiddleware, transactionRouter);
app.use("/api/user", authMiddleware, userRouter);
app.use("/api/dashboard", authMiddleware, dashboardRouter);

app.get("/", (req, res) => {
  res.json({ msg: "app is running fine" });
});

export default app;
