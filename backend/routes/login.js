// backend/routes/login.js - API de login

const express = require("express");
const router = express.Router();
const pool = require("../db/connection");

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ mensaje: "Faltan campos obligatorios" });
    }

    if (!email.includes("@") || !email.includes(".")) {
      return res.status(400).json({ mensaje: "Email inválido" });
    }

    if (password.length < 4) {
      return res.status(400).json({ mensaje: "La contraseña debe tener al menos 4 caracteres" });
    }

    // Buscar en pescador
    const pescadorResult = await pool.query(
      `SELECT id_pescador, nombre_pescador, email_pescador, password_hash 
       FROM pescador 
       WHERE email_pescador = $1`,
      [email]
    );

    if (pescadorResult.rows.length > 0) {
      const user = pescadorResult.rows[0];
      if (user.password_hash === password) {
        return res.status(200).json({
          mensaje: `Bienvenido ${user.nombre_pescador}`,
          usuario: {
            id: user.id_pescador,
            nombre: user.nombre_pescador,
            email: user.email_pescador,
            rol: "pescador"
          }
        });
      } else {
        return res.status(401).json({ mensaje: "Contraseña incorrecta" });
      }
    }

    // Buscar en clubs
    const clubResult = await pool.query(
      `SELECT id_club, nombre_club, email_contacto, password_hash, validado
       FROM clubs 
       WHERE email_contacto = $1`,
      [email]
    );

    if (clubResult.rows.length > 0) {
      const user = clubResult.rows[0];
      if (user.password_hash === password) {
        return res.status(200).json({
          mensaje: `Bienvenido ${user.nombre_club}`,
          usuario: {
            id: user.id_club,
            nombre: user.nombre_club,
            email: user.email_contacto,
            rol: "club",
            validado: user.validado
          }
        });
      } else {
        return res.status(401).json({ mensaje: "Contraseña incorrecta" });
      }
    }

    // Buscar en administrador
    const adminResult = await pool.query(
      `SELECT id_administrador, nombre_administrador, email_administrador, password_hash
       FROM administrador 
       WHERE email_administrador = $1`,
      [email]
    );

    if (adminResult.rows.length > 0) {
      const user = adminResult.rows[0];
      if (user.password_hash === password) {
        return res.status(200).json({
          mensaje: `Bienvenido ${user.nombre_administrador}`,
          usuario: {
            id: user.id_administrador,
            nombre: user.nombre_administrador,
            email: user.email_administrador,
            rol: "admin"
          }
        });
      } else {
        return res.status(401).json({ mensaje: "Contraseña incorrecta" });
      }
    }

    return res.status(404).json({ mensaje: "Usuario no encontrado" });

  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
});

module.exports = router;