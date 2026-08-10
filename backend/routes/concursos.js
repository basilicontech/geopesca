// backend/routes/concursos.js
const express = require('express');
const router = express.Router();
const pool = require("../db/connection");

// ============================================================
// GET /api/concursos/list - Listar todos los concursos (para administración)
// ============================================================
router.get('/list', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                c.id_concurso,
                c.nombre_concurso,
                c.descripcion,
                c.fecha_inicio,
                c.fecha_fin,
                c.hora_inicio,
                c.hora_fin,
                c.lat,
                c.lng,
                c.num_participantes,
                c.nombre_ganador,
                c.algas_presente,
                c.mar_fondo,
                cl.nombre_club,
                c.creado_en,
                h.tipo_habitat AS habitat,
                tl.nombre_lecho AS tipo_lecho,
                dv.direccion_viento,
                vv.denominacion AS velocidad_viento,
                ao.descripcion AS altura_ola,
                t.tipo_turbidez AS turbidez,
                ta.tipo_tiempo_atmosferico AS tiempo,
                COALESCE(
                  (SELECT json_agg(json_build_object(
                    'especie', e.nombre_especie,
                    'num_ejemplares', cc.num_ejemplares,
                    'peso_total_kg', cc.peso_total_kg,
                    'pieza_mayor_kg', cc.pieza_mayor_kg
                  ))
                   FROM capturas_concurso cc
                   LEFT JOIN especie e ON e.id_especie = cc.id_especie
                   WHERE cc.id_concurso = c.id_concurso
                  ), '[]'::json
                ) AS capturas
            FROM concursos c
            LEFT JOIN clubs cl ON cl.id_club = c.id_club_organizador
            LEFT JOIN habitat h ON h.id_habitat = c.id_habitat
            LEFT JOIN tipo_lecho tl ON tl.id_tipo_lecho = c.id_tipo_lecho
            LEFT JOIN direccion_viento dv ON dv.id_direccion_viento = c.id_direccion_viento
            LEFT JOIN velocidad_viento vv ON vv.id_velocidad_viento = c.id_velocidad_viento
            LEFT JOIN altura_olas ao ON ao.id_altura_olas = c.id_altura_olas
            LEFT JOIN turbidez t ON t.id_turbidez = c.id_turbidez
            LEFT JOIN tiempo_atmosferico ta ON ta.id_tiempo_atmosferico = c.id_tiempo_atmosferico
            ORDER BY c.fecha_inicio DESC, c.hora_inicio DESC
        `);
        res.json(result.rows);
    } catch (error) {
        console.error('Error listando concursos:', error);
        res.status(500).json({ error: 'Error al obtener concursos' });
    }
});

// ============================================================
// DELETE /api/concursos/:id - Eliminar un concurso
// ============================================================
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Verificar si el concurso existe
        const concursoResult = await pool.query(
            'SELECT * FROM concursos WHERE id_concurso = $1',
            [id]
        );

        if (concursoResult.rows.length === 0) {
            return res.status(404).json({ error: 'Concurso no encontrado' });
        }

        const nombreConcurso = concursoResult.rows[0].nombre_concurso;

        // 1. Eliminar participaciones del concurso
        await pool.query(
            'DELETE FROM participacion_concurso WHERE id_concurso = $1',
            [id]
        );

        // 2. Eliminar capturas del concurso
        await pool.query(
            'DELETE FROM capturas_concurso WHERE id_concurso = $1',
            [id]
        );

        // 3. Eliminar el concurso
        await pool.query('DELETE FROM concursos WHERE id_concurso = $1', [id]);

        res.json({ 
            message: `Concurso "${nombreConcurso}" eliminado correctamente`
        });
    } catch (error) {
        console.error('Error eliminando concurso:', error);
        res.status(500).json({ error: 'Error al eliminar concurso' });
    }
});

// ============================================================
// GET /api/concursos/ - Obtener todos los concursos (para el mapa)
// ============================================================
router.get('/', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                c.id_concurso,
                c.nombre_concurso,
                c.descripcion,
                c.fecha_inicio,
                c.fecha_fin,
                c.hora_inicio,
                c.hora_fin,
                c.lat,
                c.lng,
                c.num_participantes,
                c.nombre_ganador,
                cl.nombre_club,
                c.creado_en
            FROM concursos c
            LEFT JOIN clubs cl ON cl.id_club = c.id_club_organizador
            ORDER BY c.fecha_inicio DESC
        `);
        res.json(result.rows);
    } catch (error) {
        console.error('Error obteniendo concursos:', error);
        res.status(500).json({ error: 'Error al obtener concursos' });
    }
});

// ============================================================
// POST /api/concursos - Crear un nuevo concurso
// ============================================================
router.post('/', async (req, res) => {
    const client = await pool.connect();

    try {
        const {
            id_club_organizador,
            nombre_concurso,
            descripcion,
            fecha_inicio,
            fecha_fin,
            hora_inicio,
            hora_fin,
            lat,
            lng,
            num_participantes,
            nombre_ganador,
            id_habitat,
            id_tipo_lecho,
            algas_presente,
            id_direccion_viento,
            id_velocidad_viento,
            id_altura_olas,
            id_turbidez,
            id_tiempo_atmosferico,
            mar_fondo,
            capturas
        } = req.body;

        await client.query('BEGIN');

        const result = await client.query(
            `INSERT INTO concursos (
                id_club_organizador, nombre_concurso, descripcion,
                fecha_inicio, fecha_fin, hora_inicio, hora_fin,
                lat, lng, num_participantes, nombre_ganador,
                id_habitat, id_tipo_lecho, algas_presente,
                id_direccion_viento, id_velocidad_viento, id_altura_olas,
                id_turbidez, id_tiempo_atmosferico, mar_fondo
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
            RETURNING id_concurso`,
            [
                id_club_organizador, nombre_concurso, descripcion,
                fecha_inicio, fecha_fin, hora_inicio, hora_fin,
                lat, lng, num_participantes || 0, nombre_ganador || null,
                id_habitat || null, id_tipo_lecho || null, algas_presente || null,
                id_direccion_viento || null, id_velocidad_viento || null, id_altura_olas || null,
                id_turbidez || null, id_tiempo_atmosferico || null, mar_fondo || null
            ]
        );

        const id_concurso = result.rows[0].id_concurso;

        // Insertar capturas del concurso
        if (capturas && capturas.length > 0) {
            for (const captura of capturas) {
                await client.query(
                    `INSERT INTO capturas_concurso (
                        id_concurso, id_especie, num_ejemplares, 
                        peso_total_kg, pieza_mayor_kg
                    ) VALUES ($1, $2, $3, $4, $5)`,
                    [
                        id_concurso,
                        captura.id_especie,
                        captura.num_ejemplares || 0,
                        captura.peso_total_kg || 0,
                        captura.pieza_mayor_kg || 0
                    ]
                );
            }
        }

        await client.query('COMMIT');
        res.status(201).json({ id_concurso, message: 'Concurso registrado con éxito' });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error creando concurso:', error);
        res.status(500).json({ error: 'Error al crear concurso' });
    } finally {
        client.release();
    }
});

module.exports = router;