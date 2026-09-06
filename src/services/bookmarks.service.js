/**
 * File: src/services/bookmarks.service.js
 * Layanan untuk mengelola markah (bookmark) pekerjaan oleh pengguna.
 */
import pool from "../config/database.config.js";
import NotFoundError from "../exceptions/not-found.error.js";
import InvariantError from "../exceptions/invariant.error.js";

export const createBookmark = async (userId, jobId) => {
  const checkQuery = {
    text: "SELECT id FROM bookmarks WHERE user_id = $1 AND job_id = $2",
    values: [userId, jobId],
  };
  const checkResult = await pool.query(checkQuery);
  if (checkResult.rowCount > 0) {
    throw new InvariantError("Pekerjaan ini sudah Anda simpan.");
  }

  const query = {
    text: "INSERT INTO bookmarks(user_id, job_id) VALUES($1, $2) RETURNING id",
    values: [userId, jobId],
  };
  const result = await pool.query(query);
  return result.rows[0].id;
};

export const getBookmarkDetail = async (id) => {
  const query = {
    text: "SELECT id, user_id, job_id, created_at FROM bookmarks WHERE id = $1",
    values: [id],
  };

  const result = await pool.query(query);
  if (result.rowCount === 0) {
    throw new NotFoundError("Data simpanan tidak ditemukan.");
  }

  const row = result.rows[0];
  return {
    ...row,
    id: String(row.id),
    user_id: String(row.user_id),
    job_id: String(row.job_id),
  };
};

export const deleteBookmark = async (userId, jobId) => {
  const query = {
    text: "DELETE FROM bookmarks WHERE user_id = $1 AND job_id = $2 RETURNING id",
    values: [userId, jobId],
  };

  const result = await pool.query(query);
  if (result.rowCount === 0) {
    throw new NotFoundError("Gagal menghapus. Data simpanan tidak ditemukan.");
  }
};

export const getAllBookmarks = async (userId) => {
  const query = {
    text: `
      SELECT b.id, b.job_id, j.title AS job_title, c.name AS company_name, b.created_at
      FROM bookmarks b
      JOIN jobs j ON b.job_id = j.id
      JOIN companies c ON j.company_id = c.id
      WHERE b.user_id = $1
      ORDER BY b.created_at DESC
    `,
    values: [userId],
  };
  const result = await pool.query(query);
  return result.rows.map((row) => ({
    ...row,
    id: String(row.id),
    job_id: String(row.job_id),
  }));
};

export const getBookmarkById = getBookmarkDetail;
