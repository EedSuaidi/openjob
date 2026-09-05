/**
 * File: src/services/categories.service.js
 * Layanan untuk mengelola operasi basis data entitas kategori (CRUD).
 */
import pool from "../config/database.config.js";
import NotFoundError from "../exceptions/not-found.error.js";

export const createCategory = async ({ name }) => {
  const query = {
    text: "INSERT INTO categories(name) VALUES($1) RETURNING id",
    values: [name],
  };
  const result = await pool.query(query);
  return result.rows[0].id;
};

export const getCategories = async () => {
  const result = await pool.query("SELECT id, name FROM categories");
  return result.rows.map((cat) => ({
    ...cat,
    id: String(cat.id),
  }));
};

export const getCategoryById = async (id) => {
  if (
    !Number.isInteger(Number(id)) ||
    Number(id) <= 0 ||
    Number(id) > 2147483647
  ) {
    throw new NotFoundError("Kategori tidak ditemukan.");
  }

  const query = {
    text: "SELECT id, name FROM categories WHERE id = $1",
    values: [id],
  };

  try {
    const result = await pool.query(query);

    if (result.rowCount === 0) {
      throw new NotFoundError("Kategori tidak ditemukan.");
    }
    return {
      ...result.rows[0],
      id: String(result.rows[0].id),
    };
  } catch (error) {
    if (error.code === "22P02" || error.code === "22003") {
      throw new NotFoundError("Kategori tidak ditemukan.");
    }
    throw error;
  }
};

export const updateCategory = async (id, { name }) => {
  if (
    !Number.isInteger(Number(id)) ||
    Number(id) <= 0 ||
    Number(id) > 2147483647
  ) {
    throw new NotFoundError("Gagal memperbarui. Kategori tidak ditemukan.");
  }

  const query = {
    text: "UPDATE categories SET name = $1 WHERE id = $2 RETURNING id",
    values: [name, id],
  };

  try {
    const result = await pool.query(query);

    if (result.rowCount === 0) {
      throw new NotFoundError("Gagal memperbarui. Kategori tidak ditemukan.");
    }
  } catch (error) {
    if (error.code === "22P02" || error.code === "22003") {
      throw new NotFoundError("Gagal memperbarui. Kategori tidak ditemukan.");
    }
    throw error;
  }
};

export const deleteCategory = async (id) => {
  if (
    !Number.isInteger(Number(id)) ||
    Number(id) <= 0 ||
    Number(id) > 2147483647
  ) {
    throw new NotFoundError("Gagal menghapus. Kategori tidak ditemukan.");
  }

  const query = {
    text: "DELETE FROM categories WHERE id = $1 RETURNING id",
    values: [id],
  };

  try {
    const result = await pool.query(query);

    if (result.rowCount === 0) {
      throw new NotFoundError("Gagal menghapus. Kategori tidak ditemukan.");
    }
  } catch (error) {
    if (error.code === "22P02" || error.code === "22003") {
      throw new NotFoundError("Gagal menghapus. Kategori tidak ditemukan.");
    }
    throw error;
  }
};
