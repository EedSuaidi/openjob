/**
 * File: src/services/profile.service.js
 * Layanan untuk mengambil data profil, lamaran, dan markah (bookmark) milik pengguna yang sedang masuk.
 */
import pool from "../config/database.config.js";
import NotFoundError from "../exceptions/not-found.error.js";

export const getUserProfile = async (userId) => {
  const query = {
    text: "SELECT id, name, email, created_at FROM users WHERE id = $1",
    values: [userId],
  };

  const result = await pool.query(query);

  if (result.rowCount === 0) {
    throw new NotFoundError("Profil pengguna tidak ditemukan.");
  }

  return {
    ...result.rows[0],
    id: String(result.rows[0].id),
  };
};

export const getUserApplications = async (userId) => {
  const query = {
    text: `
      SELECT a.id, a.status, a.created_at AS applied_at, 
             j.id AS job_id, j.title AS job_title, 
             c.name AS company_name
      FROM applications a
      JOIN jobs j ON a.job_id = j.id
      JOIN companies c ON j.company_id = c.id
      WHERE a.user_id = $1
      ORDER BY a.created_at DESC
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

export const getUserBookmarks = async (userId) => {
  const query = {
    text: `
      SELECT b.id, b.created_at AS bookmarked_at, 
             j.id AS job_id, j.title AS job_title, 
             c.name AS company_name
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
