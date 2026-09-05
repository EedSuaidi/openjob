/**
 * File: src/routes/companies.route.js
 * Rute untuk mengakses fungsionalitas perusahaan.
 */
import { Router } from "express";
import * as companiesController from "../controllers/companies.controller.js";
import * as companiesService from "../services/companies.service.js";
import NotFoundError from "../exceptions/not-found.error.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validation.middleware.js";
import { CompanySchema } from "../validators/companies.validator.js";

const router = Router();

// Middleware untuk memverifikasi keberadaan perusahaan sebelum validasi data pembaruan
const verifyCompanyExists = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (
      !Number.isInteger(Number(id)) ||
      Number(id) <= 0 ||
      Number(id) > 2147483647
    ) {
      throw new NotFoundError("Gagal memperbarui. Perusahaan tidak ditemukan.");
    }
    await companiesService.getCompanyById(id);
    next();
  } catch (error) {
    if (error instanceof NotFoundError) {
      return next(
        new NotFoundError("Gagal memperbarui. Perusahaan tidak ditemukan.")
      );
    }
    next(error);
  }
};

// PUBLIC ENDPOINTS
router.get("/", companiesController.getCompanies);
router.get("/:id", companiesController.getCompanyById);

// PROTECTED ENDPOINTS
router.post(
  "/",
  verifyToken,
  validate(CompanySchema),
  companiesController.postCompany
);
router.put(
  "/:id",
  verifyToken,
  verifyCompanyExists,
  validate(CompanySchema),
  companiesController.putCompany
);
router.delete("/:id", verifyToken, companiesController.deleteCompany);

export default router;
