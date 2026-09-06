/**
 * File: src/routes/users.route.js
 * Rute untuk mengakses fungsionalitas entitas pengguna.
 */
import { Router } from "express";
import * as usersController from "../controllers/users.controller.js";
import {
  validate,
  validateParams,
} from "../middlewares/validation.middleware.js";
import { UserRegistrationSchema } from "../validators/users.validator.js";
import { IdParamSchema } from "../validators/params.validator.js";

const router = Router();

router.post(
  "/",
  validate(UserRegistrationSchema),
  usersController.registerUser
);

router.get(
  "/:id",
  validateParams(IdParamSchema, "Pengguna tidak ditemukan."),
  usersController.getUserById
);

export default router;
