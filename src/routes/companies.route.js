/**
 * File: src/routes/companies.route.js
 * Rute untuk mengakses fungsionalitas perusahaan.
 */
import { Router } from "express";
import * as companiesController from "../controllers/companies.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validation.middleware.js";
import { CompanySchema } from "../validators/companies.validator.js";

const router = Router();

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
  validate(CompanySchema),
  companiesController.putCompany
);
router.delete("/:id", verifyToken, companiesController.deleteCompany);

export default router;
