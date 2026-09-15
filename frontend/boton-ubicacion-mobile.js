// boton-ubicacion-mobile.js
// Gestiona el botón "Introducir ubicación" en móvil:
// Permite al usuario saltar del panel del formulario al mapa para
// seleccionar la coordenada, y volver al formulario con un clic.

function inicializarBotonUbicacionMobile() {
  const btnUbicacion = document.getElementById("btnIntroducirUbicacion");
  const btnVolver = document.getElementById("btnVolverFormulario");
  const columnaDerecha = document.querySelector(".columna-derecha");
  const columnaCentro = document.querySelector(".columna-centro");

  if (!btnUbicacion || !btnVolver || !columnaDerecha || !columnaCentro) {
    console.warn("⚠️ Elementos del botón de ubicación no encontrados");
    return;
  }

  // ------------------------------------------------
  // Visibilidad del botón "Introducir ubicación"
  // ------------------------------------------------
  function actualizarBotonUbicacion() {
    const esMovil = window.innerWidth <= 768;
    const hayUsuario = window.usuarioActual != null;
    const formularioVisible = columnaDerecha.classList.contains("mostrar");

    if (esMovil && hayUsuario && formularioVisible) {
      btnUbicacion.style.display = "block";
    } else {
      btnUbicacion.style.display = "none";
    }
  }

  // Detectar cambios de clase en .columna-derecha
  const observer = new MutationObserver(actualizarBotonUbicacion);
  observer.observe(columnaDerecha, {
    attributes: true,
    attributeFilter: ["class", "style"],
  });

  // Detectar cuándo aparece/desaparece el formulario tras login/logout
  ["fishingForm", "concursoForm"].forEach((id) => {
    const form = document.getElementById(id);
    if (form) {
      new MutationObserver(actualizarBotonUbicacion).observe(form, {
        attributes: true,
        attributeFilter: ["style", "class"],
      });
    }
  });

  window.addEventListener("resize", actualizarBotonUbicacion);

  // Red de seguridad tras login (usuarioActual se setea async)
  setInterval(actualizarBotonUbicacion, 800);

  // ------------------------------------------------
  // Acción: ir al mapa para seleccionar ubicación
  // ------------------------------------------------
  btnUbicacion.addEventListener("click", function () {
    columnaDerecha.classList.remove("mostrar");
    columnaDerecha.style.display = "none";

    const filtros = document.querySelector(".filtros-contenedor");
    if (filtros) {
      filtros.classList.remove("mostrar");
      filtros.style.display = "none";
    }

    columnaCentro.style.display = "block";
    columnaCentro.style.width = "100%";
    btnVolver.style.display = "block";

    setTimeout(function () {
      if (typeof map !== "undefined" && map) map.invalidateSize();
    }, 300);
  });

  // ------------------------------------------------
  // Acción: volver al formulario
  // ------------------------------------------------
  btnVolver.addEventListener("click", function () {
    columnaCentro.style.display = "none";

    columnaDerecha.classList.add("mostrar");
    columnaDerecha.style.display = "block";

    btnVolver.style.display = "none";

    setTimeout(actualizarBotonUbicacion, 100);
  });

  actualizarBotonUbicacion();
  console.log("📍 Botón de ubicación móvil inicializado");
}

if (document.readyState === "loading") {
  document.addEventListener(
    "DOMContentLoaded",
    inicializarBotonUbicacionMobile,
  );
} else {
  inicializarBotonUbicacionMobile();
}
