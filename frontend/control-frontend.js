// control-frontend.js - Orquestador principal

// Variables globales para el menú hamburguesa
let esMovil = false;
let btnNav, btnSecciones, menuNav, menuSecciones;

// Estado global del panel de formulario (para reevaluar el botón al hacer login)
window._panelFormularioAbierto = false;

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
  // INICIALIZAR COMPONENTES
  // ============================================

  inicializarMenuHamburguesa();
  inicializarBotonesAccionMapa();
  inicializarBotonUbicacion();
  inicializarBotonVolverFormulario();
  observarCambiosSesion();
}

// ============================================
// HELPER: mostrar/ocultar el botón "Insertar ubicación"
// ============================================

function actualizarBotonUbicacion(mostrar) {
  const btn = document.getElementById("btnInsertarUbicacion");
  if (!btn) return;

  const esMovilAhora = window.innerWidth <= 768;

  const usuarioValido =
    window.usuarioActual &&
    (window.usuarioActual.rol === "pescador" ||
      window.usuarioActual.rol === "club");

  const debeMostrarse = mostrar && esMovilAhora && usuarioValido;
  btn.style.display = debeMostrarse ? "inline-block" : "none";

  window._panelFormularioAbierto = !!mostrar;
}

// ============================================
// HELPER: mostrar/ocultar el botón flotante
// "Volver al formulario" sobre el mapa
// ============================================

function actualizarBotonVolverFormulario(mostrar) {
  const btn = document.getElementById("btnVolverFormulario");
  if (!btn) return;

  const esMovilAhora = window.innerWidth <= 768;

  const usuarioValido =
    window.usuarioActual &&
    (window.usuarioActual.rol === "pescador" ||
      window.usuarioActual.rol === "club");

  const debeMostrarse = mostrar && esMovilAhora && usuarioValido;
  btn.style.display = debeMostrarse ? "inline-block" : "none";
}

// ============================================
// ACCIÓN GLOBAL: ocultarTodasSecciones()
// Oculta filtros y formulario, y muestra el mapa
// a pantalla completa. Reutilizable desde cualquier sitio.
// ============================================

function ocultarTodasSecciones() {
  const filtros = document.querySelector(".filtros-contenedor");
  const formulario = document.querySelector(".columna-derecha");
  const mapa = document.querySelector(".columna-centro");

  if (filtros) {
    filtros.classList.remove("mostrar");
    filtros.style.display = "none";
  }
  if (formulario) {
    formulario.classList.remove("mostrar");
    formulario.style.display = "none";
  }
  if (mapa) {
    mapa.style.display = "block";
    mapa.style.width = "100%";
    if (typeof map !== "undefined" && map) {
      setTimeout(function () {
        map.invalidateSize();
      }, 100);
    }
  }

  actualizarBotonUbicacion(false);
}

// ============================================
// ACCIÓN GLOBAL: accionMostrarMapa(origen)
// Toda la lógica de "mostrar solo el mapa" en un único sitio.
// La pueden llamar cualquier botón o atajo de teclado.
// ============================================

function accionMostrarMapa(origen) {
  console.log(`🗺️ Mostrando mapa (origen: ${origen || "desconocido"})`);

  ocultarTodasSecciones();

  if (typeof map !== "undefined" && map) {
    setTimeout(function () {
      map.invalidateSize();
    }, 300);
  }

  // Mostrar el botón flotante "Volver al formulario"
  actualizarBotonVolverFormulario(true);

  if (typeof window.cerrarMenus === "function") {
    window.cerrarMenus();
  }
}

// ============================================
// ACCIÓN GLOBAL: accionMostrarFormulario()
// Muestra el panel derecho (formulario) y oculta filtros y mapa.
// ============================================

function accionMostrarFormulario() {
  console.log("📝 Mostrando formulario");

  const formulario = document.querySelector(".columna-derecha");
  const filtros = document.querySelector(".filtros-contenedor");
  const mapa = document.querySelector(".columna-centro");

  // Ocultar filtros
  if (filtros) {
    filtros.classList.remove("mostrar");
    filtros.style.display = "none";
  }

  // Ocultar mapa
  if (mapa) mapa.style.display = "none";

  // Mostrar formulario
  if (formulario) {
    formulario.classList.add("mostrar");
    formulario.style.display = "block";
    actualizarBotonUbicacion(true);
    if (typeof map !== "undefined" && map) {
      setTimeout(function () {
        map.invalidateSize();
      }, 300);
    }
  }

  // Ocultar el botón flotante (ya no estamos viendo el mapa)
  actualizarBotonVolverFormulario(false);

  if (typeof window.cerrarMenus === "function") {
    window.cerrarMenus();
  }
}

// ============================================
// INICIALIZAR: botones con clase .btn-accion-mapa
// ============================================

function inicializarBotonesAccionMapa() {
  const botones = document.querySelectorAll(".btn-accion-mapa");

  if (botones.length === 0) {
    console.warn("⚠️ No se encontraron botones .btn-accion-mapa");
    return;
  }

  botones.forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      if (!esMovil) return;
      accionMostrarMapa(btn.id || "anónimo");
    });
  });

  console.log(`✅ ${botones.length} botones .btn-accion-mapa inicializados`);
}

// ============================================
// INICIALIZAR: botón "Insertar ubicación"
// ============================================

