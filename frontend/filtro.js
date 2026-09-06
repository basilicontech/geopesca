// filtro.js - Sistema de Filtros para Jornadas de Pesca y Concursos

class FiltroPesca {
  constructor(map, allJornadasLayer, allConcursosLayer) {
    this.map = map;
    this.allJornadasLayer = allJornadasLayer;
    this.allConcursosLayer = allConcursosLayer;
    this.pescadoresSeleccionados = new Set();
    this.concursosSeleccionados = new Set();
    this.capaFiltradaJornadas = null;
    this.capaFiltradaConcursos = null;
    this.onJornadasUpdated = null;
  }

  init() {
    this.cargarPescadores();
    this.cargarConcursos();
    this.inicializarEventListeners();
  }

  setJornadasLayer(layer) {
    this.allJornadasLayer = layer;
  }

  setConcursosLayer(layer) {
    this.allConcursosLayer = layer;
  }

  async cargarPescadores() {
    try {
      const response = await fetch(
        "https://azaharlimpieza.es/api/catalogs/pescadores",
      );
      const pescadores = await response.json();

      const selector = document.getElementById("selectorPescador");
      if (selector) {
        selector.innerHTML =
          '<option value="__todos">Todos los pescadores</option>';
        pescadores.forEach((p) => {
          const option = document.createElement("option");
          option.value = p.nombre_pescador;
          option.textContent = p.nombre_pescador;
          selector.appendChild(option);
        });
        console.log("✅ Pescadores cargados en el selector");
      }
    } catch (err) {
      console.error("Error cargando pescadores:", err);
    }
  }

  async cargarConcursos() {
    try {
      // ✅ Usar la misma lógica que los pescadores pero con clubs
      const response = await fetch("https://azaharlimpieza.es/api/catalogs/clubs");
      const clubs = await response.json();

      const selector = document.getElementById("selectorConcurso");
      if (selector) {
        selector.innerHTML = '<option value="__todos">Todos los clubs</option>';
        clubs.forEach((c) => {
          const option = document.createElement("option");
          option.value = c.nombre_club; // Usar nombre_club igual que pescadores usan nombre_pescador
          option.textContent = c.nombre_club;
          selector.appendChild(option);
        });
        console.log("✅ Clubs cargados en el selector");
      }
    } catch (err) {
      console.error("Error cargando clubs:", err);
    }
  }

  agregarPescador() {
    const selector = document.getElementById("selectorPescador");
    const pescadorValor = selector?.value;
    const pescadorNombre = selector?.options[selector.selectedIndex]?.text;

    if (!pescadorValor) {
      this.mostrarMensaje("Selecciona un pescador para añadir", "error");
      return;
    }

    // Si selecciona "Todos los pescadores"
    if (pescadorValor === "__todos") {
      // Limpiar selecciones actuales y añadir "todos"
      this.pescadoresSeleccionados.clear();
      this.pescadoresSeleccionados.add("__todos");
      this.actualizarListaPescadores();
      selector.value = "";
      this.mostrarMensaje("✅ Mostrando todos los pescadores", "success");
      return;
    }

    // Si ya hay "todos" seleccionado, limpiar y añadir el nuevo
    if (this.pescadoresSeleccionados.has("__todos")) {
      this.pescadoresSeleccionados.clear();
    }

    if (this.pescadoresSeleccionados.has(pescadorNombre)) {
      this.mostrarMensaje("Este pescador ya está en la lista", "error");
      return;
    }

    this.pescadoresSeleccionados.add(pescadorNombre);
    this.actualizarListaPescadores();
    selector.value = "";
    this.mostrarMensaje(`Pescador ${pescadorNombre} añadido`, "success");
  }

  removerPescador(pescadorNombre) {
    this.pescadoresSeleccionados.delete(pescadorNombre);
    this.actualizarListaPescadores();
    this.mostrarMensaje(`Pescador removido`, "info");
  }

