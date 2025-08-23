import express from "express";
import {
  createInvoice,
  getInvoices,
  getInvoice,
  updateInvoice,
  deleteInvoice,
  markAsPaid,
  sendInvoice,
  getOverdueInvoices,
  generateInvoicePDF,
} from "../controllers/invoiceController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

router.route("/").get(getInvoices).post(createInvoice);

router.get("/overdue", getOverdueInvoices);

router.route("/:id").get(getInvoice).put(updateInvoice).delete(deleteInvoice);

router.put("/:id/pay", markAsPaid);
router.post("/:id/send", sendInvoice);
router.get("/:id/pdf", generateInvoicePDF);

export default router;
