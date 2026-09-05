/**
 * File: src/routes/categories.route.js
 * Rute untuk mengakses fungsionalitas kategori.
 */
import { Router } from "express";
import * as categoriesController from "../controllers/categories.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validation.middleware.js";
import { CategorySchema } from "../validators/categories.validator.js";

const router = Router();

// PUBLIC ENDPOINTS
router.get("/", categoriesController.getCategories);
router.get("/:id", categoriesController.getCategoryById);

// PROTECTED ENDPOINTS
router.post(
  "/",
  verifyToken,
  validate(CategorySchema),
  categoriesController.postCategory
);
router.put(
  "/:id",
  verifyToken,
  validate(CategorySchema),
  categoriesController.putCategory
);
router.delete("/:id", verifyToken, categoriesController.deleteCategory);

export default router;
