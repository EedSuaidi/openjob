/**
 * File: src/server.js
 * Titik masuk utama untuk menjalankan server HTTP Express.
 */
import dotenv from "dotenv";
import app from "./app.js";

dotenv.config();

const host = process.env.HOST || "localhost";
const port = process.env.PORT || 5000;

app.listen(port, host, () => {
  console.log(`🚀 Server berjalan pada http://${host}:${port}`);
});
