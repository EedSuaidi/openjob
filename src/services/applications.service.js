/**
 * File: src/services/applications.service.js
 * Layanan untuk mengelola operasi basis data entitas lamaran pekerjaan.
 */
import pool from "../config/database.config.js";
import NotFoundError from "../exceptions/not-found.error.js";
import InvariantError from "../exceptions/invariant.error.js";

export const createApplication = async (userId, jobId) => {
  // Verifikasi agar pengguna tidak melamar pekerjaan yang sama dua kali
  const checkQuery = {
    text: "SELECT id FROM applications WHERE user_id = $1 AND job_id = $2",
    values: [userId, jobId],
  };
  const checkResult = await pool.query(checkQuery);
  if (checkResult.rowCount > 0) {
    throw new InvariantError("Anda sudah melamar pekerjaan ini sebelumnya.");
  }

  const query = {
    text: "INSERT INTO applications(user_id, job_id) VALUES($1, $2) RETURNING id",
    values: [userId, jobId],
  };
  const result = await pool.query(query);
  return result.rows[0].id;
};

export const getApplications = async () => {
  const result = await pool.query(
    "SELECT id, user_id, job_id, status, created_at FROM applications ORDER BY created_at DESC"
  );
  return result.rows.map((row) => ({
    ...row,
    id: String(row.id),
    user_id: String(row.user_id),
    job_id: String(row.job_id),
  }));
};

export const getApplicationById = async (id) => {
  if (
    !Number.isInteger(Number(id)) ||
    Number(id) <= 0 ||
    Number(id) > 2147483647
  ) {
    throw new NotFoundError("Lamaran tidak ditemukan.");
  }

  const query = {
    text: "SELECT id, user_id, job_id, status, created_at FROM applications WHERE id = $1",
    values: [id],
  };

  try {
    const result = await pool.query(query);
    if (result.rowCount === 0) {
      throw new NotFoundError("Lamaran tidak ditemukan.");
    }
    const row = result.rows[0];
    return {
      ...row,
      id: String(row.id),
      user_id: String(row.user_id),
      job_id: String(row.job_id),
    };
  } catch (error) {
    if (error.code === "22P02" || error.code === "22003") {
      throw new NotFoundError("Lamaran tidak ditemukan.");
    }
    throw error;
  }
};

export const getApplicationsByUser = async (userId) => {
  const query = {
    text: "SELECT id, job_id, status, created_at FROM applications WHERE user_id = $1 ORDER BY created_at DESC",
    values: [userId],
  };
  const result = await pool.query(query);
  return result.rows.map((row) => ({
    ...row,
    id: String(row.id),
    job_id: String(row.job_id),
  }));
};

export const getApplicationsByJob = async (jobId) => {
  const query = {
    text: "SELECT id, user_id, status, created_at FROM applications WHERE job_id = $1 ORDER BY created_at DESC",
    values: [jobId],
  };
  const result = await pool.query(query);
  return result.rows.map((row) => ({
    ...row,
    id: String(row.id),
    user_id: String(row.user_id),
  }));
};

export const updateApplicationStatus = async (id, status) => {
  if (
    !Number.isInteger(Number(id)) ||
    Number(id) <= 0 ||
    Number(id) > 2147483647
  ) {
    throw new NotFoundError("Gagal memperbarui. Lamaran tidak ditemukan.");
  }

  const query = {
    text: "UPDATE applications SET status = $1 WHERE id = $2 RETURNING id",
    values: [status, id],
  };

  try {
    const result = await pool.query(query);
    if (result.rowCount === 0) {
      throw new NotFoundError("Gagal memperbarui. Lamaran tidak ditemukan.");
    }
  } catch (error) {
    if (error.code === "22P02" || error.code === "22003") {
      throw new NotFoundError("Gagal memperbarui. Lamaran tidak ditemukan.");
    }
    throw error;
  }
};

export const deleteApplication = async (id) => {
  if (
    !Number.isInteger(Number(id)) ||
    Number(id) <= 0 ||
    Number(id) > 2147483647
  ) {
    throw new NotFoundError("Gagal menghapus. Lamaran tidak ditemukan.");
  }

  const query = {
    text: "DELETE FROM applications WHERE id = $1 RETURNING id",
    values: [id],
  };

  try {
    const result = await pool.query(query);
    if (result.rowCount === 0) {
      throw new NotFoundError("Gagal menghapus. Lamaran tidak ditemukan.");
    }
  } catch (error) {
    if (error.code === "22P02" || error.code === "22003") {
      throw new NotFoundError("Gagal menghapus. Lamaran tidak ditemukan.");
    }
    throw error;
  }
};