  actualizarListaPescadores() {
    const contenedor = document.getElementById("listaPescadoresFiltro");
    if (!contenedor) return;

    if (this.pescadoresSeleccionados.size === 0) {
      contenedor.innerHTML =
        '<div style="color: #6c757d; font-size: 12px;">No hay pescadores seleccionados</div>';
      return;
    }

    // Si está seleccionado "todos", mostrar un mensaje especial
    if (this.pescadoresSeleccionados.has("__todos")) {
      contenedor.innerHTML = `
        <div class="tag-pescador" style="color: #28a745; font-weight: bold;">
          ✅ Todos los pescadores
          <button class="btn-remover-pescador" data-nombre="__todos">✖</button>
        </div>
      `;
      // Configurar evento para remover "todos"
      const btn = contenedor.querySelector(".btn-remover-pescador");
      if (btn) {
        btn.addEventListener("click", () => {
          this.removerPescador("__todos");
        });
      }
      return;
    }

    contenedor.innerHTML = Array.from(this.pescadoresSeleccionados)
      .map(
        (nombre) => `
        <div class="tag-pescador">
          ${nombre}
          <button class="btn-remover-pescador" data-nombre="${nombre}">✖</button>
        </div>
      `,
      )
      .join("");

    document.querySelectorAll(".btn-remover-pescador").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const nombre = btn.getAttribute("data-nombre");
        this.removerPescador(nombre);
      });
    });
  }

  agregarConcurso() {
    const selector = document.getElementById("selectorConcurso");
    const clubValor = selector?.value;
    const clubNombre = selector?.options[selector.selectedIndex]?.text;

    if (!clubValor) {
      this.mostrarMensaje("Selecciona un club para añadir", "error");
      return;
    }

    // Si selecciona "Todos los clubs"
    if (clubValor === "__todos") {
      this.concursosSeleccionados.clear();
      this.concursosSeleccionados.add("__todos");
      this.actualizarListaConcursos();
      selector.value = "";
      this.mostrarMensaje("✅ Mostrando todos los clubs", "success");
      return;
    }

    // Si ya hay "todos" seleccionado, limpiar y añadir el nuevo
    if (this.concursosSeleccionados.has("__todos")) {
      this.concursosSeleccionados.clear();
    }

    if (this.concursosSeleccionados.has(clubValor)) {
      this.mostrarMensaje("Este club ya está en la lista", "error");
      return;
    }

    this.concursosSeleccionados.add(clubValor);
    this.actualizarListaConcursos();
    selector.value = "";
    this.mostrarMensaje(`Club ${clubNombre} añadido`, "success");
  }

  removerConcurso(concursoId) {
    this.concursosSeleccionados.delete(concursoId);
    this.actualizarListaConcursos();
    this.mostrarMensaje(`Concurso removido`, "info");
  }

  actualizarListaConcursos() {
    const contenedor = document.getElementById("listaConcursosFiltro");
    if (!contenedor) return;

    if (this.concursosSeleccionados.size === 0) {
      contenedor.innerHTML =
        '<div style="color: #6c757d; font-size: 12px;">No hay clubs seleccionados</div>';
      return;
    }

    // Si está seleccionado "todos", mostrar un mensaje especial
    if (this.concursosSeleccionados.has("__todos")) {
      contenedor.innerHTML = `
            <div class="tag-concurso" style="color: #28a745; font-weight: bold;">
                ✅ Todos los clubs
                <button class="btn-remover-concurso" data-id="__todos">✖</button>
            </div>
        `;
      const btn = contenedor.querySelector(".btn-remover-concurso");
      if (btn) {
        btn.addEventListener("click", () => {
          this.removerConcurso("__todos");
        });
      }
      return;
    }

    const selector = document.getElementById("selectorConcurso");
    const nombres = [];
    this.concursosSeleccionados.forEach((id) => {
      const option = selector?.querySelector(`option[value="${id}"]`);
      if (option) nombres.push({ id, nombre: option.textContent });
    });

    contenedor.innerHTML = nombres
      .map(
        ({ id, nombre }) => `
            <div class="tag-concurso">
                🏢 ${nombre}
                <button class="btn-remover-concurso" data-id="${id}">✖</button>
            </div>
        `,
      )
      .join("");

    document.querySelectorAll(".btn-remover-concurso").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = btn.getAttribute("data-id");
        this.removerConcurso(id);
      });
    });
  }

  ocultarTodosLosPuntos() {
    if (this.capaFiltradaJornadas) {
      this.map.removeLayer(this.capaFiltradaJornadas);
      this.capaFiltradaJornadas = null;
    }
    if (this.capaFiltradaConcursos) {
      this.map.removeLayer(this.capaFiltradaConcursos);
      this.capaFiltradaConcursos = null;
    }
    if (this.allJornadasLayer && this.map.hasLayer(this.allJornadasLayer)) {
      this.map.removeLayer(this.allJornadasLayer);
    }
    if (this.allConcursosLayer && this.map.hasLayer(this.allConcursosLayer)) {
      this.map.removeLayer(this.allConcursosLayer);
    }
  }

  mostrarPuntosFiltrados(puntosFiltrados, concursosFiltrados = []) {
    this.ocultarTodosLosPuntos();

    // Mostrar jornadas
    if (puntosFiltrados && puntosFiltrados.length > 0) {
      const features = puntosFiltrados.map((layer) => layer.feature);
      this.capaFiltradaJornadas = L.geoJSON(
        {
          type: "FeatureCollection",
          features: features,
        },
        {
          pointToLayer: (feature, latlng) => {
            return L.circleMarker(latlng, {
              radius: 8,
              color: "#28a745",
              fillColor: "#28a745",
              fillOpacity: 0.7,
              weight: 2,
            });
          },
          onEachFeature: (feature, layer) => {
            const p = feature.properties;
            layer.on("click", () => {
              if (typeof window.abrirModalJornada === "function") {
                window.abrirModalJornada(p);
              }
            });
          },
        },
      ).addTo(this.map);
    }

    // Mostrar concursos
    if (concursosFiltrados && concursosFiltrados.length > 0) {
      const features = concursosFiltrados.map((layer) => layer.feature);
      this.capaFiltradaConcursos = L.geoJSON(
        {
          type: "FeatureCollection",
          features: features,
        },
        {
          pointToLayer: (feature, latlng) => {
            return L.circleMarker(latlng, {
              radius: 10,
              color: "#6f42c1",
              fillColor: "#6f42c1",
              fillOpacity: 0.7,
              weight: 2,
            });
          },
          onEachFeature: (feature, layer) => {
            const p = feature.properties;
            layer.on("click", () => {
              if (typeof window.abrirModalConcurso === "function") {
                window.abrirModalConcurso(p);
              }
            });
          },
        },
      ).addTo(this.map);
    }

    console.log(
      `✅ Mostrados ${puntosFiltrados.length} puntos y ${concursosFiltrados.length} concursos`,
    );
  }

  aplicarFiltros() {
    const fechaDesde = document.getElementById("filtroFechaDesde")?.value || "";
    const fechaHasta = document.getElementById("filtroFechaHasta")?.value || "";

    // Verificar si hay algún filtro seleccionado
    const hayPescadores = this.pescadoresSeleccionados.size > 0;
    const hayConcursos = this.concursosSeleccionados.size > 0;
    const hayFechas = fechaDesde || fechaHasta;

    if (!hayPescadores && !hayConcursos && !hayFechas) {
      this.mostrarMensaje(
        "⚠️ Selecciona al menos un filtro para ver resultados",
        "error",
      );
      // Ocultar todos los puntos
      this.ocultarTodosLosPuntos();
      return;
    }

    // === FILTRAR JORNADAS ===
    let puntosFiltrados = [];
    if (this.allJornadasLayer) {
      // Si tiene "todos", mostrar todos los pescadores sin filtrar
      const filtrarPorPescador =
        !this.pescadoresSeleccionados.has("__todos") &&
        this.pescadoresSeleccionados.size > 0;

      // ✅ CAMBIO 1: Envolver todo en este if
      if (this.pescadoresSeleccionados.size > 0) {
        this.allJornadasLayer.eachLayer((layer) => {
          const props = layer.feature.properties;
          let mostrar = true;

          if (filtrarPorPescador) {
            if (!this.pescadoresSeleccionados.has(props.pescador)) {
              mostrar = false;
            }
          }

          if (mostrar && fechaDesde && props.fecha_inicio < fechaDesde) {
            mostrar = false;
          }

          if (mostrar && fechaHasta && props.fecha_inicio > fechaHasta) {
            mostrar = false;
          }

          if (mostrar) {
            puntosFiltrados.push(layer);
          }
        });
      }
      // ✅ CAMBIO 2: Si no hay pescadores seleccionados, NO se añaden jornadas
    }

    // === FILTRAR CONCURSOS POR CLUB ===
let concursosFiltrados = [];
if (this.allConcursosLayer) {
    // Usar la misma lógica que los pescadores pero con clubs
    const filtrarPorClub =
        !this.concursosSeleccionados.has("__todos") &&
        this.concursosSeleccionados.size > 0;

    // ✅ Envolver en if para que solo filtre si hay clubs seleccionados
    if (this.concursosSeleccionados.size > 0) {
        this.allConcursosLayer.eachLayer((layer) => {
            const props = layer.feature.properties;
            let mostrar = true;

            // Filtrar por club
            if (filtrarPorClub) {
                // Buscar el nombre del club en el concurso
                const clubDelConcurso = props.nombre_club || props.club_nombre || props.club;
                // Verificar si el club está en la selección
                if (!this.concursosSeleccionados.has(clubDelConcurso)) {
                    mostrar = false;
                }
            }

            // Filtros de fecha
            if (mostrar && fechaDesde && props.fecha_inicio < fechaDesde) {
                mostrar = false;
            }
            if (mostrar && fechaHasta && props.fecha_inicio > fechaHasta) {
                mostrar = false;
            }

            if (mostrar) {
                concursosFiltrados.push(layer);
            }
        });
    }
    // Si no hay clubs seleccionados, NO se añaden concursos
}

    // Mostrar resultados
    this.mostrarPuntosFiltrados(puntosFiltrados, concursosFiltrados);

    const totalMostrados = puntosFiltrados.length + concursosFiltrados.length;
    if (totalMostrados > 0) {
      this.mostrarMensaje(
        `✅ Mostrando ${puntosFiltrados.length} jornada(s) y ${concursosFiltrados.length} concurso(s)`,
        "success",
      );
    } else {
      this.mostrarMensaje(
        `⚠️ No hay resultados que coincidan con los filtros seleccionados`,
        "error",
      );
    }
  }

  limpiarFiltros() {
    this.pescadoresSeleccionados.clear();
    this.concursosSeleccionados.clear();
    this.actualizarListaPescadores();
    this.actualizarListaConcursos();

    const fechaDesde = document.getElementById("filtroFechaDesde");
    const fechaHasta = document.getElementById("filtroFechaHasta");
    if (fechaDesde) fechaDesde.value = "";
    if (fechaHasta) fechaHasta.value = "";

    this.ocultarTodosLosPuntos();
    this.mostrarMensaje(
      "Filtros limpiados. Aplica nuevos filtros para ver resultados.",
      "info",
    );
  }

  mostrarMensaje(mensaje, tipo) {
    const contenedorMensaje = document.getElementById("mensajeFiltro");
    if (!contenedorMensaje) return;

    if (!mensaje) {
      contenedorMensaje.style.display = "none";
      return;
    }

    contenedorMensaje.style.display = "block";
    contenedorMensaje.textContent = mensaje;
    contenedorMensaje.className = "mensaje-filtro";

    switch (tipo) {
      case "success":
        contenedorMensaje.classList.add("mensaje-success");
        break;
      case "error":
        contenedorMensaje.classList.add("mensaje-error");
        break;
      default:
        contenedorMensaje.classList.add("mensaje-info");
    }

    if (tipo !== "error") {
      setTimeout(() => {
        if (contenedorMensaje.textContent === mensaje) {
          contenedorMensaje.style.display = "none";
        }
      }, 3000);
    }
  }

  inicializarEventListeners() {
    const btnAgregarPescador = document.getElementById("btnAgregarPescador");
    const btnAgregarConcurso = document.getElementById("btnAgregarConcurso");
    const btnAplicar = document.getElementById("btnAplicarFiltros");
    const btnLimpiar = document.getElementById("btnLimpiarFiltros");

    if (btnAgregarPescador) {
      btnAgregarPescador.addEventListener("click", () =>
        this.agregarPescador(),
      );
    }

    if (btnAgregarConcurso) {
      btnAgregarConcurso.addEventListener("click", () =>
        this.agregarConcurso(),
      );
    }

    if (btnAplicar) {
      btnAplicar.addEventListener("click", () => this.aplicarFiltros());
    }

    if (btnLimpiar) {
      btnLimpiar.addEventListener("click", () => this.limpiarFiltros());
    }
  }
}

