import express from "express";
import {
  createExpense,
  getExpenses,
  getExpense,
  updateExpense,
  deleteExpense,
  uploadReceipt,
  categorizeExpenseAI,
} from "../controllers/expenseController.js";
import { protect } from "../middleware/auth.js";
import multer from "multer";

const upload = multer({ dest: "uploads/" });

const router = express.Router();

router.use(protect);

router.route("/").get(getExpenses).post(createExpense);

router.post("/categorize", categorizeExpenseAI);
router.post("/upload-receipt", upload.single("receipt"), uploadReceipt);

router.route("/:id").get(getExpense).put(updateExpense).delete(deleteExpense);

export default router;
