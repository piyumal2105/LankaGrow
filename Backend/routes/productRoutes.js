import express from "express";
import {
  createProduct, //
  getProducts, //
  getProduct, //
  updateProduct, //
  deleteProduct, //
  updateStock, //
  getLowStockProducts, 
  getProductAnalytics,
} from "../controllers/productController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

router
  .route("/")
  .get(getProducts)
  .post(authorize("admin", "manager"), createProduct);

router.get("/low-stock", getLowStockProducts);
router.get("/analytics", getProductAnalytics);

router
  .route("/:id")
  .get(getProduct)
  .put(authorize("admin", "manager"), updateProduct)
  .delete(authorize("admin", "manager"), deleteProduct);

router.put("/:id/stock", updateStock);

export default router;
