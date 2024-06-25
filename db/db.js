require("dotenv").config();

const db = require("knex")({
  client: "mysql",
  connection: {
    host: process.env.DB_URL,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {
      rejectUnauthorized: process.env.DB_SSL,
    },
  },
});

module.exports = db;
