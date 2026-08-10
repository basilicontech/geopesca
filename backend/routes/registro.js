// backend/routes/registro.js - Lógica de registro en el servidor

const express = require("express");
const router = express.Router();
const pool = require("../db/connection");

// Ruta de registro
router.post("/registro", async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;

    // ============================================
    // VALIDACIONES
    // ============================================
    if (!nombre || !email || !password || !rol) {
      return res.status(400).json({ mensaje: "Faltan campos obligatorios" });
    }

    if (password.length < 4) {
      return res.status(400).json({ mensaje: "La contraseña debe tener al menos 4 caracteres" });
    }

    if (!email.includes("@") || !email.includes(".")) {
      return res.status(400).json({ mensaje: "Email inválido" });
    }

    // ============================================
    // VERIFICAR SI EL EMAIL YA EXISTE
    // ============================================
    let existe = false;
    let tabla = "";

    if (rol === "pescador") {
      tabla = "pescador";
      const check = await pool.query(
        `SELECT id_pescador FROM ${tabla} WHERE email_pescador = $1`,
        [email]
      );
      if (check.rows.length > 0) existe = true;
    } else if (rol === "club") {
      tabla = "clubs";
      const check = await pool.query(
        `SELECT id_club FROM ${tabla} WHERE email_contacto = $1`,
        [email]
      );
      if (check.rows.length > 0) existe = true;
    } else {
      return res.status(400).json({ mensaje: "Rol inválido" });
    }

    if (existe) {
      return res.status(400).json({ mensaje: "El email ya está registrado" });
    }

    // ============================================
    // GUARDAR EN LA BASE DE DATOS
    // ============================================
    if (rol === "pescador") {
      await pool.query(
        `INSERT INTO pescador (nombre_pescador, email_pescador, password_hash)
         VALUES ($1, $2, $3)`,
        [nombre, email, password]
      );
    } else if (rol === "club") {
      await pool.query(
        `INSERT INTO clubs (nombre_club, email_contacto, password_hash, validado)
         VALUES ($1, $2, $3, false)`,
        [nombre, email, password]
      );
    }

    // ============================================
    // RESPUESTA DE ÉXITO
    // ============================================
    res.status(201).json({
      mensaje: `Usuario ${nombre} registrado correctamente`,
      usuario: {
        nombre: nombre,
        email: email,
        rol: rol
      }
    });

  } catch (error) {
    console.error("Error en registro:", error);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
});

module.exports = router;