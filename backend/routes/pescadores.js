// backend/routes/pescadores.js
const express = require('express');
const router = express.Router();
const pool = require("../db/connection");
const {
  enviarEmail,
  plantillaCuentaEliminadaPescador,
  avisarAdmin,
} = require("../mailer");

// ============================================================
// GET /api/pescadores/list - Listar todos los pescadores
// ============================================================
router.get('/list', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                id_pescador,
                nombre_pescador,
                email_pescador,
                fecha_registro
            FROM pescador
            ORDER BY nombre_pescador ASC
        `);
        res.json(result.rows);
    } catch (error) {
        console.error('Error listando pescadores:', error);
        res.status(500).json({ error: 'Error al obtener pescadores' });
    }
});

// ============================================================
// GET /api/pescadores/:id - Obtener un pescador por ID
// ============================================================
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            'SELECT * FROM pescador WHERE id_pescador = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Pescador no encontrado' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error obteniendo pescador:', error);
        res.status(500).json({ error: 'Error al obtener pescador' });
    }
});

// ============================================================
// DELETE /api/pescadores/:id - Eliminar un pescador y todas sus jornadas
// ============================================================
router.delete('/:id', async (req, res) => {
    const client = await pool.connect();

    try {
        const { id } = req.params;

        // Verificar si el pescador existe
        const pescadorResult = await pool.query(
            'SELECT * FROM pescador WHERE id_pescador = $1',
            [id]
        );

        if (pescadorResult.rows.length === 0) {
            return res.status(404).json({ error: 'Pescador no encontrado' });
        }

        const nombrePescador = pescadorResult.rows[0].nombre_pescador;
        const emailPescador = pescadorResult.rows[0].email_pescador;

        await client.query('BEGIN');

        // 1. Obtener los IDs de las jornadas del pescador
        const jornadasResult = await client.query(
            'SELECT id_jornada FROM jornada WHERE id_pescador = $1',
            [id]
        );

        const jornadaIds = jornadasResult.rows.map(row => row.id_jornada);

        // 2. Eliminar capturas de esas jornadas (ON DELETE CASCADE las eliminaría, pero por seguridad)
        if (jornadaIds.length > 0) {
            await client.query(
                'DELETE FROM captura WHERE id_jornada = ANY($1)',
                [jornadaIds]
            );
        }

        // 3. Eliminar las jornadas del pescador
        await client.query(
            'DELETE FROM jornada WHERE id_pescador = $1',
            [id]
        );

        // 4. Eliminar el pescador
        await client.query('DELETE FROM pescador WHERE id_pescador = $1', [id]);

        await client.query('COMMIT');

        // 5. Enviar email de confirmación al pescador eliminado (no bloqueante)
        const plantilla = plantillaCuentaEliminadaPescador(nombrePescador);
        enviarEmail({ to: emailPescador, ...plantilla });

        // 6. Avisar al admin (no bloqueante)
        avisarAdmin("eliminacion_pescador", {
            nombre: nombrePescador,
            email: emailPescador,
            jornadas: jornadaIds.length,
        });

        res.json({ 
            message: `Pescador "${nombrePescador}" y sus ${jornadaIds.length} jornada(s) eliminados correctamente`,
            pescador_eliminado: nombrePescador,
            jornadas_eliminadas: jornadaIds.length
        });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error eliminando pescador:', error);
        res.status(500).json({ error: 'Error al eliminar pescador' });
    } finally {
        client.release();
    }
});

module.exports = router;