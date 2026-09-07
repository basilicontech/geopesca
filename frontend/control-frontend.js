// control-frontend.js - Orquestador principal

async function init() {
  console.log("🎣 Iniciando Control Frontend...");

  if (typeof map === "undefined") {
    console.error("❌ Error: map.js no ha cargado el mapa");
    return;
  }

  if (typeof PuntosControl !== "undefined") {
    await PuntosControl.cargarPuntosPescadores(map, abrirModalJornada);
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

  const estadoDiv = document.getElementById("estadoCoordenada");
  if (estadoDiv) {
    estadoDiv.innerHTML = "🔍 Aplica filtros para ver las jornadas de pesca";
    estadoDiv.style.backgroundColor = "#d1ecf1";
    estadoDiv.style.color = "#0c5460";
  }

  // ============================================
  // MENÚ HAMBURGUESA
  // ============================================

  const btnNav = document.getElementById("menuNavBtn");
  const btnSecciones = document.getElementById("menuSeccionesBtn");
  const menuNav = document.getElementById("menuNavDesplegable");
  const menuSecciones = document.getElementById("menuSeccionesDesplegable");

  // Solo si existen los elementos
  if (btnNav && menuNav) {
    btnNav.addEventListener("click", function(e) {
      e.stopPropagation();
      menuNav.classList.toggle("abierto");
      btnNav.classList.toggle("activo");
      if (menuSecciones && menuSecciones.classList.contains("abierto")) {
        menuSecciones.classList.remove("abierto");
        if (btnSecciones) btnSecciones.classList.remove("activo");
      }
    });
  }

  if (btnSecciones && menuSecciones) {
    btnSecciones.addEventListener("click", function(e) {
      e.stopPropagation();
      menuSecciones.classList.toggle("abierto");
      btnSecciones.classList.toggle("activo");
      if (menuNav && menuNav.classList.contains("abierto")) {
        menuNav.classList.remove("abierto");
        if (btnNav) btnNav.classList.remove("activo");
      }
    });
  }

  // Cerrar al hacer clic fuera
  document.addEventListener("click", function(e) {
    if (menuNav && menuNav.classList.contains("abierto") && !menuNav.contains(e.target) && !btnNav.contains(e.target)) {
      menuNav.classList.remove("abierto");
      if (btnNav) btnNav.classList.remove("activo");
    }
    if (menuSecciones && menuSecciones.classList.contains("abierto") && !menuSecciones.contains(e.target) && !btnSecciones.contains(e.target)) {
      menuSecciones.classList.remove("abierto");
      if (btnSecciones) btnSecciones.classList.remove("activo");
    }
  });

  // Botones de secciones
  const btnFiltros = document.getElementById("btnMostrarFiltros");
  const btnMapa = document.getElementById("btnMostrarMapa");
  const btnFormulario = document.getElementById("btnMostrarFormulario");

  if (btnFiltros) {
    btnFiltros.addEventListener("click", function() {
      const filtros = document.querySelector(".filtros-contenedor");
      const formulario = document.querySelector(".columna-derecha");
      const mapa = document.querySelector(".columna-centro");
      if (formulario) formulario.classList.remove("mostrar");
      if (mapa) mapa.style.display = "none";
      if (filtros) {
        filtros.classList.toggle("mostrar");
        if (filtros.classList.contains("mostrar")) {
          setTimeout(() => { filtros.scrollIntoView({ behavior: "smooth" }); }, 100);
        }
      }
      if (menuSecciones) {
        menuSecciones.classList.remove("abierto");
        if (btnSecciones) btnSecciones.classList.remove("activo");
      }
    });
  }

  if (btnMapa) {
    btnMapa.addEventListener("click", function() {
      const filtros = document.querySelector(".filtros-contenedor");
      const formulario = document.querySelector(".columna-derecha");
      const mapa = document.querySelector(".columna-centro");
      if (filtros) filtros.classList.remove("mostrar");
      if (formulario) formulario.classList.remove("mostrar");
      if (mapa) {
        mapa.style.display = "block";
        mapa.style.width = "100%";
        setTimeout(() => { mapa.scrollIntoView({ behavior: "smooth" }); }, 100);
      }
      if (menuSecciones) {
        menuSecciones.classList.remove("abierto");
        if (btnSecciones) btnSecciones.classList.remove("activo");
      }
    });
  }

  if (btnFormulario) {
    btnFormulario.addEventListener("click", function() {
      const formulario = document.querySelector(".columna-derecha");
      const filtros = document.querySelector(".filtros-contenedor");
      const mapa = document.querySelector(".columna-centro");
      if (filtros) filtros.classList.remove("mostrar");
      if (mapa) mapa.style.display = "none";
      if (formulario) {
        formulario.classList.toggle("mostrar");
        if (formulario.classList.contains("mostrar")) {
          setTimeout(() => { formulario.scrollIntoView({ behavior: "smooth" }); }, 100);
        }
      }
      if (menuSecciones) {
        menuSecciones.classList.remove("abierto");
        if (btnSecciones) btnSecciones.classList.remove("activo");
      }
    });
  }

  // En móvil: ocultar filtros y formulario, mostrar mapa
  if (window.innerWidth <= 768) {
    const mapa = document.querySelector(".columna-centro");
    const filtros = document.querySelector(".filtros-contenedor");
    const formulario = document.querySelector(".columna-derecha");
    if (filtros) filtros.classList.remove("mostrar");
    if (formulario) formulario.classList.remove("mostrar");
    if (mapa) {
      mapa.style.display = "block";
      mapa.style.width = "100%";
    }
  }

  console.log("✅ Control Frontend inicializado");
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}