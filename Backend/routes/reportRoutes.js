import express from "express";
import {
  getProfitLossReport,
  getSalesReport,
  getInventoryReport,
  getCashFlowReport,
  getDashboardStats,
  getAIInsights,
} from "../controllers/reportController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

router.get("/dashboard", getDashboardStats);
router.get("/profit-loss", getProfitLossReport);
router.get("/sales", getSalesReport);
router.get("/inventory", getInventoryReport);
router.get("/cashflow", getCashFlowReport);
router.get("/ai-insights", getAIInsights);

export default router;
