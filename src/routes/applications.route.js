/**
 * File: src/routes/applications.route.js
 * Rute untuk mengakses fungsionalitas lamaran pekerjaan. Semua rute diproteksi.
 */
import { Router } from "express";
import * as applicationsController from "../controllers/applications.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validation.middleware.js";
import {
  PostApplicationSchema,
  PutApplicationStatusSchema,
} from "../validators/applications.validator.js";

const router = Router();

// Semua rute applications wajib menggunakan token
router.use(verifyToken);

router.post(
  "/",
  validate(PostApplicationSchema),
  applicationsController.postApplication
);
router.get("/", applicationsController.getApplications);
router.get("/:id", applicationsController.getApplicationById);
router.get("/user/:userId", applicationsController.getApplicationsByUser);
router.get("/job/:jobId", applicationsController.getApplicationsByJob);
router.put(
  "/:id",
  validate(PutApplicationStatusSchema),
  applicationsController.putApplication
);
router.delete("/:id", applicationsController.deleteApplication);

export default router;
