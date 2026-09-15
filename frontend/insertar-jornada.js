// insertar-jornada.js
// Módulo encargado de la gestión del formulario de registro de nuevas jornadas de pesca
// Responsabilidades: Carga de catálogos, gestión de capturas, envío de datos a la API

// ============================================================
// VARIABLES GLOBALES DEL MÓDULO
// ============================================================

// Almacena las coordenadas seleccionadas por el usuario en el mapa
// Se inicializa como null hasta que el usuario haga clic en el mapa

let selectedCoordinates = null;

// Array que almacena las capturas añadidas por el usuario
// Cada captura tiene: { id_especie, nombre_especie, talla_cm }

let catchesArray = [];
let insertarJornadaInicializado = false;

// ============================================================
// FUNCIÓN: loadCatalogs()
// PROPÓSITO: Cargar todos los catálogos desde la API y llenar los selectores del formulario
// CUÁNDO SE EJECUTA: Al inicializar el módulo (desde inicializarInsertarJornada)
// QUÉ HACE:
//   1. Solicita datos a los endpoints de la API (pescadores, especies, hábitats, etc.)
//   2. Para cada catálogo, crea elementos <option> y los añade a su <select> correspondiente
//   3. Los valores guardados son los IDs, los textos visibles son los nombres descriptivos
// ============================================================

async function loadCatalogs() {
  try {
    const especies = await fetch(
      "/api/catalogs/especies",
    ).then((r) => r.json());
    const especieSelect = document.getElementById("especie");
    especies.forEach((e) => {
      const option = document.createElement("option");
      option.value = e.id_especie;
      option.textContent = e.nombre_especie;
      especieSelect.appendChild(option);
    });

    const habitats = await fetch(
      "/api/catalogs/habitats",
    ).then((r) => r.json());
    const habitatSelect = document.getElementById("habitat");
    habitats.forEach((h) => {
      const option = document.createElement("option");
      option.value = h.id_habitat;
      option.textContent = h.tipo_habitat;
      habitatSelect.appendChild(option);
    });

    const lechos = await fetch(
      "/api/catalogs/tipos-lecho",
    ).then((r) => r.json());
    const lechoSelect = document.getElementById("tipo_lecho");
    lechos.forEach((l) => {
      const option = document.createElement("option");
      option.value = l.id_tipo_lecho;
      option.textContent = l.nombre_lecho;
      lechoSelect.appendChild(option);
    });

    const vientos = await fetch(
      "/api/catalogs/direcciones-viento",
    ).then((r) => r.json());
    const vientoSelect = document.getElementById("direccion_viento");
    vientos.forEach((v) => {
      const option = document.createElement("option");
      option.value = v.id_direccion_viento;
      option.textContent = v.direccion_viento;
      vientoSelect.appendChild(option);
    });

    const velocidades = await fetch(
      "/api/catalogs/velocidades-viento",
    ).then((r) => r.json());
    const velocidadSelect = document.getElementById("velocidad_viento");
    velocidades.forEach((v) => {
      const option = document.createElement("option");
      option.value = v.id_velocidad_viento;
      option.textContent = `${v.grado_beaufort} - ${v.denominacion}`;
      velocidadSelect.appendChild(option);
    });

    const olas = await fetch(
      "/api/catalogs/alturas-olas",
    ).then((r) => r.json());
    const olasSelect = document.getElementById("altura_olas");
    olas.forEach((o) => {
      const option = document.createElement("option");
      option.value = o.id_altura_olas;
      option.textContent = o.descripcion;
      olasSelect.appendChild(option);
    });

    const turbideces = await fetch(
      "/api/catalogs/turbideces",
    ).then((r) => r.json());
    const turbidezSelect = document.getElementById("turbidez");
    turbideces.forEach((t) => {
      const option = document.createElement("option");
      option.value = t.id_turbidez;
      option.textContent = t.tipo_turbidez;
      turbidezSelect.appendChild(option);
    });

    const tiempos = await fetch(
      "/api/catalogs/tiempos-atmosfericos",
    ).then((r) => r.json());
    const tiempoSelect = document.getElementById("tiempo");
    tiempos.forEach((t) => {
      const option = document.createElement("option");
      option.value = t.id_tiempo_atmosferico;
      option.textContent = t.tipo_tiempo_atmosferico;
      tiempoSelect.appendChild(option);
    });

    const pescas = await fetch(
      "/api/catalogs/tipos-pesca",
    ).then((r) => r.json());
    const pescaSelect = document.getElementById("tipo_pesca");
    pescas.forEach((p) => {
      const option = document.createElement("option");
      option.value = p.id_tipo_pesca;
      option.textContent = p.tipo_pesca;
      pescaSelect.appendChild(option);
    });

    const cebosNat = await fetch(
      "/api/catalogs/cebos-naturales",
    ).then((r) => r.json());
    const ceboNatSelect = document.getElementById("cebo_natural");
    cebosNat.forEach((c) => {
      const option = document.createElement("option");
      option.value = c.id_cebo_natural;
      option.textContent = c.tipo_cebo_natural;
      ceboNatSelect.appendChild(option);
    });

    const cebosArt = await fetch(
      "/api/catalogs/cebos-artificiales",
    ).then((r) => r.json());
    const ceboArtSelect = document.getElementById("cebo_artificial");
    cebosArt.forEach((c) => {
      const option = document.createElement("option");
      option.value = c.id_cebo_artificial;
      option.textContent = c.tipo_cebo_artificial;
      ceboArtSelect.appendChild(option);
    });
  } catch (err) {
    console.error("Error cargando catálogos:", err);
  }
}

