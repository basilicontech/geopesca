// datos-ambientales.js
// Módulo reutilizable para datos ambientales

function generarHTMLDatosAmbientales(prefix = "") {
  // Determinar si es para jornada (sin prefix) o concurso (con prefix)
  const esJornada = prefix === "";

  return `
    <details>
      <summary>📊 Datos ambientales y opcionales</summary>

      <label>Hábitat:</label>
      <select id="${prefix}habitat">
        <option value="">-- Seleccione --</option>
      </select>

      <label>Tipo de lecho:</label>
      <select id="${prefix}tipo_lecho">
        <option value="">-- Seleccione --</option>
      </select>

      <label>Presencia de algas:</label>
      <select id="${prefix}algas">
        <option value="">-- Seleccione --</option>
        <option value="true">Sí</option>
        <option value="false">No</option>
      </select>

      <label>Dirección del viento:</label>
      <select id="${prefix}direccion_viento">
        <option value="">-- Seleccione --</option>
      </select>

      <label>Velocidad del viento:</label>
      <select id="${prefix}velocidad_viento">
        <option value="">-- Seleccione --</option>
      </select>

      <label>Altura de olas:</label>
      <select id="${prefix}altura_olas">
        <option value="">-- Seleccione --</option>
      </select>

      <label>Turbidez:</label>
      <select id="${prefix}turbidez">
        <option value="">-- Seleccione --</option>
      </select>

      <label>Tiempo atmosférico:</label>
      <select id="${prefix}tiempo">
        <option value="">-- Seleccione --</option>
      </select>

      <label>Mar de fondo:</label>
      <select id="${prefix}mar_fondo">
        <option value="">-- Seleccione --</option>
        <option value="true">Sí</option>
        <option value="false">No</option>
      </select>

      ${
        esJornada
          ? `
        <label>Tipo de pesca:</label>
        <select id="tipo_pesca">
          <option value="">-- Seleccione --</option>
        </select>

        <label>Cebo natural:</label>
        <select id="cebo_natural">
          <option value="">-- Seleccione --</option>
        </select>

        <label>Señuelo artificial:</label>
        <select id="cebo_artificial">
          <option value="">-- Seleccione --</option>
        </select>

        <label>Notas adicionales:</label>
        <textarea
          id="notas"
          rows="3"
          placeholder="Observaciones interesantes..."
        ></textarea>
      `
          : ""
      }
    </details>
  `;
}

