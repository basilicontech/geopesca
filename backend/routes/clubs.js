// backend/routes/clubs.js
const express = require("express");
const router = express.Router();
const pool = require("../db/connection");
const {
  enviarEmail,
  plantillaClubValidado,
  plantillaCuentaEliminadaClub,
  avisarAdmin,
} = require("../mailer");

// ============================================================
// GET /api/clubs/list - Listar todos los clubs
// ============================================================
router.get("/list", async (req, res) => {
  try {
    const result = await pool.query(`
            SELECT 
                id_club,
                nombre_club,
                email_contacto,
                validado,
                fecha_registro
            FROM clubs
            ORDER BY nombre_club ASC
        `);
    res.json(result.rows);
  } catch (error) {
    console.error("Error listando clubs:", error);
    res.status(500).json({ error: "Error al obtener clubs" });
  }
});

// ============================================================
// GET /api/clubs/:id - Obtener un club por ID
// ============================================================
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM clubs WHERE id_club = $1", [
      id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Club no encontrado" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error obteniendo club:", error);
    res.status(500).json({ error: "Error al obtener club" });
  }
});

// ============================================================
// POST /api/clubs - Crear un nuevo club
// ============================================================
router.post("/", async (req, res) => {
  try {
    const { nombre_club, email_contacto, password_hash } = req.body;

    if (!nombre_club) {
      return res
        .status(400)
        .json({ error: "El nombre del club es obligatorio" });
    }
    if (!email_contacto) {
      return res
        .status(400)
        .json({ error: "El email de contacto es obligatorio" });
    }
    if (!password_hash) {
      return res.status(400).json({ error: "La contraseña es obligatoria" });
    }

    const result = await pool.query(
      `INSERT INTO clubs 
            (nombre_club, email_contacto, password_hash, validado) 
            VALUES ($1, $2, $3, false) 
            RETURNING *`,
      [nombre_club, email_contacto, password_hash],
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creando club:", error);
    res.status(500).json({ error: "Error al crear club" });
  }
});

// ============================================================
// PUT /api/clubs/:id - Actualizar un club
// ============================================================
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre_club, email_contacto, password_hash, validado } = req.body;

    const clubExist = await pool.query(
      "SELECT * FROM clubs WHERE id_club = $1",
      [id],
    );

    if (clubExist.rows.length === 0) {
      return res.status(404).json({ error: "Club no encontrado" });
    }

    let updates = [];
    let values = [];
    let paramCount = 1;

    if (nombre_club !== undefined) {
      updates.push(`nombre_club = $${paramCount++}`);
      values.push(nombre_club);
    }
    if (email_contacto !== undefined) {
      updates.push(`email_contacto = $${paramCount++}`);
      values.push(email_contacto);
    }
    if (password_hash !== undefined) {
      updates.push(`password_hash = $${paramCount++}`);
      values.push(password_hash);
    }
    if (validado !== undefined) {
      updates.push(`validado = $${paramCount++}`);
      values.push(validado);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: "No hay campos para actualizar" });
    }

    values.push(id);
    const query = `
            UPDATE clubs 
            SET ${updates.join(", ")} 
            WHERE id_club = $${paramCount} 
            RETURNING *
        `;

    const result = await pool.query(query, values);
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error actualizando club:", error);
    res.status(500).json({ error: "Error al actualizar club" });
  }
});

// ============================================================
// DELETE /api/clubs/:id - Eliminar un club y sus concursos
// ============================================================
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar si el club existe
    const clubResult = await pool.query(
      "SELECT * FROM clubs WHERE id_club = $1",
      [id],
    );

    if (clubResult.rows.length === 0) {
      return res.status(404).json({ error: "Club no encontrado" });
    }

    const nombreClub = clubResult.rows[0].nombre_club;
    const emailClub = clubResult.rows[0].email_contacto;

    // 1. Eliminar participaciones de concursos donde este club participó
    await pool.query(
      "DELETE FROM participacion_concurso WHERE id_club_participante = $1",
      [id],
    );

    // 2. Obtener los IDs de los concursos organizados por este club
    const concursosResult = await pool.query(
      "SELECT id_concurso FROM concursos WHERE id_club_organizador = $1",
      [id],
    );

    const concursoIds = concursosResult.rows.map((row) => row.id_concurso);

    // 3. Eliminar capturas de esos concursos
    if (concursoIds.length > 0) {
      // Eliminar capturas_concurso
      await pool.query(
        "DELETE FROM capturas_concurso WHERE id_concurso = ANY($1)",
        [concursoIds],
      );

      // Eliminar participaciones de esos concursos (por si quedaron huérfanas)
      await pool.query(
        "DELETE FROM participacion_concurso WHERE id_concurso = ANY($1)",
        [concursoIds],
      );

      // Eliminar los concursos
      await pool.query("DELETE FROM concursos WHERE id_club_organizador = $1", [
        id,
      ]);
    }

    // 4. Eliminar el club
    await pool.query("DELETE FROM clubs WHERE id_club = $1", [id]);

    // 5. Enviar email de confirmación al club eliminado (no bloqueante)
    const plantilla = plantillaCuentaEliminadaClub(nombreClub);
    enviarEmail({ to: emailClub, ...plantilla });

    // 6. Avisar al admin (no bloqueante)
    avisarAdmin("eliminacion_club", {
      nombre: nombreClub,
      email: emailClub,
      concursos: concursoIds.length,
    });

    res.json({
      message: `Club "${nombreClub}" y sus ${concursoIds.length} concurso(s) eliminados correctamente`,
      concursos_eliminados: concursoIds.length,
    });
  } catch (error) {
    console.error("Error eliminando club:", error);
    res.status(500).json({ error: "Error al eliminar club" });
  }
});

// ============================================================
// PUT /api/clubs/:id/validar - Validar un club
// ============================================================
router.put("/:id/validar", async (req, res) => {
  try {
    const { id } = req.params;

    const clubExist = await pool.query(
      "SELECT * FROM clubs WHERE id_club = $1",
      [id],
    );

    if (clubExist.rows.length === 0) {
      return res.status(404).json({ error: "Club no encontrado" });
    }

    const result = await pool.query(
      "UPDATE clubs SET validado = true WHERE id_club = $1 RETURNING *",
      [id],
    );

    const club = result.rows[0];

    // Enviar email de validación (no bloqueante)
    const plantilla = plantillaClubValidado(club.nombre_club);
    enviarEmail({ to: club.email_contacto, ...plantilla });

    // Avisar al admin (no bloqueante)
    avisarAdmin("validacion_club", {
      nombre: club.nombre_club,
      email: club.email_contacto,
    });

    res.json({
      message: "Club validado correctamente",
      club: club,
    });
  } catch (error) {
    console.error("Error validando club:", error);
    res.status(500).json({ error: "Error al validar club" });
  }
});

module.exports = router;