function inicializarBotonUbicacion() {
  const btn = document.getElementById("btnInsertarUbicacion");
  if (!btn) {
    console.warn("⚠️ Botón 'Insertar ubicación' no encontrado");
    return;
  }

  btn.addEventListener("click", function (e) {
    e.preventDefault();
    console.log("📍 Insertar ubicación → validando sesión...");

    const usuarioValido =
      window.usuarioActual &&
      (window.usuarioActual.rol === "pescador" ||
        window.usuarioActual.rol === "club");

    if (!usuarioValido) {
      alert(
        "Debes iniciar sesión como pescador o club para usar esta función.",
      );
      return;
    }

    // Reutiliza la acción común
    accionMostrarMapa("btnInsertarUbicacion");

    console.log(
      "🗺️ Mapa abierto: haz clic en el mapa para marcar tu ubicación",
    );
  });
}

// ============================================
// INICIALIZAR: botón flotante "Volver al formulario"
// ============================================

function inicializarBotonVolverFormulario() {
  const btn = document.getElementById("btnVolverFormulario");
  if (!btn) {
    console.warn("⚠️ Botón 'Volver al formulario' no encontrado");
    return;
  }

  btn.addEventListener("click", function (e) {
    e.preventDefault();
    if (!esMovil) return;

    const usuarioValido =
      window.usuarioActual &&
      (window.usuarioActual.rol === "pescador" ||
        window.usuarioActual.rol === "club");

    if (!usuarioValido) {
      alert("Debes iniciar sesión para acceder al formulario.");
      return;
    }

    accionMostrarFormulario();
  });
}

// ============================================
// OBSERVAR cambios de sesión (login/logout)
// ============================================

function observarCambiosSesion() {
  const headerUserInfo = document.getElementById("headerUserInfo");
  if (!headerUserInfo) return;

  const observer = new MutationObserver(function () {
    // Si el panel de formulario está abierto, reevaluar botón "Insertar ubicación"
    if (window._panelFormularioAbierto) {
      actualizarBotonUbicacion(true);
    }

    // Si estamos viendo el mapa, reevaluar botón "Volver al formulario"
    const mapa = document.querySelector(".columna-centro");
    const mapaVisible = mapa && mapa.style.display !== "none";
    if (mapaVisible) {
      actualizarBotonVolverFormulario(true);
    }
  });

  observer.observe(headerUserInfo, {
    attributes: true,
    attributeFilter: ["style"],
  });
}

// ============================================
// FUNCIÓN: inicializarMenuHamburguesa()
// ============================================

function inicializarMenuHamburguesa() {
  btnNav = document.getElementById("menuNavBtn");
  btnSecciones = document.getElementById("menuSeccionesBtn");
  menuNav = document.getElementById("menuNavDesplegable");
  menuSecciones = document.getElementById("menuSeccionesDesplegable");

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
        actualizarBotonVolverFormulario(true);
      } else {
        console.log("💻 Cambio a modo desktop");
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
        actualizarBotonUbicacion(false);
        actualizarBotonVolverFormulario(false);
      }
    }
  }

  esMovil = window.innerWidth <= 768;
  window.addEventListener("resize", actualizarModoMovil);

  // ============================================
  // CONFIGURAR EVENTOS
  // ============================================

  btnNav.addEventListener("click", function (e) {
    e.stopPropagation();
    if (esMovil) {
      window.toggleMenu(btnNav, menuNav, menuSecciones, btnSecciones);
    }
  });

  btnSecciones.addEventListener("click", function (e) {
    e.stopPropagation();
    if (esMovil) {
      window.toggleMenu(btnSecciones, menuSecciones, menuNav, btnNav);
    }
  });

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

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && esMovil) {
      window.cerrarMenus();
    }
  });

  // ============================================
  // BOTONES DE SECCIÓN
  // ============================================

  const btnFiltros = document.getElementById("btnMostrarFiltros");
  const btnFormulario = document.getElementById("btnMostrarFormulario");

  if (btnFiltros) {
    btnFiltros.addEventListener("click", function (e) {
      e.preventDefault();
      if (!esMovil) return;
      const filtros = document.querySelector(".filtros-contenedor");
      const formulario = document.querySelector(".columna-derecha");
      const mapa = document.querySelector(".columna-centro");

      if (formulario) {
        formulario.classList.remove("mostrar");
        formulario.style.display = "none";
      }
      if (mapa) mapa.style.display = "none";

      if (filtros) {
        const estaVisible = filtros.classList.contains("mostrar");
        if (estaVisible) {
          filtros.classList.remove("mostrar");
          filtros.style.display = "none";
        } else {
          filtros.classList.add("mostrar");
          filtros.style.display = "block";
          if (typeof map !== "undefined" && map) {
            setTimeout(function () {
              map.invalidateSize();
            }, 300);
          }
        }
      }

      actualizarBotonUbicacion(false);
      actualizarBotonVolverFormulario(false);
      window.cerrarMenus();
    });
  }

  if (btnFormulario) {
    btnFormulario.addEventListener("click", function (e) {
      e.preventDefault();
      if (!esMovil) return;

      const formulario = document.querySelector(".columna-derecha");
      const estaVisible =
        formulario && formulario.classList.contains("mostrar");

      if (estaVisible) {
        // Estaba abierto → cerrar y volver al mapa
        accionMostrarMapa("btnFormulario-toggle");
      } else {
        // Estaba cerrado → abrir formulario
        accionMostrarFormulario();
      }
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
    actualizarBotonVolverFormulario(true);
    window.cerrarMenus();
  } else {
    console.log("💻 Modo desktop - Menú hamburguesa oculto");
    window.cerrarMenus();
    actualizarBotonUbicacion(false);
    actualizarBotonVolverFormulario(false);
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
