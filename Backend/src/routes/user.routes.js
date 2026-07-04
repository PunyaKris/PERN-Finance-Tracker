import { Router } from "express";
import {
  getUserController,
  updateUserController,
} from "../controllers/user.controllers.js";

const router = Router();

router.get("/me", getUserController);
router.patch("/me", updateUserController);

export default router;
