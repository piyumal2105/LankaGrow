import express from "express";
import {
  createCustomer,
  getCustomers,
  getCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomerAnalytics,
  getTopCustomers,
} from "../controllers/customerController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

router.route("/").get(getCustomers).post(createCustomer);

router.get("/analytics", getCustomerAnalytics);
router.get("/top-customers", getTopCustomers);

router
  .route("/:id")
  .get(getCustomer)
  .put(updateCustomer)
  .delete(deleteCustomer);

export default router;
