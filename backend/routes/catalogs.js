const express = require("express");
const router = express.Router();
const pool = require("../db/connection");

// Obtener todos los pescadores
router.get("/pescadores", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id_pescador, nombre_pescador, email_pescador FROM pescador ORDER BY nombre_pescador",
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener todos los clubs
router.get("/clubs", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id_club, nombre_club, email_contacto FROM clubs ORDER BY nombre_club",
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener todas las especies
router.get("/especies", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT e.id_especie, e.nombre_especie, f.nombre_familia, g.nombre_genero
      FROM especie e
      LEFT JOIN familia f ON f.id_familia = e.id_familia
      LEFT JOIN genero g ON g.id_genero = e.id_genero
      ORDER BY e.nombre_especie
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Catálogos
router.get("/habitats", async (req, res) => {
  const result = await pool.query(
    "SELECT id_habitat, tipo_habitat FROM habitat ORDER BY id_habitat",
  );
  res.json(result.rows);
});

router.get("/tipos-lecho", async (req, res) => {
  const result = await pool.query(
    "SELECT id_tipo_lecho, nombre_lecho FROM tipo_lecho ORDER BY id_tipo_lecho",
  );
  res.json(result.rows);
});

router.get("/direcciones-viento", async (req, res) => {
  const result = await pool.query(
    "SELECT id_direccion_viento, direccion_viento FROM direccion_viento ORDER BY id_direccion_viento",
  );
  res.json(result.rows);
});

router.get("/velocidades-viento", async (req, res) => {
  const result = await pool.query(
    "SELECT id_velocidad_viento, grado_beaufort, denominacion FROM velocidad_viento ORDER BY grado_beaufort",
  );
  res.json(result.rows);
});

router.get("/alturas-olas", async (req, res) => {
  const result = await pool.query(
    "SELECT id_altura_olas, grado_wmo, descripcion FROM altura_olas ORDER BY grado_wmo",
  );
  res.json(result.rows);
});

router.get("/turbideces", async (req, res) => {
  const result = await pool.query(
    "SELECT id_turbidez, tipo_turbidez FROM turbidez ORDER BY id_turbidez",
  );
  res.json(result.rows);
});

router.get("/tiempos-atmosfericos", async (req, res) => {
  const result = await pool.query(
    "SELECT id_tiempo_atmosferico, tipo_tiempo_atmosferico FROM tiempo_atmosferico ORDER BY id_tiempo_atmosferico",
  );
  res.json(result.rows);
});

router.get("/tipos-pesca", async (req, res) => {
  const result = await pool.query(
    "SELECT id_tipo_pesca, tipo_pesca FROM tipo_pesca ORDER BY id_tipo_pesca",
  );
  res.json(result.rows);
});

router.get("/cebos-naturales", async (req, res) => {
  const result = await pool.query(
    "SELECT id_cebo_natural, tipo_cebo_natural FROM cebo_natural ORDER BY id_cebo_natural",
  );
  res.json(result.rows);
});

router.get("/cebos-artificiales", async (req, res) => {
  const result = await pool.query(
    "SELECT id_cebo_artificial, tipo_cebo_artificial FROM cebo_artificial ORDER BY id_cebo_artificial",
  );
  res.json(result.rows);
});

module.exports = router;
