const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

// Importar rutas
const jornadasRoutes = require("./routes/jornadas");
const catalogsRoutes = require("./routes/catalogs");
const registroRoutes = require("./routes/registro");
const loginRoutes = require("./routes/login");
const concursosRoutes = require("./routes/concursos");
const clubsRoutes = require("./routes/clubs");
const pescadoresRoutes = require("./routes/pescadores");
const administradoresRoutes = require("./routes/administradores");
const cookiesRoutes = require("./routes/cookies-backend");

app.use(cors());
app.use(express.json());

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, "..", "frontend")));

// Registrar rutas
app.use("/api/jornadas", jornadasRoutes);
app.use("/api/catalogs", catalogsRoutes);
app.use("/api", registroRoutes);
app.use("/api", loginRoutes);
app.use("/api/concursos", concursosRoutes);
app.use("/api/clubs", clubsRoutes);
app.use("/api/pescadores", pescadoresRoutes);
app.use("/api/administradores", administradoresRoutes);
app.use("/api", cookiesRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "API Pesca Deportiva funcionando" });
});

// ============================================
// WEBHOOK DE GITHUB - Actualización automática
// ============================================
app.post("/github-webhook", (req, res) => {
  console.log("📥 Webhook recibido de GitHub");
  res.status(200).send("OK");
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
