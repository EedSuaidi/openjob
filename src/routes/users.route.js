/**
 * File: src/routes/users.route.js
 * Rute untuk mengakses fungsionalitas entitas pengguna.
 */
import { Router } from "express";
import * as usersController from "../controllers/users.controller.js";
import { validate } from "../middlewares/validation.middleware.js";
import { UserRegistrationSchema } from "../validators/users.validator.js";

const router = Router();

// Endpoint POST /users (Register) diproteksi dengan validasi Zod
router.post(
  "/",
  validate(UserRegistrationSchema),
  usersController.registerUser
);

// Endpoint GET /users/:id (Public Profile)
router.get("/:id", usersController.getUserById);

export default router;
