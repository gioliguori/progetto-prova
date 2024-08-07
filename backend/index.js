const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;

// Middleware per gestire le richieste CORS
app.use(cors());
app.use(bodyParser.json());

// Importa i router
const bikesRoutes = require("./routes/bikes-routes");
const authRoutes = require("./routes/auth-routes");
const adminDashboardRoutes = require("./routes/admin-dashboard-routes");
const userRoutes = require("./routes/user-routes");
const partnerRoutes = require("./routes/partner-routes");
const gpsRoutes = require("./routes/gps-routes");
const rentalRoutes = require("./routes/rental-routes");

// Utilizza i router
app.use("/api/bikes", bikesRoutes);
app.use(authRoutes);
app.use("/api/admin", adminDashboardRoutes);
app.use("/api/user", userRoutes);
app.use("/api/gps", gpsRoutes);
app.use("/api/partners", partnerRoutes);
app.use("/api/rental", rentalRoutes);

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
