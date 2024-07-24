const express = require("express");
const router = express.Router(); // Usa router invece di app
const knex = require("../knexfile");

// Route per ottenere i noleggi di un utente
router.get("/admin/user-rentals/:userId", async (req, res) => {
  const userId = req.params.userId;
  console.log("Richiesta noleggi per l'utente:", userId);

  try {
    const rentals = await knex("rentals")
      .join("bikes", "rentals.bike_id", "bikes.bike_id")
      .join("users", "rentals.user_id", "users.user_id")
      .where("rentals.user_id", userId)
      .select(
        "rentals.rental_id",
        "bikes.bike_type",
        "rentals.rental_type",
        "rentals.rental_start",
        "rentals.rental_end",
        "rentals.amount"
      );

    res.json({
      success: true,
      rentals,
    });
  } catch (error) {
    console.error("Errore durante l'esecuzione della query:", error);
    res.status(500).send("Errore del server");
  }
});

// Route per ottenere le bici disponibili di un partner specifico
router.post("/api/user/bikes", async (req, res) => {
  const { partnerId } = req.body;
  console.log("Richiesta dati bici disponibili per partner:", partnerId);

  try {
    const bikes = await knex("bikes")
      .where("bikes.partner_id", partnerId)
      .andWhere("bikes.is_deleted", false)
      .andWhere("bikes.state", "disponibile")
      .select(
        "bikes.bike_id",
        "bikes.bike_type",
        "bikes.state",
        "bikes.battery_level",
        "bikes.count_run"
      );

    res.json({
      success: true,
      bikes,
    });
  } catch (error) {
    console.error("Errore durante l'esecuzione della query:", error);
    res.status(500).send("Errore del server");
  }
});

// Funzione per creare un nuovo utente
router.post("/api/user/register", async (req, res) => {
  const { username, email, firstName, lastName, password } = req.body;
  console.log("Tentativo di registrazione con:", {
    username,
    email,
    firstName,
    lastName,
  });

  try {
    // Controlla se l'username o l'email sono già presenti nel database
    const existingUser = await knex("users")
      .where("username", username)
      .orWhere("email", email)
      .first();

    if (existingUser) {
      return res.json({
        success: false,
        message: "Username o email già presenti.",
      });
    }

    // Inserisce il nuovo utente nel database
    await knex("users").insert({
      username,
      email,
      first_name: firstName,
      last_name: lastName,
      password, // Salva la password come testo in chiaro
    });

    res.json({
      success: true,
      message: "Registrazione completata con successo!",
    });
  } catch (error) {
    console.error("Errore durante l'inserimento dell'utente:", error);
    res.status(500).json({
      success: false,
      message: "Errore del server durante la registrazione.",
    });
  }
});

module.exports = router; // Esporta il router
