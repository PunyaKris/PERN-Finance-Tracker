import { Router } from "express";
import {
  createBudgetController,
  getAllBudgetController,
  getBudgetController,
  deleteBudgetController,
  updateBudgetController,
} from "../controllers/budget.controllers.js";

const router = Router();

router.get("/", getAllBudgetController);
router.get("/:budgetId", getBudgetController);
router.post("/", createBudgetController);
router.patch("/:budgetId", updateBudgetController);
router.delete("/:budgetId", deleteBudgetController);

export default router;
