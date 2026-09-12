// insertar-concurso.js
// Módulo encargado de la gestión del formulario de registro de concursos

let concursoSelectedCoordinates = null;
let concursoCatchesArray = [];
let insertarConcursoInicializado = false;

async function loadConcursoCatalogs() {
  try {
    // Especies
    const especies = await fetch(
      "/api/catalogs/especies",
    ).then((r) => r.json());
    const especieSelect = document.getElementById("concurso_especie");
    especies.forEach((e) => {
      const option = document.createElement("option");
      option.value = e.id_especie;
      option.textContent = e.nombre_especie;
      especieSelect.appendChild(option);
    });
  } catch (err) {
    console.error("Error cargando catálogos de concurso:", err);
  }
}

function updateConcursoCatchesList() {
  const list = document.getElementById("concursoCatchesList");
  if (concursoCatchesArray.length === 0) {
    list.innerHTML = "<li><em>No hay capturas</em></li>";
    return;
  }

  list.innerHTML = concursoCatchesArray
    .map(
      (c, index) => `
    <li>
      ${c.nombre_especie} - ${c.num_ejemplares || 0} ejemplares - ${c.peso_total || 0}kg - Mayor: ${c.pieza_mayor || 0}kg
      <button type="button" class="delete-concurso-catch" data-index="${index}" style="background:none; border:none; cursor:pointer; font-size:0.9rem; font-weight:bold; color:#ff0000; padding:2px 6px; margin:0; width:auto; display:inline-block; transition:color 0.2s ease;">✖</button>
    </li>
  `,
    )
    .join("");

  document.querySelectorAll(".delete-concurso-catch").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const index = parseInt(e.target.dataset.index);
      concursoCatchesArray.splice(index, 1);
      updateConcursoCatchesList();
    });
  });
}

function validarConcursoFechas() {
  const fechaInicio = document.getElementById("concurso_fecha_inicio").value;
  const fechaFin = document.getElementById("concurso_fecha_fin").value;
  const horaInicio = document.getElementById("concurso_hora_inicio").value;
  const horaFin = document.getElementById("concurso_hora_fin").value;
  const submitBtn = document.getElementById("concursoSubmitBtn");
  const estadoDiv = document.getElementById("concursoEstadoCoordenada");

  // Si no hay coordenadas, no habilitar
  if (!concursoSelectedCoordinates) {
    submitBtn.disabled = true;
    return false;
  }

  // Si faltan datos, no validar
  if (!fechaInicio || !fechaFin || !horaInicio || !horaFin) {
    submitBtn.disabled = true;
    return false;
  }

  const fechaInicioObj = new Date(fechaInicio);
  const fechaFinObj = new Date(fechaFin);

  // Validar: fecha inicio <= fecha fin
  if (fechaInicioObj > fechaFinObj) {
    estadoDiv.innerHTML =
      "❌ La fecha de inicio no puede ser posterior a la fecha de fin";
    estadoDiv.style.backgroundColor = "#f8d7da";
    estadoDiv.style.color = "#721c24";
    submitBtn.disabled = true;
    return false;
  }

  // Validar: si misma fecha, hora inicio < hora fin
  if (fechaInicio === fechaFin) {
    const horaInicioObj = new Date(`2000-01-01T${horaInicio}`);
    const horaFinObj = new Date(`2000-01-01T${horaFin}`);

    if (horaInicioObj >= horaFinObj) {
      estadoDiv.innerHTML =
        "❌ La hora de inicio debe ser anterior a la hora de fin";
      estadoDiv.style.backgroundColor = "#f8d7da";
      estadoDiv.style.color = "#721c24";
      submitBtn.disabled = true;
      return false;
    }
  }

  // Validación pasada
  estadoDiv.innerHTML = "✅ Ubicación y fechas válidas";
  estadoDiv.style.backgroundColor = "#d4edda";
  estadoDiv.style.color = "#155724";
  submitBtn.disabled = false;
  return true;
}

