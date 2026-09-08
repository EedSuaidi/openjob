/** @type {import('node-pg-migrate').ColumnDefinitions | undefined} */
export const shorthands = undefined;

export const up = (pgm) => {
  pgm.createTable("documents", {
    id: "id",
    user_id: { type: "integer", notNull: true, references: '"users"', onDelete: "CASCADE" },
    filename: { type: "varchar(255)", notNull: true, unique: true },
    original_name: { type: "varchar(255)", notNull: true },
    mime_type: { type: "varchar(100)", notNull: true },
    size: { type: "integer", notNull: true },
    created_at: { type: "timestamp", notNull: true, default: pgm.func("current_timestamp") },
  });
};

export const down = (pgm) => { pgm.dropTable("documents"); };
