// control-frontend.js - Orquestador principal

// Variables globales para el menú hamburguesa
let esMovil = false;
let btnNav, btnSecciones, menuNav, menuSecciones;

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
  // MENÚ HAMBURGUESA - Inicializar
  // ============================================

  inicializarMenuHamburguesa();
}

// ============================================
// FUNCIÓN: inicializarMenuHamburguesa()
// ============================================

function inicializarMenuHamburguesa() {
  // Obtener elementos
  btnNav = document.getElementById("menuNavBtn");
  btnSecciones = document.getElementById("menuSeccionesBtn");
  menuNav = document.getElementById("menuNavDesplegable");
  menuSecciones = document.getElementById("menuSeccionesDesplegable");

  // Verificar que los elementos existen
  if (!btnNav || !btnSecciones || !menuNav || !menuSecciones) {
    console.warn("⚠️ Elementos del menú hamburguesa no encontrados");
    return;
  }

  // ============================================
  // FUNCIONES DEL MENÚ
  // ============================================

  window.toggleMenu = function (btn, menu, otroMenu, otroBtn) {
    if (otroMenu && otroMenu.classList.contains("abierto")) {
      otroMenu.classList.remove("abierto");
      if (otroBtn) otroBtn.classList.remove("activo");
    }
    menu.classList.toggle("abierto");
    btn.classList.toggle("activo");
    console.log(
      `Menú ${menu.id}: ${menu.classList.contains("abierto") ? "✅ abierto" : "❌ cerrado"}`,
    );
  };

  window.cerrarMenus = function () {
    if (menuNav && menuNav.classList.contains("abierto")) {
      menuNav.classList.remove("abierto");
      if (btnNav) btnNav.classList.remove("activo");
    }
    if (menuSecciones && menuSecciones.classList.contains("abierto")) {
      menuSecciones.classList.remove("abierto");
      if (btnSecciones) btnSecciones.classList.remove("activo");
    }
  };

  function ocultarTodasSecciones() {
    const filtros = document.querySelector(".filtros-contenedor");
    const formulario = document.querySelector(".columna-derecha");
    const mapa = document.querySelector(".columna-centro");

    // Ocultar filtros y formulario
    if (filtros) {
      filtros.classList.remove("mostrar");
      filtros.style.display = "none"; // <-- Forzar ocultación
    }
    if (formulario) {
      formulario.classList.remove("mostrar");
      formulario.style.display = "none"; // <-- Forzar ocultación
    }

    // Mostrar solo el mapa
    if (mapa) {
      mapa.style.display = "block";
      mapa.style.width = "100%";
    }
  }

  // ============================================
  // DETECCIÓN DINÁMICA DE MÓVIL
  // ============================================

  function actualizarModoMovil() {
    const ahoraMovil = window.innerWidth <= 768;
    if (ahoraMovil !== esMovil) {
      esMovil = ahoraMovil;
      if (esMovil) {
        console.log("📱 Cambio a modo móvil");
        window.cerrarMenus();
        ocultarTodasSecciones();
      } else {
        console.log("💻 Cambio a modo desktop");
        // Restaurar layout de escritorio
        const mapa = document.querySelector(".columna-centro");
        const filtros = document.querySelector(".filtros-contenedor");
        const formulario = document.querySelector(".columna-derecha");
        if (mapa) {
          mapa.style.display = "block";
          mapa.style.width = "50%";
        }
        if (filtros) filtros.style.display = "block";
        if (formulario) formulario.style.display = "block";
        window.cerrarMenus();
      }
    }
  }

  // Establecer estado inicial
  esMovil = window.innerWidth <= 768;

  // Escuchar cambios de tamaño
  window.addEventListener("resize", actualizarModoMovil);

  // ============================================
  // CONFIGURAR EVENTOS
  // ============================================

  // Botón de navegación (izquierdo)
  btnNav.addEventListener("click", function (e) {
    e.stopPropagation();
    if (esMovil) {
      window.toggleMenu(btnNav, menuNav, menuSecciones, btnSecciones);
    }
  });

  // Botón de secciones (derecho)
  btnSecciones.addEventListener("click", function (e) {
    e.stopPropagation();
    if (esMovil) {
      window.toggleMenu(btnSecciones, menuSecciones, menuNav, btnNav);
    }
  });

  // Soporte táctil
  btnNav.addEventListener(
    "touchstart",
    function (e) {
      e.preventDefault();
      e.stopPropagation();
      if (esMovil) {
        window.toggleMenu(btnNav, menuNav, menuSecciones, btnSecciones);
      }
    },
    { passive: false },
  );

  btnSecciones.addEventListener(
    "touchstart",
    function (e) {
      e.preventDefault();
      e.stopPropagation();
      if (esMovil) {
        window.toggleMenu(btnSecciones, menuSecciones, menuNav, btnNav);
      }
    },
    { passive: false },
  );

  // Cerrar menús al hacer clic fuera (solo en móvil)
  document.addEventListener("click", function (e) {
    if (!esMovil) return;
    const clicEnNavBtn = btnNav && btnNav.contains(e.target);
    const clicEnSeccionesBtn = btnSecciones && btnSecciones.contains(e.target);
    const clicEnNavMenu = menuNav && menuNav.contains(e.target);
    const clicEnSeccionesMenu =
      menuSecciones && menuSecciones.contains(e.target);

    if (
      !clicEnNavBtn &&
      !clicEnSeccionesBtn &&
      !clicEnNavMenu &&
      !clicEnSeccionesMenu
    ) {
      window.cerrarMenus();
    }
  });

  // Cerrar menús con tecla ESC (solo en móvil)
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && esMovil) {
      window.cerrarMenus();
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
      if (!esMovil) return;
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
      window.cerrarMenus();
    });
  }

  if (btnMapa) {
    btnMapa.addEventListener("click", function () {
      if (!esMovil) return;
      ocultarTodasSecciones();
      const mapa = document.getElementById("map");
      if (mapa) {
        setTimeout(() => {
          mapa.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
      window.cerrarMenus();
    });
  }

  if (btnFormulario) {
    btnFormulario.addEventListener("click", function () {
      if (!esMovil) return;
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
      window.cerrarMenus();
    });
  }

  // ============================================
  // CONFIGURAR BOTONES DEL MENÚ DESPLEGABLE
  // ============================================

  configurarBotonesMenuDesplegable();

  // ============================================
  // ESTADO INICIAL
  // ============================================

  if (esMovil) {
    console.log("📱 Modo móvil activado - Menú hamburguesa disponible");
    ocultarTodasSecciones();
    window.cerrarMenus();
  } else {
    console.log("💻 Modo desktop - Menú hamburguesa oculto");
    window.cerrarMenus();
  }
}

// ============================================
// FUNCIÓN: configurarBotonesMenuDesplegable()
// ============================================

function configurarBotonesMenuDesplegable() {
  const btnAcercaMobile = document.getElementById("btnAcercaMobile");
  const btnComoFuncionaMobile = document.getElementById(
    "btnComoFuncionaMobile",
  );
  const btnBlogMobile = document.getElementById("btnBlogMobile");
  const btnForoMobile = document.getElementById("btnForoMobile");

  if (btnAcercaMobile) {
    btnAcercaMobile.addEventListener("click", function () {
      if (typeof window.cerrarMenus === "function") window.cerrarMenus();
      if (typeof abrirAcercaDe === "function") abrirAcercaDe();
    });
  }

  if (btnComoFuncionaMobile) {
    btnComoFuncionaMobile.addEventListener("click", function () {
      if (typeof window.cerrarMenus === "function") window.cerrarMenus();
      if (typeof abrirComoFunciona === "function") abrirComoFunciona();
    });
  }

  if (btnBlogMobile) {
    btnBlogMobile.addEventListener("click", function () {
      if (typeof window.cerrarMenus === "function") window.cerrarMenus();
      window.open("https://blog.geopesca.com", "_blank");
    });
  }

  if (btnForoMobile) {
    btnForoMobile.addEventListener("click", function () {
      if (typeof window.cerrarMenus === "function") window.cerrarMenus();
      window.open("https://foro.geopesca.com", "_blank");
    });
  }
}

// ============================================
// INICIALIZACIÓN
// ============================================

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
