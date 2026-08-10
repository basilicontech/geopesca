const express = require("express");
const router = express.Router();
const pool = require("../db/connection");

router.get("/list", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id_administrador,
        nombre_administrador,
        email_administrador
      FROM administrador
      ORDER BY nombre_administrador ASC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error("Error listando administradores:", error);
    res.status(500).json({ error: "Error al obtener administradores" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const countResult = await pool.query(
      "SELECT COUNT(*)::int AS total FROM administrador",
    );
    if (countResult.rows[0].total <= 1) {
      return res.status(400).json({
        error: "No se puede eliminar el último administrador",
      });
    }

    const adminResult = await pool.query(
      "SELECT * FROM administrador WHERE id_administrador = $1",
      [id],
    );

    if (adminResult.rows.length === 0) {
      return res.status(404).json({ error: "Administrador no encontrado" });
    }

    const nombre = adminResult.rows[0].nombre_administrador;

    await pool.query("DELETE FROM administrador WHERE id_administrador = $1", [
      id,
    ]);

    res.json({
      message: `Administrador "${nombre}" eliminado correctamente`,
    });
  } catch (error) {
    console.error("Error eliminando administrador:", error);
    res.status(500).json({ error: "Error al eliminar administrador" });
  }
});

module.exports = router;
