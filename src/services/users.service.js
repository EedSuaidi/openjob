/**
 * File: src/services/users.service.js
 * Layanan untuk mengelola logika bisnis entitas pengguna.
 */
import pool from "../config/database.config.js";
import InvariantError from "../exceptions/invariant.error.js";
import NotFoundError from "../exceptions/not-found.error.js";
import { hashPassword } from "../utils/hash.util.js";

export const verifyNewEmail = async (email) => {
  const query = "SELECT email FROM users WHERE email = $1";
  const result = await pool.query(query, [email]);

  if (result.rowCount > 0) {
    throw new InvariantError(
      "Gagal menambahkan pengguna. Surel sudah digunakan."
    );
  }
};

export const createUser = async ({ name, email, password }) => {
  await verifyNewEmail(email);

  const hashedPassword = await hashPassword(password);

  const query = {
    text: "INSERT INTO users(name, email, password) VALUES($1, $2, $3) RETURNING id",
    values: [name, email, hashedPassword],
  };

  const result = await pool.query(query);
  return result.rows[0].id;
};

export const getUserById = async (id) => {
  if (
    !Number.isInteger(Number(id)) ||
    Number(id) <= 0 ||
    Number(id) > 2147483647
  ) {
    throw new NotFoundError("Pengguna tidak ditemukan.");
  }

  const query = {
    text: "SELECT id, name, email FROM users WHERE id = $1",
    values: [id],
  };

  try {
    const result = await pool.query(query);

    if (result.rowCount === 0) {
      throw new NotFoundError("Pengguna tidak ditemukan.");
    }

    return {
      ...result.rows[0],
      id: String(result.rows[0].id),
    };
  } catch (error) {
    if (error.code === "22P02" || error.code === "22003") {
      throw new NotFoundError("Pengguna tidak ditemukan.");
    }
    throw error;
  }
};
