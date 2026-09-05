/**
 * File: src/validators/users.validator.js
 * Skema validasi untuk entitas pengguna menggunakan Zod.
 */
import { z } from "zod";

export const UserRegistrationSchema = z.object({
  name: z.string().min(3, "Nama harus memiliki minimal 3 karakter."),
  email: z.string().email("Format email tidak valid."),
  password: z.string().min(6, "Kata sandi minimal 6 karakter."),
  role: z.string(),
});
