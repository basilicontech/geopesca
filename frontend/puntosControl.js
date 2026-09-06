// puntosControl.js - Módulo para controlar los puntos en el mapa
// Responsabilidades: Gestión de capas de puntos de pescadores y concursos
// Dependencias: Leaflet (L), API REST en https://azaharlimpieza.es

// ============================================================
// VARIABLES GLOBALES DEL MÓDULO
// ============================================================

// Capas que contienen TODOS los puntos cargados desde la API
// Se crean en sus respectivas funciones pero NO se muestran automáticamente
// Se usan como fuente de datos para filtros

let capaPescadores = null; // Capa con todas las jornadas de pescadores
let capaConcursos = null; // Capa con todos los concursos

// Capas temporales que contienen SOLO los puntos que pasan los filtros activos
// Se crean cada vez que se aplican filtros y se destruyen al limpiarlos

let capaFiltradaPescadores = null; // Capa temporal para puntos de pescadores filtrados
let capaFiltradaConcursos = null; // Capa temporal para puntos de concursos filtrados

// Marcador temporal de color rojo que aparece al hacer clic en el mapa
// Indica dónde se registrará una nueva jornada o concurso

let tempMarker = null; // Marcador temporal para nueva ubicación

// ============================================================
// CONFIGURACIÓN DE ESTILOS VISUALES DE LOS PUNTOS
// ============================================================

// Objeto con estilos para diferentes tipos de puntos en el mapa

const estilosPuntos = {
  pescador: {
    radius: 8,
    color: "#1e5799",
    fillColor: "#2e6b9e",
    fillOpacity: 0.7,
    weight: 2,
  },
  pescadorFiltrado: {
    radius: 8,
    color: "#28a745",
    fillColor: "#28a745",
    fillOpacity: 0.7,
    weight: 2,
  },
  concurso: {
    radius: 10,
    color: "#6f42c1",
    fillColor: "#6f42c1",
    fillOpacity: 0.7,
    weight: 2,
  },
  concursoFiltrado: {
    radius: 10,
    color: "#9b59b6",
    fillColor: "#9b59b6",
    fillOpacity: 0.7,
    weight: 2,
  },
  temporal: {
    radius: 10,
    color: "#ff4444",
    fillColor: "#ff4444",
    fillOpacity: 0.8,
    weight: 3,
  },
};

// ============================================================
// FUNCIÓN: cargarPuntosPescadores()
// PROPÓSITO: Obtener todas las jornadas de pescadores desde la API
// ============================================================

async function cargarPuntosPescadores(map, onPointClick) {
  try {
    const response = await fetch("https://azaharlimpieza.es/api/jornadas");
    const geojson = await response.json();

    if (!geojson.features) return;
    // Si ya existe una capa, eliminarla
    if (capaPescadores) {
      map.removeLayer(capaPescadores);
    }

    // Crear la capa con todos los puntos pero NO añadirla al mapa
    capaPescadores = L.geoJSON(geojson, {
      pointToLayer: (feature, latlng) => {
        return L.circleMarker(latlng, estilosPuntos.pescador);
      },
      onEachFeature: (feature, layer) => {
        const p = feature.properties;
        layer.on("click", () => {
          if (onPointClick) onPointClick(p);
        });
      },
    });

    console.log(
      `📍 Puntos de pescadores cargados: ${geojson.features.length} (ocultos hasta aplicar filtros)`,
    );
    return capaPescadores;
  } catch (err) {
    console.error("Error cargando puntos de pescadores:", err);
    return null;
  }
}

// ============================================================
// FUNCIÓN: cargarPuntosConcursos()
// PROPÓSITO: Obtener todos los concursos desde la API y preparar la capa
// ============================================================

async function cargarPuntosConcursos(map, onConcursoClick) {
  try {
    const response = await fetch("https://azaharlimpieza.es/api/concursos/list");
    const data = await response.json();

    if (!data || data.length === 0) return;

    if (capaConcursos) {
      map.removeLayer(capaConcursos);
    }

    const features = data.map((c) => ({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [parseFloat(c.lng), parseFloat(c.lat)],
      },
      properties: {
        id_concurso: c.id_concurso,
        nombre_concurso: c.nombre_concurso,
        descripcion: c.descripcion,
        fecha_inicio: c.fecha_inicio,
        fecha_fin: c.fecha_fin,
        hora_inicio: c.hora_inicio,
        hora_fin: c.hora_fin,
        lat: c.lat,
        lng: c.lng,
        num_participantes: c.num_participantes,
        nombre_ganador: c.nombre_ganador,
        nombre_club: c.nombre_club,
        // Datos ambientales
        habitat: c.habitat,
        tipo_lecho: c.tipo_lecho,
        algas_presente: c.algas_presente,
        direccion_viento: c.direccion_viento,
        velocidad_viento: c.velocidad_viento,
        altura_ola: c.altura_ola,
        turbidez: c.turbidez,
        tiempo: c.tiempo,
        mar_fondo: c.mar_fondo,
        // Capturas
        capturas: c.capturas || [],
        tipo: "concurso",
      },
    }));

    capaConcursos = L.geoJSON(
      {
        type: "FeatureCollection",
        features: features,
      },
      {
        pointToLayer: (feature, latlng) => {
          return L.circleMarker(latlng, estilosPuntos.concurso);
        },
        onEachFeature: (feature, layer) => {
          const p = feature.properties;
          layer.on("click", () => {
            if (onConcursoClick) onConcursoClick(p);
          });
        },
      },
    );

    console.log(
      `📍 Puntos de concursos cargados: ${data.length} (ocultos hasta aplicar filtros)`,
    );
    return capaConcursos;
  } catch (err) {
    console.error("Error cargando puntos de concursos:", err);
    return null;
  }
}
// ============================================================
// FUNCIÓN: mostrarTodosLosPuntos()
// PROPÓSITO: Mostrar TODOS los puntos en el mapa (sin ningún filtro)
// ============================================================