// ============================================================
// FUNCIÓN: updateCatchesList()
// PROPÓSITO: Actualizar la lista visual de capturas añadidas en el formulario
// CUÁNDO SE EJECUTA: Cada vez que se añade o elimina una captura
// QUÉ HACE:
//   1. Si no hay capturas, muestra mensaje "No hay capturas"
//   2. Si hay capturas, genera HTML con la lista
//   3. Añade botones de eliminar (❌) para cada captura
//   4. Configura los eventos de clic para eliminar capturas
// ============================================================

function updateCatchesList() {
  const list = document.getElementById("catchesList");

  list.innerHTML = catchesArray
    .map(
      (c, index) => `
    <li>
      ${c.nombre_especie} - ${c.talla_cm}cm
      <button type="button" class="delete-catch" data-index="${index}" style="background:none; border:none; cursor:pointer; font-size:0.9rem; font-weight:bold; color:#ff0000; padding:2px 6px; margin:0; width:auto; display:inline-block; transition:color 0.2s ease;">✖</button>
    </li>
  `,
    )
    .join("");

  document.querySelectorAll(".delete-catch").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const index = parseInt(e.target.dataset.index);
      catchesArray.splice(index, 1);
      updateCatchesList();
    });
  });
}

// ============================================================
// FUNCIÓN: inicializarInsertarJornada()
// PROPÓSITO: Punto de entrada principal del módulo. Inicializa todo el formulario.
// CUÁNDO SE EJECUTA: Es llamada por control-frontend.js al iniciar la aplicación
// QUÉ HACE:
//   1. Carga los catálogos desde la API
//   2. Configura el botón "Añadir captura"
//   3. Configura el envío del formulario (POST a la API)
//   4. Configura el clic en el mapa para seleccionar ubicación
// ============================================================

