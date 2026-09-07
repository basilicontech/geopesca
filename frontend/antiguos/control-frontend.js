// control-frontend.js - Orquestador principal

async function init() {
  console.log("🎣 Iniciando Control Frontend...");

  if (typeof map === "undefined") {
    console.error("❌ Error: map.js no ha cargado el mapa");
    return;
  }

  if (typeof PuntosControl !== "undefined") {
    // Cargar puntos de pescadores (usando abrirModalJornada)
    await PuntosControl.cargarPuntosPescadores(map, abrirModalJornada);
    // Cargar puntos de concursos (usando abrirModalConcurso)
    await PuntosControl.cargarPuntosConcursos(map, abrirModalConcurso);
  }

  if (
    window.usuarioActual &&
    typeof inicializarInsertarJornada === "function" &&
    (window.usuarioActual.rol === "pescador" ||
      (window.usuarioActual.rol === "club" &&
        window.usuarioActual.validado === true))
  ) {
    if (window.usuarioActual.rol === "pescador") {
      await inicializarInsertarJornada();
    } else if (typeof inicializarInsertarConcurso === "function") {
      await inicializarInsertarConcurso();
    }
  }

  if (typeof inicializarModal === "function") {
    inicializarModal();
  }

  if (typeof inicializarFiltros === "function") {
    await inicializarFiltros();
  }

  // Actualizar mensaje de estado
  const estadoDiv = document.getElementById("estadoCoordenada");
  if (estadoDiv) {
    estadoDiv.innerHTML = "🔍 Aplica filtros para ver las jornadas de pesca";
    estadoDiv.style.backgroundColor = "#d1ecf1";
    estadoDiv.style.color = "#0c5460";
  }

  console.log(
    "✅ Control Frontend inicializado - Sin puntos visibles hasta aplicar filtros",
  );
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}