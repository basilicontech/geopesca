// routes/cookies-backend.js
const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

// Ruta al archivo donde guardaremos los consentimientos (en la carpeta backend)
const CONSENTIMIENTOS_FILE = path.join(__dirname, "../consentimientos.json");

// Asegurar que el archivo existe
if (!fs.existsSync(CONSENTIMIENTOS_FILE)) {
  fs.writeFileSync(CONSENTIMIENTOS_FILE, "[]", "utf8");
}

// Endpoint para guardar el consentimiento
router.post("/registrar-consentimiento", (req, res) => {
  try {
    const { tipo, configuracion, fecha, userAgent, url, version } = req.body;

    // Obtener IP del cliente
    const ip =
      req.ip || req.connection.remoteAddress || req.socket.remoteAddress;

    // Crear registro
    const registro = {
      ip: ip,
      tipo: tipo, // 'all', 'reject', 'partial'
      configuracion: configuracion || null,
      fecha: fecha || new Date().toISOString(),
      userAgent: userAgent || "unknown",
      url: url || "unknown",
      version: version || "1.0",
    };

    // Leer archivo existente
    const data = fs.readFileSync(CONSENTIMIENTOS_FILE, "utf8");
    const consentimientos = JSON.parse(data);

    // ===== DEDUPLICACIÓN (defensa en profundidad) =====
    // Si el último registro tiene la misma IP, mismo tipo y misma configuración,
    // y ocurrió en los últimos 60 segundos, no lo guardamos de nuevo.
    const ultimo = consentimientos[consentimientos.length - 1];
    if (ultimo) {
      const mismoIp = ultimo.ip === registro.ip;
      const mismoTipo = ultimo.tipo === registro.tipo;
      const mismaConfig =
        JSON.stringify(ultimo.configuracion) ===
        JSON.stringify(registro.configuracion);

      const ahora = new Date(registro.fecha).getTime();
      const antes = new Date(ultimo.fecha).getTime();
      const segundos = (ahora - antes) / 1000;

      if (mismoIp && mismoTipo && mismaConfig && segundos < 60) {
        console.log(`⏭️ Consentimiento duplicado ignorado (${tipo}, IP ${ip})`);
        return res.status(200).json({
          ok: true,
          mensaje: "Consentimiento duplicado, ignorado",
        });
      }
    }

    // Añadir nuevo registro
    consentimientos.push(registro);

    // Guardar archivo
    fs.writeFileSync(
      CONSENTIMIENTOS_FILE,
      JSON.stringify(consentimientos, null, 2),
      "utf8",
    );

    console.log(`✅ Consentimiento guardado: ${tipo} desde IP ${ip}`);

    res
      .status(200)
      .json({ ok: true, mensaje: "Consentimiento guardado correctamente" });
  } catch (error) {
    console.error("❌ Error guardando consentimiento:", error);
    res.status(500).json({ ok: false, error: "Error interno al guardar" });
  }
});

module.exports = router;
