/**
 * File: src/services/companies.service.js
 * Layanan untuk mengelola operasi basis data entitas perusahaan (CRUD).
 */
import pool from "../config/database.config.js";
import NotFoundError from "../exceptions/not-found.error.js";

export const createCompany = async ({ name, location, description }) => {
  const query = {
    text: "INSERT INTO companies(name, location, description) VALUES($1, $2, $3) RETURNING id",
    values: [name, location, description],
  };
  const result = await pool.query(query);
  return result.rows[0].id;
};

export const getCompanies = async () => {
  const result = await pool.query(
    "SELECT id, name, location, description FROM companies"
  );
  return result.rows.map((company) => ({
    ...company,
    id: String(company.id),
  }));
};

export const getCompanyById = async (id) => {
  if (
    !Number.isInteger(Number(id)) ||
    Number(id) <= 0 ||
    Number(id) > 2147483647
  ) {
    throw new NotFoundError("Perusahaan tidak ditemukan.");
  }

  const query = {
    text: "SELECT id, name, location, description FROM companies WHERE id = $1",
    values: [id],
  };

  try {
    const result = await pool.query(query);

    if (result.rowCount === 0) {
      throw new NotFoundError("Perusahaan tidak ditemukan.");
    }
    return {
      ...result.rows[0],
      id: String(result.rows[0].id),
    };
  } catch (error) {
    if (error.code === "22P02" || error.code === "22003") {
      throw new NotFoundError("Perusahaan tidak ditemukan.");
    }
    throw error;
  }
};

export const updateCompany = async (id, { name, location, description }) => {
  if (
    !Number.isInteger(Number(id)) ||
    Number(id) <= 0 ||
    Number(id) > 2147483647
  ) {
    throw new NotFoundError("Gagal memperbarui. Perusahaan tidak ditemukan.");
  }

  const query = {
    text: "UPDATE companies SET name = $1, location = $2, description = $3 WHERE id = $4 RETURNING id",
    values: [name, location, description, id],
  };

  try {
    const result = await pool.query(query);

    if (result.rowCount === 0) {
      throw new NotFoundError("Gagal memperbarui. Perusahaan tidak ditemukan.");
    }
  } catch (error) {
    if (error.code === "22P02" || error.code === "22003") {
      throw new NotFoundError("Gagal memperbarui. Perusahaan tidak ditemukan.");
    }
    throw error;
  }
};

export const deleteCompany = async (id) => {
  if (
    !Number.isInteger(Number(id)) ||
    Number(id) <= 0 ||
    Number(id) > 2147483647
  ) {
    throw new NotFoundError("Gagal menghapus. Perusahaan tidak ditemukan.");
  }

  const query = {
    text: "DELETE FROM companies WHERE id = $1 RETURNING id",
    values: [id],
  };

  try {
    const result = await pool.query(query);

    if (result.rowCount === 0) {
      throw new NotFoundError("Gagal menghapus. Perusahaan tidak ditemukan.");
    }
  } catch (error) {
    if (error.code === "22P02" || error.code === "22003") {
      throw new NotFoundError("Gagal menghapus. Perusahaan tidak ditemukan.");
    }
    throw error;
  }
};