function mostrarTodosLosPuntos(map) {
  // Ocultar capas filtradas si existen
  if (capaFiltradaPescadores) {
    map.removeLayer(capaFiltradaPescadores);
    capaFiltradaPescadores = null;
  }
  if (capaFiltradaConcursos) {
    map.removeLayer(capaFiltradaConcursos);
    capaFiltradaConcursos = null;
  }

  // Mostrar capa original de pescadores
  if (capaPescadores && !map.hasLayer(capaPescadores)) {
    capaPescadores.addTo(map);
  }

  // Mostrar capa original de concursos
  if (capaConcursos && !map.hasLayer(capaConcursos)) {
    capaConcursos.addTo(map);
  }

  console.log(`✅ Mostrando todos los puntos de pescadores y concursos`);
  return true;
}

// ============================================================
// FUNCIÓN: mostrarPuntosFiltradosPescadores()
// PROPÓSITO: Mostrar SOLO los puntos de pescadores que coinciden con los filtros
// ============================================================

function mostrarPuntosFiltradosPescadores(map, puntosFiltrados, onPointClick) {
  // Ocultar capa original si está visible
  if (capaPescadores && map.hasLayer(capaPescadores)) {
    map.removeLayer(capaPescadores);
  }

  // Eliminar capa filtrada anterior
  if (capaFiltradaPescadores) {
    map.removeLayer(capaFiltradaPescadores);
    capaFiltradaPescadores = null;
  }

  // Crear nueva capa con puntos filtrados
  if (puntosFiltrados && puntosFiltrados.length > 0) {
    const features = puntosFiltrados.map((layer) => layer.feature);
    capaFiltradaPescadores = L.geoJSON(
      {
        type: "FeatureCollection",
        features: features,
      },
      {
        pointToLayer: (feature, latlng) => {
          return L.circleMarker(latlng, estilosPuntos.pescadorFiltrado);
        },
        onEachFeature: (feature, layer) => {
          const p = feature.properties;
          layer.on("click", () => {
            if (onPointClick) onPointClick(p);
          });
        },
      },
    ).addTo(map);

    console.log(
      `🎯 Mostrando ${puntosFiltrados.length} puntos de pescadores filtrados`,
    );
    return puntosFiltrados.length;
  } else {
    console.log("⚠️ No hay puntos de pescadores para mostrar");
    return 0;
  }
}

// ============================================================
// FUNCIÓN: mostrarPuntosFiltradosConcursos()
// PROPÓSITO: Mostrar SOLO los puntos de concursos que coinciden con los filtros
// ============================================================

function mostrarPuntosFiltradosConcursos(
  map,
  concursosFiltrados,
  onConcursoClick,
) {
  // Eliminar capa filtrada de concursos anterior
  if (capaFiltradaConcursos) {
    map.removeLayer(capaFiltradaConcursos);
    capaFiltradaConcursos = null;
  }

  if (concursosFiltrados && concursosFiltrados.length > 0) {
    const features = concursosFiltrados.map((layer) => layer.feature);
    capaFiltradaConcursos = L.geoJSON(
      {
        type: "FeatureCollection",
        features: features,
      },
      {
        pointToLayer: (feature, latlng) => {
          return L.circleMarker(latlng, estilosPuntos.concursoFiltrado);
        },
        onEachFeature: (feature, layer) => {
          const p = feature.properties;
          layer.on("click", () => {
            if (onConcursoClick) onConcursoClick(p);
          });
        },
      },
    ).addTo(map);

    console.log(
      `🎯 Mostrando ${concursosFiltrados.length} puntos de concursos filtrados`,
    );
    return concursosFiltrados.length;
  }
  return 0;
}

// ============================================================
// FUNCIÓN: ocultarTodosLosPuntos()
// PROPÓSITO: Ocultar completamente todos los puntos del mapa
// ============================================================