async function cargarDatosAmbientales(prefix = "") {
  try {
    const esJornada = prefix === "";

    // Hábitats
    const habitats = await fetch(
      "https://geopesca.basilicontech.com/api/catalogs/habitats",
    ).then((r) => r.json());
    const habitatSelect = document.getElementById(`${prefix}habitat`);
    if (habitatSelect) {
      habitats.forEach((h) => {
        const option = document.createElement("option");
        option.value = h.id_habitat;
        option.textContent = h.tipo_habitat;
        habitatSelect.appendChild(option);
      });
    }

    // Tipos de lecho
    const lechos = await fetch(
      "https://geopesca.basilicontech.com/api/catalogs/tipos-lecho",
    ).then((r) => r.json());
    const lechoSelect = document.getElementById(`${prefix}tipo_lecho`);
    if (lechoSelect) {
      lechos.forEach((l) => {
        const option = document.createElement("option");
        option.value = l.id_tipo_lecho;
        option.textContent = l.nombre_lecho;
        lechoSelect.appendChild(option);
      });
    }

    // Direcciones de viento
    const vientos = await fetch(
      "https://geopesca.basilicontech.com/api/catalogs/direcciones-viento",
    ).then((r) => r.json());
    const vientoSelect = document.getElementById(`${prefix}direccion_viento`);
    if (vientoSelect) {
      vientos.forEach((v) => {
        const option = document.createElement("option");
        option.value = v.id_direccion_viento;
        option.textContent = v.direccion_viento;
        vientoSelect.appendChild(option);
      });
    }

    // Velocidades de viento
    const velocidades = await fetch(
      "https://geopesca.basilicontech.com/api/catalogs/velocidades-viento",
    ).then((r) => r.json());
    const velocidadSelect = document.getElementById(
      `${prefix}velocidad_viento`,
    );
    if (velocidadSelect) {
      velocidades.forEach((v) => {
        const option = document.createElement("option");
        option.value = v.id_velocidad_viento;
        option.textContent = `${v.grado_beaufort} - ${v.denominacion}`;
        velocidadSelect.appendChild(option);
      });
    }

    // Alturas de olas
    const olas = await fetch(
      "https://geopesca.basilicontech.com/api/catalogs/alturas-olas",
    ).then((r) => r.json());
    const olasSelect = document.getElementById(`${prefix}altura_olas`);
    if (olasSelect) {
      olas.forEach((o) => {
        const option = document.createElement("option");
        option.value = o.id_altura_olas;
        option.textContent = o.descripcion;
        olasSelect.appendChild(option);
      });
    }

    // Turbideces
    const turbideces = await fetch(
      "https://geopesca.basilicontech.com/api/catalogs/turbideces",
    ).then((r) => r.json());
    const turbidezSelect = document.getElementById(`${prefix}turbidez`);
    if (turbidezSelect) {
      turbideces.forEach((t) => {
        const option = document.createElement("option");
        option.value = t.id_turbidez;
        option.textContent = t.tipo_turbidez;
        turbidezSelect.appendChild(option);
      });
    }

    // Tiempos atmosféricos
    const tiempos = await fetch(
      "https://geopesca.basilicontech.com/api/catalogs/tiempos-atmosfericos",
    ).then((r) => r.json());
    const tiempoSelect = document.getElementById(`${prefix}tiempo`);
    if (tiempoSelect) {
      tiempos.forEach((t) => {
        const option = document.createElement("option");
        option.value = t.id_tiempo_atmosferico;
        option.textContent = t.tipo_tiempo_atmosferico;
        tiempoSelect.appendChild(option);
      });
    }

    // Solo cargar catálogos específicos de pesca si es jornada
    if (esJornada) {
      // Tipo de pesca
      const pescas = await fetch(
        "https://geopesca.basilicontech.com/api/catalogs/tipos-pesca",
      ).then((r) => r.json());
      const pescaSelect = document.getElementById("tipo_pesca");
      if (pescaSelect) {
        pescas.forEach((p) => {
          const option = document.createElement("option");
          option.value = p.id_tipo_pesca;
          option.textContent = p.tipo_pesca;
          pescaSelect.appendChild(option);
        });
      }

      // Cebos naturales
      const cebosNat = await fetch(
        "https://geopesca.basilicontech.com/api/catalogs/cebos-naturales",
      ).then((r) => r.json());
      const ceboNatSelect = document.getElementById("cebo_natural");
      if (ceboNatSelect) {
        cebosNat.forEach((c) => {
          const option = document.createElement("option");
          option.value = c.id_cebo_natural;
          option.textContent = c.tipo_cebo_natural;
          ceboNatSelect.appendChild(option);
        });
      }

      // Cebos artificiales
      const cebosArt = await fetch(
        "https://geopesca.basilicontech.com/api/catalogs/cebos-artificiales",
      ).then((r) => r.json());
      const ceboArtSelect = document.getElementById("cebo_artificial");
      if (ceboArtSelect) {
        cebosArt.forEach((c) => {
          const option = document.createElement("option");
          option.value = c.id_cebo_artificial;
          option.textContent = c.tipo_cebo_artificial;
          ceboArtSelect.appendChild(option);
        });
      }
    }
  } catch (err) {
    console.error(`Error cargando datos ambientales (${prefix}):`, err);
  }
}

function obtenerDatosAmbientales(prefix = "") {
  const esJornada = prefix === "";

  const datos = {
    id_habitat:
      parseInt(document.getElementById(`${prefix}habitat`)?.value) || null,
    id_tipo_lecho:
      parseInt(document.getElementById(`${prefix}tipo_lecho`)?.value) || null,
    algas_presente:
      document.getElementById(`${prefix}algas`)?.value === "true"
        ? true
        : document.getElementById(`${prefix}algas`)?.value === "false"
          ? false
          : null,
    id_direccion_viento:
      parseInt(document.getElementById(`${prefix}direccion_viento`)?.value) ||
      null,
    id_velocidad_viento:
      parseInt(document.getElementById(`${prefix}velocidad_viento`)?.value) ||
      null,
    id_altura_olas:
      parseInt(document.getElementById(`${prefix}altura_olas`)?.value) || null,
    id_turbidez:
      parseInt(document.getElementById(`${prefix}turbidez`)?.value) || null,
    id_tiempo_atmosferico:
      parseInt(document.getElementById(`${prefix}tiempo`)?.value) || null,
    mar_fondo:
      document.getElementById(`${prefix}mar_fondo`)?.value === "true"
        ? true
        : document.getElementById(`${prefix}mar_fondo`)?.value === "false"
          ? false
          : null,
  };

  if (esJornada) {
    datos.id_tipo_pesca =
      parseInt(document.getElementById("tipo_pesca")?.value) || null;
    datos.id_cebo_natural =
      parseInt(document.getElementById("cebo_natural")?.value) || null;
    datos.id_cebo_artificial =
      parseInt(document.getElementById("cebo_artificial")?.value) || null;
    datos.notas = document.getElementById("notas")?.value || null;
  }

  return datos;
}

window.DatosAmbientales = {
  generarHTML: generarHTMLDatosAmbientales,
  cargar: cargarDatosAmbientales,
  obtener: obtenerDatosAmbientales,
};
