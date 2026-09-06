/**
 * File: src/services/applications.service.js
 * Layanan untuk mengelola operasi basis data entitas lamaran pekerjaan.
 */
import pool from "../config/database.config.js";
import NotFoundError from "../exceptions/not-found.error.js";
import InvariantError from "../exceptions/invariant.error.js";
import { parsePgIntId } from "../validators/params.validator.js";

export const createApplication = async (userId, jobId) => {
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
  const query = {
    text: "SELECT id, user_id, job_id, status, created_at FROM applications WHERE id = $1",
    values: [id],
  };

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
};

export const getApplicationsByUser = async (userId) => {
  const parsedUserId = parsePgIntId(userId);
  if (parsedUserId === null) {
    return [];
  }

  const query = {
    text: "SELECT id, user_id, job_id, status, created_at FROM applications WHERE user_id = $1 ORDER BY created_at DESC",
    values: [parsedUserId],
  };

  const result = await pool.query(query);
  return result.rows.map((row) => ({
    ...row,
    id: String(row.id),
    user_id: String(row.user_id),
    job_id: String(row.job_id),
  }));
};

export const getApplicationsByJob = async (jobId) => {
  const parsedJobId = parsePgIntId(jobId);
  if (parsedJobId === null) {
    return [];
  }

  const query = {
    text: "SELECT id, user_id, job_id, status, created_at FROM applications WHERE job_id = $1 ORDER BY created_at DESC",
    values: [parsedJobId],
  };

  const result = await pool.query(query);
  return result.rows.map((row) => ({
    ...row,
    id: String(row.id),
    user_id: String(row.user_id),
    job_id: String(row.job_id),
  }));
};

export const updateApplicationStatus = async (id, status) => {
  const query = {
    text: "UPDATE applications SET status = $1 WHERE id = $2 RETURNING id",
    values: [status, id],
  };

  const result = await pool.query(query);
  if (result.rowCount === 0) {
    throw new NotFoundError("Gagal memperbarui. Lamaran tidak ditemukan.");
  }
};

export const deleteApplication = async (id) => {
  const query = {
    text: "DELETE FROM applications WHERE id = $1 RETURNING id",
    values: [id],
  };

  const result = await pool.query(query);
  if (result.rowCount === 0) {
    throw new NotFoundError("Gagal menghapus. Lamaran tidak ditemukan.");
  }
};