function ocultarTodosLosPuntos(map) {
  if (capaPescadores && map.hasLayer(capaPescadores)) {
    map.removeLayer(capaPescadores);
  }
  if (capaFiltradaPescadores && map.hasLayer(capaFiltradaPescadores)) {
    map.removeLayer(capaFiltradaPescadores);
  }
  if (capaConcursos && map.hasLayer(capaConcursos)) {
    map.removeLayer(capaConcursos);
  }
  if (capaFiltradaConcursos && map.hasLayer(capaFiltradaConcursos)) {
    map.removeLayer(capaFiltradaConcursos);
  }
  console.log("👻 Todos los puntos de pescadores y concursos ocultados");
}

// ============================================================
// FUNCIÓN: contarPuntos()
// PROPÓSITO: Contar cuántos puntos tiene una capa
// ============================================================

function contarPuntos(capa) {
  let count = 0;
  if (capa) {
    capa.eachLayer(() => count++);
  }
  return count;
}

// ============================================================
// FUNCIÓN: obtenerTodosLosPuntosPescadores()
// PROPÓSITO: Obtener un array con todos los puntos de pescadores
// ============================================================

function obtenerTodosLosPuntosPescadores() {
  const puntos = [];
  if (capaPescadores) {
    capaPescadores.eachLayer((layer) => {
      puntos.push(layer);
    });
  }
  return puntos;
}

// ============================================================
// FUNCIÓN: obtenerTodosLosPuntosConcursos()
// PROPÓSITO: Obtener un array con todos los puntos de concursos
// ============================================================

function obtenerTodosLosPuntosConcursos() {
  const puntos = [];
  if (capaConcursos) {
    capaConcursos.eachLayer((layer) => {
      puntos.push(layer);
    });
  }
  return puntos;
}

// ============================================================
// FUNCIÓN: filtrarPuntosPescadores()
// PROPÓSITO: Filtrar los puntos de pescadores según criterios
// ============================================================

function filtrarPuntosPescadores(criterios) {
  if (!capaPescadores) return [];

  const puntosFiltrados = [];

  capaPescadores.eachLayer((layer) => {
    const props = layer.feature.properties;
    let mostrar = true;

    // Filtrar por pescadores
    if (criterios.pescadores && criterios.pescadores.size > 0) {
      if (!criterios.pescadores.has(props.pescador)) {
        mostrar = false;
      }
    }

    // Filtrar por fecha desde
    if (
      mostrar &&
      criterios.fechaDesde &&
      props.fecha_inicio < criterios.fechaDesde
    ) {
      mostrar = false;
    }

    // Filtrar por fecha hasta
    if (
      mostrar &&
      criterios.fechaHasta &&
      props.fecha_inicio > criterios.fechaHasta
    ) {
      mostrar = false;
    }

    // Filtrar por especie (si hay capturas)
    if (mostrar && criterios.especie) {
      const tieneEspecie =
        props.capturas &&
        props.capturas.some((c) =>
          c.especie.toLowerCase().includes(criterios.especie.toLowerCase()),
        );
      if (!tieneEspecie) mostrar = false;
    }

    if (mostrar) {
      puntosFiltrados.push(layer);
    }
  });

  return puntosFiltrados;
}

// ============================================================
// FUNCIÓN: crearMarcadorTemporal()
// PROPÓSITO: Crear un marcador rojo temporal para indicar nueva ubicación
// ============================================================

function crearMarcadorTemporal(map, latlng) {
  if (tempMarker) {
    tempMarker.remove();
  }
  tempMarker = L.circleMarker(latlng, estilosPuntos.temporal).addTo(map);
  return tempMarker;
}

// ============================================================
// FUNCIÓN: eliminarMarcadorTemporal()
// PROPÓSITO: Eliminar el marcador temporal del mapa
// ============================================================

function eliminarMarcadorTemporal() {
  if (tempMarker) {
    tempMarker.remove();
    tempMarker = null;
  }
}

// ============================================================
// FUNCIÓN: refrescarPuntos()
// PROPÓSITO: Recargar todos los puntos desde la API
// ============================================================

async function refrescarPuntos(map, onPointClick, onConcursoClick) {
  await cargarPuntosPescadores(map, onPointClick);
  await cargarPuntosConcursos(map, onConcursoClick);
  return { pescadores: capaPescadores, concursos: capaConcursos };
}

// ============================================================
// EXPORTACIÓN GLOBAL
// ============================================================

window.PuntosControl = {
  // Carga de datos
  cargarPuntosPescadores,
  cargarPuntosConcursos,

  // Mostrar puntos
  mostrarTodosLosPuntos,
  mostrarPuntosFiltradosPescadores,
  mostrarPuntosFiltradosConcursos,
  ocultarTodosLosPuntos,

  // Contar y obtener
  contarPuntos,
  obtenerTodosLosPuntosPescadores,
  obtenerTodosLosPuntosConcursos,

  // Filtrar
  filtrarPuntosPescadores,

  // Marcador temporal
  crearMarcadorTemporal,
  eliminarMarcadorTemporal,

  // Refrescar
  refrescarPuntos,

  // Getters para capas
  getCapaPescadores: () => capaPescadores,
  getCapaPescadoresFiltrada: () => capaFiltradaPescadores,
  getCapaConcursos: () => capaConcursos,
  getCapaConcursosFiltrada: () => capaFiltradaConcursos,
};
