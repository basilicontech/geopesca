const express = require("express");
const router = express.Router();
const pool = require("../db/connection");

// ============================================================
// GET /api/jornadas/list - Listar todas las jornadas (para administración)
// ============================================================
router.get("/list", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        j.id_jornada,
        j.fecha_inicio,
        j.hora_inicio,
        j.hora_fin,
        p.nombre_pescador,
        j.creado_en
      FROM jornada j
      LEFT JOIN pescador p ON p.id_pescador = j.id_pescador
      ORDER BY j.fecha_inicio DESC, j.hora_inicio DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error("Error listando jornadas:", error);
    res.status(500).json({ error: "Error al obtener jornadas" });
  }
});

// ============================================================
// DELETE /api/jornadas/:id - Eliminar una jornada
// ============================================================
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const jornadaResult = await pool.query(
      'SELECT * FROM jornada WHERE id_jornada = $1',
      [id]
    );

    if (jornadaResult.rows.length === 0) {
      return res.status(404).json({ error: "Jornada no encontrada" });
    }

    await pool.query('DELETE FROM jornada WHERE id_jornada = $1', [id]);

    res.json({ message: "Jornada eliminada correctamente" });
  } catch (error) {
    console.error("Error eliminando jornada:", error);
    res.status(500).json({ error: "Error al eliminar jornada" });
  }
});

// ============================================================
// GET /api/jornadas/ - Obtener todas las jornadas (GeoJSON)
// ============================================================
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        j.id_jornada,
        j.fecha_inicio,
        j.hora_inicio,
        j.hora_fin,
        j.notas,
        j.creado_en,
        j.algas_presente,
        j.mar_fondo,
        p.nombre_pescador,
        ST_X(j.geom) as longitud,
        ST_Y(j.geom) as latitud,
        h.tipo_habitat,
        tl.nombre_lecho,
        dv.direccion_viento,
        vv.denominacion as velocidad_viento,
        ao.descripcion as altura_ola,
        t.tipo_turbidez,
        ta.tipo_tiempo_atmosferico,
        tp.tipo_pesca,
        cn.tipo_cebo_natural,
        ca.tipo_cebo_artificial,
        COALESCE(
          (SELECT json_agg(json_build_object(
            'id_captura', c.id_captura,
            'especie', e.nombre_especie,
            'talla_cm', c.talla_cm
          ))
           FROM captura c
           LEFT JOIN especie e ON e.id_especie = c.id_especie
           WHERE c.id_jornada = j.id_jornada
          ), '[]'::json
        ) AS capturas
      FROM jornada j
      LEFT JOIN pescador p ON p.id_pescador = j.id_pescador
      LEFT JOIN habitat h ON h.id_habitat = j.id_habitat
      LEFT JOIN tipo_lecho tl ON tl.id_tipo_lecho = j.id_tipo_lecho
      LEFT JOIN direccion_viento dv ON dv.id_direccion_viento = j.id_direccion_viento
      LEFT JOIN velocidad_viento vv ON vv.id_velocidad_viento = j.id_velocidad_viento
      LEFT JOIN altura_olas ao ON ao.id_altura_olas = j.id_altura_olas
      LEFT JOIN turbidez t ON t.id_turbidez = j.id_turbidez
      LEFT JOIN tiempo_atmosferico ta ON ta.id_tiempo_atmosferico = j.id_tiempo_atmosferico
      LEFT JOIN tipo_pesca tp ON tp.id_tipo_pesca = j.id_tipo_pesca
      LEFT JOIN cebo_natural cn ON cn.id_cebo_natural = j.id_cebo_natural
      LEFT JOIN cebo_artificial ca ON ca.id_cebo_artificial = j.id_cebo_artificial
      ORDER BY j.fecha_inicio DESC, j.hora_inicio DESC
    `);

    const geojson = {
      type: "FeatureCollection",
      features: result.rows.map((row) => ({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [parseFloat(row.longitud), parseFloat(row.latitud)],
        },
        properties: {
          id: row.id_jornada,
          fecha_inicio: row.fecha_inicio,
          hora_inicio: row.hora_inicio,
          hora_fin: row.hora_fin,
          pescador: row.nombre_pescador,
          notas: row.notas,
          capturas: row.capturas,
          creado_en: row.creado_en,
          habitat: row.tipo_habitat,
          tipo_lecho: row.nombre_lecho,
          algas_presente: row.algas_presente,
          direccion_viento: row.direccion_viento,
          velocidad_viento: row.velocidad_viento,
          altura_ola: row.altura_ola,
          turbidez: row.tipo_turbidez,
          tiempo: row.tipo_tiempo_atmosferico,
          tipo_pesca: row.tipo_pesca,
          cebo_natural: row.tipo_cebo_natural,
          cebo_artificial: row.tipo_cebo_artificial,
          mar_fondo: row.mar_fondo,
        },
      })),
    };

    res.json(geojson);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error consultando jornadas" });
  }
});

// ============================================================
// POST /api/jornadas - Crear nueva jornada
// ============================================================
router.post("/", async (req, res) => {
  const client = await pool.connect();

  try {
    const {
      id_pescador,
      fecha_inicio,
      hora_inicio,
      hora_fin,
      lat,
      lng,
      id_habitat,
      id_tipo_lecho,
      algas_presente,
      id_direccion_viento,
      id_velocidad_viento,
      id_altura_olas,
      id_turbidez,
      id_tiempo_atmosferico,
      id_tipo_pesca,
      id_cebo_natural,
      id_cebo_artificial,
      mar_fondo,
      notas,
      capturas,
    } = req.body;

    await client.query("BEGIN");

    const jornadaResult = await client.query(
      `INSERT INTO jornada (
        id_pescador, fecha_inicio, hora_inicio, hora_fin, geom,
        id_habitat, id_tipo_lecho, algas_presente, id_direccion_viento,
        id_velocidad_viento, id_altura_olas, id_turbidez, id_tiempo_atmosferico,
        id_tipo_pesca, id_cebo_natural, id_cebo_artificial, mar_fondo, notas
      ) VALUES ($1, $2, $3, $4, ST_SetSRID(ST_MakePoint($5, $6), 4326),
        $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
      RETURNING id_jornada`,
      [
        id_pescador,
        fecha_inicio,
        hora_inicio,
        hora_fin,
        lng,
        lat,
        id_habitat,
        id_tipo_lecho,
        algas_presente,
        id_direccion_viento,
        id_velocidad_viento,
        id_altura_olas,
        id_turbidez,
        id_tiempo_atmosferico,
        id_tipo_pesca,
        id_cebo_natural,
        id_cebo_artificial,
        mar_fondo,
        notas,
      ],
    );

    const id_jornada = jornadaResult.rows[0].id_jornada;

    if (capturas && capturas.length > 0) {
      for (const captura of capturas) {
        await client.query(
          `INSERT INTO captura (id_jornada, id_especie, talla_cm)
           VALUES ($1, $2, $3)`,
          [id_jornada, captura.id_especie, captura.talla_cm],
        );
      }
    }

    await client.query("COMMIT");
    res
      .status(201)
      .json({ id_jornada, message: "Jornada registrada con éxito" });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    res.status(500).json({ error: "Error creando jornada" });
  } finally {
    client.release();
  }
});

module.exports = router;