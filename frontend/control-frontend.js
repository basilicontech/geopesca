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
  // MENÚ HAMBURGUESA - Versión CORREGIDA
  // ============================================

  // Forzar modo móvil para pruebas
  const esMovil = true;
  // const esMovil = window.innerWidth <= 768;  // Comentado para pruebas

  // Obtener elementos
  const btnNav = document.getElementById("menuNavBtn");
  const btnSecciones = document.getElementById("menuSeccionesBtn");
  const menuNav = document.getElementById("menuNavDesplegable");
  const menuSecciones = document.getElementById("menuSeccionesDesplegable");

  // Verificar que los elementos existen
  if (!btnNav || !btnSecciones || !menuNav || !menuSecciones) {
    console.warn("⚠️ Elementos del menú hamburguesa no encontrados");
    return;
  }

  // ============================================
  // FUNCIONES DEL MENÚ
  // ============================================

  function toggleMenu(btn, menu, otroMenu, otroBtn) {
    // Si el otro menú está abierto, lo cerramos
    if (otroMenu && otroMenu.classList.contains("abierto")) {
      otroMenu.classList.remove("abierto");
      if (otroBtn) otroBtn.classList.remove("activo");
    }
    // Alternar el menú actual
    menu.classList.toggle("abierto");
    btn.classList.toggle("activo");

    console.log(
      `Menú ${menu.id}: ${menu.classList.contains("abierto") ? "✅ abierto" : "❌ cerrado"}`,
    );
  }

  function cerrarMenus() {
    if (menuNav && menuNav.classList.contains("abierto")) {
      menuNav.classList.remove("abierto");
      if (btnNav) btnNav.classList.remove("activo");
    }
    if (menuSecciones && menuSecciones.classList.contains("abierto")) {
      menuSecciones.classList.remove("abierto");
      if (btnSecciones) btnSecciones.classList.remove("activo");
    }
  }

  function ocultarTodasSecciones() {
    const filtros = document.querySelector(".filtros-contenedor");
    const formulario = document.querySelector(".columna-derecha");
    const mapa = document.querySelector(".columna-centro");

    if (filtros) filtros.classList.remove("mostrar");
    if (formulario) formulario.classList.remove("mostrar");
    if (mapa) {
      mapa.style.display = "block";
      mapa.style.width = "100%";
    }
  }

  // ============================================
  // EVENTOS - SOLO EN MÓVIL
  // ============================================

  if (esMovil) {
    console.log("📱 Modo móvil activado - Menú hamburguesa disponible");

    // Evento para el botón de navegación (izquierdo)
    btnNav.addEventListener("click", function (e) {
      e.stopPropagation();
      toggleMenu(btnNav, menuNav, menuSecciones, btnSecciones);
    });

    // Evento para el botón de secciones (derecho)
    btnSecciones.addEventListener("click", function (e) {
      e.stopPropagation();
      toggleMenu(btnSecciones, menuSecciones, menuNav, btnNav);
    });

    // Soporte táctil para dispositivos móviles
    btnNav.addEventListener(
      "touchstart",
      function (e) {
        e.preventDefault();
        e.stopPropagation();
        toggleMenu(btnNav, menuNav, menuSecciones, btnSecciones);
      },
      { passive: false },
    );

    btnSecciones.addEventListener(
      "touchstart",
      function (e) {
        e.preventDefault();
        e.stopPropagation();
        toggleMenu(btnSecciones, menuSecciones, menuNav, btnNav);
      },
      { passive: false },
    );

    // Cerrar menús al hacer clic fuera
    document.addEventListener("click", function (e) {
      const clicEnNavBtn = btnNav.contains(e.target);
      const clicEnSeccionesBtn = btnSecciones.contains(e.target);
      const clicEnNavMenu = menuNav.contains(e.target);
      const clicEnSeccionesMenu = menuSecciones.contains(e.target);

      if (
        !clicEnNavBtn &&
        !clicEnSeccionesBtn &&
        !clicEnNavMenu &&
        !clicEnSeccionesMenu
      ) {
        cerrarMenus();
      }
    });

    // Cerrar menús con tecla ESC
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        cerrarMenus();
      }
    });

    // ============================================
    // BOTONES DE SECCIÓN
    // ============================================

    const btnFiltros = document.getElementById("btnMostrarFiltros");
    const btnMapa = document.getElementById("btnMostrarMapa");
    const btnFormulario = document.getElementById("btnMostrarFormulario");

    if (btnFiltros) {
      btnFiltros.addEventListener("click", function () {
        const filtros = document.querySelector(".filtros-contenedor");
        const formulario = document.querySelector(".columna-derecha");
        const mapa = document.querySelector(".columna-centro");

        if (formulario) formulario.classList.remove("mostrar");
        if (mapa) mapa.style.display = "none";

        if (filtros) {
          filtros.classList.toggle("mostrar");
          if (filtros.classList.contains("mostrar")) {
            setTimeout(() => {
              filtros.scrollIntoView({ behavior: "smooth" });
            }, 100);
          }
        }
        cerrarMenus();
      });
    }

    if (btnMapa) {
      btnMapa.addEventListener("click", function () {
        ocultarTodasSecciones();
        const mapa = document.getElementById("map");
        if (mapa) {
          setTimeout(() => {
            mapa.scrollIntoView({ behavior: "smooth" });
          }, 100);
        }
        cerrarMenus();
      });
    }

    if (btnFormulario) {
      btnFormulario.addEventListener("click", function () {
        const formulario = document.querySelector(".columna-derecha");
        const filtros = document.querySelector(".filtros-contenedor");
        const mapa = document.querySelector(".columna-centro");

        if (filtros) filtros.classList.remove("mostrar");
        if (mapa) mapa.style.display = "none";

        if (formulario) {
          formulario.classList.toggle("mostrar");
          if (formulario.classList.contains("mostrar")) {
            setTimeout(() => {
              formulario.scrollIntoView({ behavior: "smooth" });
            }, 100);
          }
        }
        cerrarMenus();
      });
    }

    // Estado inicial en móvil
    ocultarTodasSecciones();
    cerrarMenus();
  } else {
    // En desktop, aseguramos que los menús estén ocultos
    cerrarMenus();
    console.log("💻 Modo desktop - Menú hamburguesa oculto");
  }

  // ============================================
  // RE-DIBUJAR AL CAMBIAR TAMAÑO DE PANTALLA
  // ============================================

  window.addEventListener("resize", function () {
    const esAhoraMovil = window.innerWidth <= 768;
    const mapa = document.querySelector(".columna-centro");
    const filtros = document.querySelector(".filtros-contenedor");
    const formulario = document.querySelector(".columna-derecha");

    if (esAhoraMovil) {
      // Modo móvil
      if (
        mapa &&
        !filtros?.classList.contains("mostrar") &&
        !formulario?.classList.contains("mostrar")
      ) {
        mapa.style.display = "block";
        mapa.style.width = "100%";
      }
      // Asegurar que los menús estén ocultos al cambiar a móvil
      cerrarMenus();
    } else {
      // Modo desktop
      if (mapa) {
        mapa.style.display = "block";
        mapa.style.width = "50%";
      }
      if (filtros) filtros.style.display = "block";
      if (formulario) formulario.style.display = "block";
      cerrarMenus();
    }
  });

  console.log("✅ Control Frontend inicializado");
}

// ============================================
// INICIALIZACIÓN
// ============================================

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
