import { Router } from "express";

import dashboardController from "../controllers/dashboard.controllers.js";

const router = Router();

router.get("/", dashboardController);

export default router;
