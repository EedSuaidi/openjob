/** @type {import('node-pg-migrate').ColumnDefinitions | undefined} */
export const shorthands = undefined;

export const up = (pgm) => {
  pgm.addColumn("companies", {
    owner_id: {
      type: "integer",
      references: '"users"',
      onDelete: "RESTRICT",
    },
  });
};

export const down = (pgm) => {
  pgm.dropColumn("companies", "owner_id");
};
