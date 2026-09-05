/**
 * File: src/middlewares/validation.middleware.js
 * Middleware untuk memvalidasi request body menggunakan skema Zod.
 */
import InvariantError from "../exceptions/invariant.error.js";

export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    // Mengambil pesan error pertama dari Zod
    const errorMessage = result.error.issues[0].message;
    return next(new InvariantError(errorMessage));
  }

  // Jika validasi sukses, perbarui req.body dengan data yang sudah di-parse (dan di-strip jika ada)
  req.body = result.data;
  next();
};
