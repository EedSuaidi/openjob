/**
 * File: src/controllers/users.controller.js
 * Pengendali untuk menangani permintaan terkait entitas pengguna.
 */
import * as usersService from "../services/users.service.js";

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
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const user = await usersService.getUserById(req.params.id);

    res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
