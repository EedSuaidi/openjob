/**
 * File: src/controllers/users.controller.js
 * Pengendali untuk menangani permintaan terkait entitas pengguna.
 */
import * as usersService from "../services/users.service.js";
import NotFoundError from "../exceptions/not-found.error.js";

export const registerUser = async (req, res, next) => {
  try {
    const userId = await usersService.createUser(req.body);

    res.status(201).json({
      status: "success",
      message: "Pengguna berhasil didaftarkan.",
      data: {
        id: String(userId),
      },
    });
  } catch (error) {
    // Melempar error ke global error handler middleware
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (
      !Number.isInteger(Number(id)) ||
      Number(id) <= 0 ||
      Number(id) > 2147483647
    ) {
      throw new NotFoundError("Pengguna tidak ditemukan.");
    }

    const user = await usersService.getUserById(id);

    if (!user) {
      throw new NotFoundError("Pengguna tidak ditemukan.");
    }

    res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