let instanciaFiltro = null;

async function inicializarFiltros() {
  console.log("🔍 Inicializando sistema de filtros...");

  if (typeof map === "undefined") {
    console.error("❌ Mapa no disponible para filtros");
    return;
  }

  let capaPuntos = null;
  let capaConcursos = null;

  if (typeof PuntosControl !== "undefined") {
    capaPuntos = PuntosControl.getCapaPescadores();
    capaConcursos = PuntosControl.getCapaConcursos();
    console.log("✅ Capas obtenidas de PuntosControl");
  }

  instanciaFiltro = new FiltroPesca(map, capaPuntos, capaConcursos);
  instanciaFiltro.init();

  if (typeof PuntosControl !== "undefined") {
    const originalRefrescar = PuntosControl.refrescarPuntos;
    PuntosControl.refrescarPuntos = async function (
      map,
      onPointClick,
      onConcursoClick,
    ) {
      const resultado = await originalRefrescar(
        map,
        onPointClick,
        onConcursoClick,
      );
      if (instanciaFiltro) {
        instanciaFiltro.setJornadasLayer(PuntosControl.getCapaPescadores());
        instanciaFiltro.setConcursosLayer(PuntosControl.getCapaConcursos());
      }
      return resultado;
    };
  }

  console.log("✅ Sistema de filtros inicializado");
}

// Exportar globalmente
window.inicializarFiltros = inicializarFiltros;
window.FiltroPesca = FiltroPesca;
window.aplicarFiltros = function () {
  if (instanciaFiltro) instanciaFiltro.aplicarFiltros();
};
