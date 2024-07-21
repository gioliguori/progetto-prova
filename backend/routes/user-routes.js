// Route per ottenere i noleggi di un utente
app.get("/api/admin/user-rentals/:userId", async (req, res) => {
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