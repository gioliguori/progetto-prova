const knex = require("knex")({
  client: "mysql",
  connection: {
    host: "localhost",
    user: "user",
    password: "password",
    database: "databaseV1",
  },
});

knex
  .raw("SELECT 1")
  .then(() => {
    console.log("Database connection successful");
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });

module.exports = knex;