// Función única que inicializa TODO
async function inicializarInsertarJornada() {
  if (insertarJornadaInicializado) return;
  insertarJornadaInicializado = true;

  console.log("📋 Inicializando formulario...");

  await loadCatalogs();

  await loadCatalogs();

  // ============================================================
  // EVENTO 1: Botón "Añadir captura" (addCatchBtn)
  // PROPÓSITO: Añadir una nueva captura a la lista
  // VALIDACIONES:
  //   - Que se haya seleccionado una especie
  //   - Que la talla sea un número positivo
  // ============================================================

  document.getElementById("addCatchBtn").addEventListener("click", () => {
    const especieSelect = document.getElementById("especie");
    const especieId = parseInt(especieSelect.value);
    const especieName =
      especieSelect.options[especieSelect.selectedIndex]?.text;
    const talla = parseInt(document.getElementById("talla").value);

    if (!especieId) {
      alert("Selecciona una especie");
      return;
    }

    if (!talla || talla <= 0) {
      alert("Introduce una talla válida");
      return;
    }

    catchesArray.push({
      id_especie: especieId,
      nombre_especie: especieName,
      talla_cm: talla,
    });

    updateCatchesList();
    especieSelect.value = "";
    document.getElementById("talla").value = "";
  });

  // ============================================================
  // EVENTO 2: Envío del formulario (fishingForm)
  // PROPÓSITO: Enviar los datos de la nueva jornada a la API
  // VALIDACIONES:
  //   - Ubicación seleccionada en el mapa
  //   - Datos obligatorios completos (pescador, fechas, horas)
  //   - Al menos una captura añadida
  // ============================================================
  // ============================================================
  // EVENTO 2: Envío del formulario (fishingForm)
  // PROPÓSITO: Enviar los datos de la nueva jornada a la API
  // VALIDACIONES:
  //   - Ubicación seleccionada en el mapa
  //   - Datos obligatorios completos (pescador, fechas, horas)
  //   - Al menos una captura añadida
  // ============================================================
  document
    .getElementById("fishingForm")
    .addEventListener("submit", async (e) => {
      e.preventDefault();

      if (!selectedCoordinates) {
        alert("Selecciona una ubicación en el mapa");
        return;
      }

      // Obtener el ID del usuario logueado
      let id_pescador = null;

      if (window.usuarioActual && window.usuarioActual.id) {
        id_pescador = window.usuarioActual.id;
      } else {
        alert("No hay usuario logueado");
        return;
      }

      // Asegurarse de que el usuario sea pescador o club validado
      if (
        window.usuarioActual.rol === "club" &&
        window.usuarioActual.validado !== true
      ) {
        alert("Club no validado. No puedes registrar jornadas.");
        return;
      }

      const fecha_inicio = document.getElementById("fecha_inicio").value;
      const hora_inicio = document.getElementById("hora_inicio").value;
      const hora_fin = document.getElementById("hora_fin").value;

      if (!id_pescador || !fecha_inicio || !hora_inicio || !hora_fin) {
        alert("Completa todos los datos obligatorios");
        return;
      }

      // OBTENER DATOS AMBIENTALES (incluye tipo_pesca, cebo_natural, cebo_artificial y notas)
      const ambientales = window.DatosAmbientales.obtener("");

      const datos = {
        id_pescador,
        fecha_inicio,
        hora_inicio,
        hora_fin,
        lat: selectedCoordinates.lat,
        lng: selectedCoordinates.lng,
        ...ambientales, // Esto incluye: id_habitat, id_tipo_lecho, algas_presente,
        // id_direccion_viento, id_velocidad_viento, id_altura_olas,
        // id_turbidez, id_tiempo_atmosferico, mar_fondo,
        // id_tipo_pesca, id_cebo_natural, id_cebo_artificial, notas
        capturas: catchesArray.map((c) => ({
          id_especie: c.id_especie,
          talla_cm: c.talla_cm,
        })),
      };

      try {
        const response = await fetch("/api/jornadas", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(datos),
        });

        if (!response.ok) throw new Error("Error al guardar");

        alert("Jornada registrada correctamente");
        await PuntosControl.refrescarPuntos(
          map,
          abrirModalJornada,
          abrirModalConcurso,
        );

        if (typeof aplicarFiltros === "function") aplicarFiltros();

        document.getElementById("fishingForm").reset();
        PuntosControl.eliminarMarcadorTemporal();
        selectedCoordinates = null;
        catchesArray = [];
        updateCatchesList();
        document.getElementById("submitBtn").disabled = true;
        document.getElementById("estadoCoordenada").innerHTML =
          "⚠️ Haz clic en el mapa para seleccionar ubicación";
        document.getElementById("estadoCoordenada").style.backgroundColor =
          "#f8d7da";
        document.getElementById("estadoCoordenada").style.color = "#721c24";
      } catch (err) {
        console.error(err);
        alert("Error al registrar la jornada");
      }
    });

  // ============================================================
  // EVENTO 3: Clic en el mapa
  // PROPÓSITO: Capturar la ubicación donde se realizó la jornada
  // QUÉ HACE:
  //   1. Guarda las coordenadas seleccionadas
  //   2. Crea un marcador temporal rojo en esa ubicación
  //   3. Habilita el botón de envío
  //   4. Actualiza el mensaje de estado
  // ============================================================

  map.on("click", (e) => {
    selectedCoordinates = e.latlng;
    PuntosControl.crearMarcadorTemporal(map, e.latlng);

    const estadoDiv = document.getElementById("estadoCoordenada");
    const submitBtn = document.getElementById("submitBtn");
    estadoDiv.innerHTML = "✅ Ubicación seleccionada para la jornada";
    estadoDiv.style.backgroundColor = "#d4edda";
    estadoDiv.style.color = "#155724";
    submitBtn.disabled = false;
  });
}

// ============================================================
// EXPORTACIÓN GLOBAL
// PROPÓSITO: Hacer disponible la función de inicialización para el orquestador
// La función window.inicializarInsertarJornada es llamada desde control-frontend.js
// ============================================================

window.inicializarInsertarJornada = inicializarInsertarJornada;
