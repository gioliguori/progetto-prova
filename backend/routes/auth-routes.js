const express = require("express");
const router = express.Router();
const knex = require("../knexfile"); // Importa la configurazione di knex

// Login route
router.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const results = await knex("users")
      .where({ username: username, password: password })
      .select("username", "first_name", "last_name");

    if (results.length > 0) {
      res.json({ success: true, user: results[0] });
    } else {
      res.json({ success: false, message: "Invalid username or password" });
    }
  } catch (error) {
    console.error("Errore durante l'esecuzione della query: " + error.stack);
    res.status(500).send("Errore del server");
  }
});

module.exports = router;
