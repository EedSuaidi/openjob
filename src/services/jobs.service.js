/**
 * File: src/services/jobs.service.js
 * Layanan untuk mengelola operasi basis data entitas pekerjaan (CRUD dan Pencarian).
 */
import pool from "../config/database.config.js";
import NotFoundError from "../exceptions/not-found.error.js";

export const createJob = async ({
  title,
  description,
  company_id,
  category_id,
}) => {
  const query = {
    text: "INSERT INTO jobs(title, description, company_id, category_id) VALUES($1, $2, $3, $4) RETURNING id",
    values: [title, description, company_id, category_id],
  };
  const result = await pool.query(query);
  return result.rows[0].id;
};

export const getJobs = async (title, companyName) => {
  // Query dasar dengan JOIN ke tabel companies dan categories
  let text = `
    SELECT j.id, j.title, j.description, j.created_at, 
           c.name AS company_name, cat.name AS category_name
    FROM jobs j
    JOIN companies c ON j.company_id = c.id
    JOIN categories cat ON j.category_id = cat.id
    WHERE 1=1
  `;
  const values = [];
  let parameterIndex = 1;

  // Menambahkan kondisi pencarian jika query parameter ?title diberikan (Mencapai Kriteria Advanced)
  if (title) {
    text += ` AND j.title ILIKE $${parameterIndex}`;
    values.push(`%${title}%`);
    parameterIndex++;
  }

  // Menambahkan kondisi pencarian jika query parameter ?company-name diberikan (Mencapai Kriteria Advanced)
  if (companyName) {
    text += ` AND c.name ILIKE $${parameterIndex}`;
    values.push(`%${companyName}%`);
    parameterIndex++;
  }

  text += " ORDER BY j.created_at DESC";

  const result = await pool.query({ text, values });
  return result.rows.map((row) => ({
    ...row,
    id: String(row.id),
  }));
};

export const getJobById = async (id) => {
  if (
    !Number.isInteger(Number(id)) ||
    Number(id) <= 0 ||
    Number(id) > 2147483647
  ) {
    throw new NotFoundError("Pekerjaan tidak ditemukan.");
  }

  const query = {
    text: `
      SELECT j.id, j.title, j.description, j.created_at, 
             c.id AS company_id, c.name AS company_name, 
             cat.id AS category_id, cat.name AS category_name
      FROM jobs j
      JOIN companies c ON j.company_id = c.id
      JOIN categories cat ON j.category_id = cat.id
      WHERE j.id = $1
    `,
    values: [id],
  };

  try {
    const result = await pool.query(query);

    if (result.rowCount === 0) {
      throw new NotFoundError("Pekerjaan tidak ditemukan.");
    }
    const row = result.rows[0];
    return {
      ...row,
      id: String(row.id),
      company_id: String(row.company_id),
      category_id: String(row.category_id),
    };
  } catch (error) {
    if (error.code === "22P02" || error.code === "22003") {
      throw new NotFoundError("Pekerjaan tidak ditemukan.");
    }
    throw error;
  }
};

export const getJobsByCompany = async (companyId) => {
  if (
    !Number.isInteger(Number(companyId)) ||
    Number(companyId) <= 0 ||
    Number(companyId) > 2147483647
  ) {
    return [];
  }

  const query = {
    text: "SELECT id, title, company_id, category_id, created_at FROM jobs WHERE company_id = $1 ORDER BY created_at DESC",
    values: [companyId],
  };

  try {
    const result = await pool.query(query);
    return result.rows.map((row) => ({
      ...row,
      id: String(row.id),
      company_id: String(row.company_id),
      category_id: String(row.category_id),
    }));
  } catch (error) {
    if (error.code === "22P02" || error.code === "22003") {
      return [];
    }
    throw error;
  }
};

export const getJobsByCategory = async (categoryId) => {
  if (
    !Number.isInteger(Number(categoryId)) ||
    Number(categoryId) <= 0 ||
    Number(categoryId) > 2147483647
  ) {
    return [];
  }

  const query = {
    text: "SELECT id, title, company_id, category_id, created_at FROM jobs WHERE category_id = $1 ORDER BY created_at DESC",
    values: [categoryId],
  };

  try {
    const result = await pool.query(query);
    return result.rows.map((row) => ({
      ...row,
      id: String(row.id),
      company_id: String(row.company_id),
      category_id: String(row.category_id),
    }));
  } catch (error) {
    if (error.code === "22P02" || error.code === "22003") {
      return [];
    }
    throw error;
  }
};

export const updateJob = async (
  id,
  { title, description, company_id, category_id }
) => {
  if (
    !Number.isInteger(Number(id)) ||
    Number(id) <= 0 ||
    Number(id) > 2147483647
  ) {
    throw new NotFoundError("Gagal memperbarui. Pekerjaan tidak ditemukan.");
  }

  const query = {
    text: "UPDATE jobs SET title = $1, description = $2, company_id = $3, category_id = $4 WHERE id = $5 RETURNING id",
    values: [title, description, company_id, category_id, id],
  };

  try {
    const result = await pool.query(query);

    if (result.rowCount === 0) {
      throw new NotFoundError("Gagal memperbarui. Pekerjaan tidak ditemukan.");
    }
  } catch (error) {
    if (error.code === "22P02" || error.code === "22003") {
      throw new NotFoundError("Gagal memperbarui. Pekerjaan tidak ditemukan.");
    }
    throw error;
  }
};

export const deleteJob = async (id) => {
  if (
    !Number.isInteger(Number(id)) ||
    Number(id) <= 0 ||
    Number(id) > 2147483647
  ) {
    throw new NotFoundError("Gagal menghapus. Pekerjaan tidak ditemukan.");
  }

  const query = {
    text: "DELETE FROM jobs WHERE id = $1 RETURNING id",
    values: [id],
  };

  try {
    const result = await pool.query(query);

    if (result.rowCount === 0) {
      throw new NotFoundError("Gagal menghapus. Pekerjaan tidak ditemukan.");
    }
  } catch (error) {
    if (error.code === "22P02" || error.code === "22003") {
      throw new NotFoundError("Gagal menghapus. Pekerjaan tidak ditemukan.");
    }
    throw error;
  }
};
