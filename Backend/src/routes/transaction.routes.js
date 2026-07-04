import { Router } from "express";
import {
  getAllTransactionController,
  getTransactionController,
  createTransactionController,
  updateTransactionController,
  deleteTransactionController,
} from "../controllers/transaction.controllers.js";

const router = Router();

router.get("/", getAllTransactionController);
router.get("/:transactionId", getTransactionController);
router.post("/", createTransactionController);
router.patch("/:transactionId", updateTransactionController);
router.delete("/:transactionId", deleteTransactionController);

export default router;
