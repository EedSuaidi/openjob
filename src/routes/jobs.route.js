/**
 * File: src/routes/jobs.route.js
 * Rute untuk mengakses fungsionalitas pekerjaan.
 */
import { Router } from "express";
import * as jobsController from "../controllers/jobs.controller.js";
import * as bookmarksController from "../controllers/bookmarks.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validation.middleware.js";
import { JobSchema } from "../validators/jobs.validator.js";

const router = Router();

// PUBLIC ENDPOINTS
router.get("/", jobsController.getJobs);
router.get("/:id", jobsController.getJobById);
router.get("/company/:companyId", jobsController.getJobsByCompany);
router.get("/category/:categoryId", jobsController.getJobsByCategory);

// PROTECTED ENDPOINTS
router.post("/", verifyToken, validate(JobSchema), jobsController.postJob);
router.put("/:id", verifyToken, validate(JobSchema), jobsController.putJob);
router.delete("/:id", verifyToken, jobsController.deleteJob);

// BOOKMARK ROUTES
router.post("/:jobId/bookmark", verifyToken, bookmarksController.postBookmark);
router.get(
  "/:jobId/bookmark/:id",
  verifyToken,
  bookmarksController.getBookmarkDetail
);
router.delete(
  "/:jobId/bookmark",
  verifyToken,
  bookmarksController.deleteBookmark
);

export default router;
