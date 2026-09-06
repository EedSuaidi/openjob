/**
 * File: src/middlewares/error.middleware.js
 * Middleware global untuk menangani eksepsi dan mengembalikan respons HTTP yang terstruktur.
 */
import ClientError from "../exceptions/client.error.js";

export const errorHandler = (err, req, res, next) => {
  // Jika error merupakan instansiasi dari ClientError, kembalikan status dan pesan terkait
  if (err instanceof ClientError) {
    return res.status(err.statusCode).json({
      status: "failed",
      message: err.message,
    });
  }

  // Menangani Server Error (500)
  console.error(err);
  return res.status(500).json({
    status: "error",
    message: "Terjadi kegagalan pada server.",
  });
};