async function inicializarInsertarConcurso() {
  if (insertarConcursoInicializado) return;
  insertarConcursoInicializado = true;

  console.log("🏆 Inicializando formulario de concurso...");

  // Verificar que DatosAmbientales esté disponible
  if (typeof window.DatosAmbientales === "undefined") {
    console.error("❌ window.DatosAmbientales no está definido");
    alert(
      "Error: El módulo de datos ambientales no se ha cargado correctamente",
    );
    return;
  }

  await loadConcursoCatalogs();

  // Cargar datos ambientales para concurso
  const container = document.getElementById(
    "datosAmbientalesContainerConcurso",
  );
  if (container) {
    container.innerHTML = window.DatosAmbientales.generarHTML("concurso_");
    await window.DatosAmbientales.cargar("concurso_");
  }

  // Añadir captura de concurso
  document
    .getElementById("addConcursoCatchBtn")
    .addEventListener("click", () => {
      const especieSelect = document.getElementById("concurso_especie");
      const especieId = parseInt(especieSelect.value);
      const especieName =
        especieSelect.options[especieSelect.selectedIndex]?.text;
      const numEjemplares =
        parseInt(document.getElementById("concurso_num_ejemplares").value) || 0;
      const pesoTotal =
        parseFloat(document.getElementById("concurso_peso_total").value) || 0;
      const piezaMayor =
        parseFloat(document.getElementById("concurso_pieza_mayor").value) || 0;

      if (!especieId) {
        alert("Selecciona una especie");
        return;
      }

      if (numEjemplares === 0 && pesoTotal === 0) {
        alert("Introduce al menos número de ejemplares o peso total");
        return;
      }

      concursoCatchesArray.push({
        id_especie: especieId,
        nombre_especie: especieName,
        num_ejemplares: numEjemplares,
        peso_total: pesoTotal,
        pieza_mayor: piezaMayor,
      });

      updateConcursoCatchesList();
      especieSelect.value = "";
      document.getElementById("concurso_num_ejemplares").value = "";
      document.getElementById("concurso_peso_total").value = "";
      document.getElementById("concurso_pieza_mayor").value = "";
    });

  // Envío del formulario de concurso
  document
    .getElementById("concursoForm")
    .addEventListener("submit", async (e) => {
      e.preventDefault();

      console.log("📝 Enviando formulario de concurso...");
      console.log("Usuario actual:", window.usuarioActual);

      if (!concursoSelectedCoordinates) {
        alert("Selecciona una ubicación en el mapa");
        return;
      }

      const nombre = document.getElementById("concurso_nombre").value;
      const descripcion = document.getElementById("concurso_descripcion").value;
      const fecha_inicio = document.getElementById(
        "concurso_fecha_inicio",
      ).value;
      const fecha_fin = document.getElementById("concurso_fecha_fin").value;
      const hora_inicio = document.getElementById("concurso_hora_inicio").value;
      const hora_fin = document.getElementById("concurso_hora_fin").value;
      const num_participantes =
        parseInt(document.getElementById("concurso_num_participantes").value) ||
        0;
      const nombre_ganador = document.getElementById(
        "concurso_nombre_ganador",
      ).value;

      if (!nombre || !fecha_inicio || !fecha_fin || !hora_inicio || !hora_fin) {
        alert("Completa todos los datos obligatorios");
        return;
      }

      // OBTENER DATOS AMBIENTALES (solo los generales, sin tipo_pesca, cebo_natural, cebo_artificial, notas)
      const ambientales = window.DatosAmbientales.obtener("concurso_");
      console.log("Datos ambientales:", ambientales);

      const datos = {
        id_club_organizador: window.usuarioActual.id,
        nombre_concurso: nombre,
        descripcion: descripcion || null,
        fecha_inicio: fecha_inicio,
        fecha_fin: fecha_fin,
        hora_inicio: hora_inicio,
        hora_fin: hora_fin,
        lat: concursoSelectedCoordinates.lat,
        lng: concursoSelectedCoordinates.lng,
        num_participantes: num_participantes,
        nombre_ganador: nombre_ganador || null,
        ...ambientales,
        capturas: concursoCatchesArray.map((c) => ({
          id_especie: c.id_especie,
          num_ejemplares: c.num_ejemplares,
          peso_total_kg: c.peso_total,
          pieza_mayor_kg: c.pieza_mayor,
        })),
      };

      console.log("Datos a enviar:", JSON.stringify(datos, null, 2));

      try {
        const response = await fetch("/api/concursos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(datos),
        });

        console.log("Respuesta del servidor - Status:", response.status);

        const responseData = await response.json();
        console.log("Respuesta del servidor - Data:", responseData);

        if (!response.ok) {
          throw new Error(
            responseData.error || responseData.message || "Error al guardar",
          );
        }

        alert("Concurso registrado correctamente");

        // Resetear formulario
        document.getElementById("concursoForm").reset();
        concursoCatchesArray = [];
        updateConcursoCatchesList();
        concursoSelectedCoordinates = null;
        document.getElementById("concursoSubmitBtn").disabled = true;
        document.getElementById("concursoEstadoCoordenada").innerHTML =
          "⚠️ Haz clic en el mapa para seleccionar ubicación";
        document.getElementById(
          "concursoEstadoCoordenada",
        ).style.backgroundColor = "#f8d7da";
        document.getElementById("concursoEstadoCoordenada").style.color =
          "#721c24";

        // Eliminar marcador temporal
        if (
          typeof PuntosControl !== "undefined" &&
          PuntosControl.eliminarMarcadorTemporal
        ) {
          PuntosControl.eliminarMarcadorTemporal();
        }

        if (typeof PuntosControl !== "undefined") {
          await PuntosControl.refrescarPuntos(
            map,
            abrirModalJornada,
            abrirModalConcurso,
          );
          if (typeof aplicarFiltros === "function") aplicarFiltros();
        }
      } catch (err) {
        console.error("Error completo:", err);
        alert("Error al registrar el concurso: " + err.message);
      }
    });

    // Clic en el mapa para concurso
  map.on("click", (e) => {
    concursoSelectedCoordinates = e.latlng;
    if (
      typeof PuntosControl !== "undefined" &&
      PuntosControl.crearMarcadorTemporal
    ) {
      PuntosControl.crearMarcadorTemporal(map, e.latlng);
    }

    // ✅ CAMBIO: llamar a validación en lugar de habilitar directamente
    validarConcursoFechas();
  });
}

window.inicializarInsertarConcurso = inicializarInsertarConcurso;
