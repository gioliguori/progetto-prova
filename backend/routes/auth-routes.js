const express = require("express");
const router = express.Router();
const knex = require("../knexfile"); // Importa la configurazione di knex

// Login route per utenti generici (users)
router.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  console.log("Ricevuta richiesta di login per l'utente:", username);

  try {
    const results = await knex("users")
      .where({ username: username, password: password })
      .select("username", "first_name", "last_name");

    if (results.length > 0) {
      console.log("Login avvenuto con successo per l'utente:", username);
      res.json({ success: true, user: results[0] });
    } else {
      console.log("Username o password non validi per l'utente:", username);
      res.json({ success: false, message: "Invalid username or password" });
    }
  } catch (error) {
    console.error("Errore durante l'esecuzione della query:", error);
    res.status(500).send("Errore del server");
  }
});

// Login route per admin e partner
router.post("/api/login/admin-partner", async (req, res) => {
  const { username, password, role } = req.body; // Aggiunto il campo role
  console.log("Ricevuta richiesta di login per l'utente:", username);

  try {
    if (role === "admin") {
      // Login per admin
      const results = await knex("admin")
        .where({ username: username, password: password })
        .select("username");

      if (results.length > 0) {
        console.log("Login avvenuto con successo per l'admin:", username);
        // Recupera la lista dei partner
        const partners = await knex("partners").select("*");
        res.json({ success: true, user: results[0], partners });
      } else {
        console.log("Username o password non validi per l'admin:", username);
        res.json({ success: false, message: "Invalid username or password" });
      }
    } else if (role === "partner") {
      // Login per partner
      const results = await knex("partner_auth")
        .where({ username: username, password: password })
        .select("uuid as partner_id", "username");

      if (results.length > 0) {
        console.log("Login avvenuto con successo per il partner:", username);
        res.json({ success: true, user: results[0] });
      } else {
        console.log("Username o password non validi per il partner:", username);
        res.json({ success: false, message: "Invalid username or password" });
      }
    } else {
      console.log("Ruolo non valido fornito:", role);
      res.json({ success: false, message: "Invalid role provided" });
    }
  } catch (error) {
    console.error("Errore durante l'esecuzione della query:", error);
    res.status(500).send("Errore del server");
  }
});

module.exports = router;
