/**
 * File: src/routes/categories.route.js
 * Rute untuk mengakses fungsionalitas kategori.
 */
import { Router } from "express";
import * as categoriesController from "../controllers/categories.controller.js";
import * as categoriesService from "../services/categories.service.js";
import NotFoundError from "../exceptions/not-found.error.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validation.middleware.js";
import { CategorySchema } from "../validators/categories.validator.js";

const router = Router();

const verifyCategoryExists = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (
      !Number.isInteger(Number(id)) ||
      Number(id) <= 0 ||
      Number(id) > 2147483647
    ) {
      throw new NotFoundError("Gagal memperbarui. Kategori tidak ditemukan.");
    }
    await categoriesService.getCategoryById(id);
    next();
  } catch (error) {
    if (error instanceof NotFoundError) {
      return next(
        new NotFoundError("Gagal memperbarui. Kategori tidak ditemukan.")
      );
    }
    next(error);
  }
};

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
  verifyCategoryExists,
  validate(CategorySchema),
  categoriesController.putCategory
);
router.delete("/:id", verifyToken, categoriesController.deleteCategory);

export default router;
