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

export const createUser = async ({ name, email, password, role }) => {
  await verifyNewEmail(email);

  const hashedPassword = await hashPassword(password);

  const query = {
    text: "INSERT INTO users(name, email, password, role) VALUES($1, $2, $3, $4) RETURNING id",
    values: [name, email, hashedPassword, role],
  };

  const result = await pool.query(query);
  return result.rows[0].id;
};

export const getUserById = async (id) => {
  const query = {
    text: "SELECT id, name, email, role FROM users WHERE id = $1",
    values: [id],
  };

  const result = await pool.query(query);

  if (result.rowCount === 0) {
    throw new NotFoundError("Pengguna tidak ditemukan.");
  }

  return {
    ...result.rows[0],
    id: String(result.rows[0].id),
  };
};
