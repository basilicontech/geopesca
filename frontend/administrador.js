// frontend/administrador.js

document.addEventListener("DOMContentLoaded", function () {
  // === BOTÓN VOLVER (Desktop y Mobile) ===
  document.getElementById("btnVolver").addEventListener("click", function () {
    window.location.href = "index.html";
  });

  document.getElementById("btnVolverMobile").addEventListener("click", function () {
    window.location.href = "index.html";
  });

  // === CERRAR SESIÓN ===
  document
    .getElementById("headerLogoutBtn")
    .addEventListener("click", function () {
      localStorage.removeItem("usuarioActual");
      window.location.href = "index.html";
    });

  // === MENÚ HAMBURGUESA (Mobile) ===
  const menuBtn = document.getElementById("menuHamburguesaBtn");
  const menuDesplegable = document.getElementById("menuAdminDesplegable");

  if (menuBtn && menuDesplegable) {
    menuBtn.addEventListener("click", function () {
      this.classList.toggle("activo");
      menuDesplegable.classList.toggle("abierto");
    });
  }

  // === BOTONES DE NAVEGACIÓN (Desktop y Mobile) ===
  const desktopButtons = document.querySelectorAll(".admin-btn");
  const mobileButtons = document.querySelectorAll(".admin-btn-mobile");

  // Función para manejar clic en botones
  function handlePanelClick(panel, btnElement) {
    // Desactivar todos los botones (desktop)
    desktopButtons.forEach((b) => b.classList.remove("activo"));
    // Desactivar todos los botones (mobile)
    mobileButtons.forEach((b) => b.classList.remove("activo"));

    // Activar el botón clickeado
    if (btnElement) {
      btnElement.classList.add("activo");
    }

    // Cerrar menú desplegable en móvil
    if (menuDesplegable) {
      menuDesplegable.classList.remove("abierto");
    }
    if (menuBtn) {
      menuBtn.classList.remove("activo");
    }

    // Cargar el panel
    cargarPanel(panel);
  }

  // Eventos para botones desktop
  desktopButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      const panel = this.dataset.panel;
      handlePanelClick(panel, this);
    });
  });

  // Eventos para botones mobile
  mobileButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      const panel = this.dataset.panel;
      handlePanelClick(panel, this);
    });
  });

  // === CARGAR PANEL POR DEFECTO ===
  // Cargar "pescadores" al iniciar
  const defaultBtn = document.querySelector('.admin-btn[data-panel="pescadores"]');
  if (defaultBtn) {
    defaultBtn.classList.add("activo");
    cargarPanel("pescadores");
  }
});

// ============================================================
// FUNCIÓN PRINCIPAL PARA CARGAR PANELES
// ============================================================
async function cargarPanel(panel) {
  const centro = document.querySelector(".admin-centro");

  // Actualizar el título del menú móvil
  const tituloMobile = document.querySelector(".menu-mobile-titulo");
  const nombresPanel = {
    pescadores: "🎣 Pescadores",
    clubs: "🏢 Clubs",
    administradores: "👤 Administradores",
    jornadas: "📅 Jornadas",
    concursos: "🏆 Concursos",
    especies: "🐟 Especies",
  };
  if (tituloMobile && nombresPanel[panel]) {
    tituloMobile.textContent = nombresPanel[panel];
  }

  switch (panel) {
    case "pescadores":
      await cargarPescadores(centro);
      break;
    case "clubs":
      await cargarClubs(centro);
      break;
    case "jornadas":
      await cargarJornadas(centro);
      break;
    case "administradores":
      await cargarAdministradores(centro);
      break;
    case "concursos":
      await cargarConcursos(centro);
      break;
    case "especies":
      await cargarEspecies(centro);
      break;
    default:
      centro.innerHTML =
        '<p class="empty-message">Panel no implementado</p>';
  }
}

// ============================================================
// CARGAR CONCURSOS
// ============================================================
async function cargarConcursos(centro) {
  try {
    centro.innerHTML =
      '<div style="text-align:center; padding:40px; color:#666;">Cargando concursos...</div>';

    const response = await fetch(
      "https://geopesca.basilicontech.com/api/concursos/list",
    );

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const concursos = await response.json();

    if (!concursos || concursos.length === 0) {
      centro.innerHTML = `
                <div style="text-align:center; padding:40px; color:#666;">
                    <p style="font-size:1.2rem;">🏆 No hay concursos registrados</p>
                </div>
            `;
      return;
    }

    let html = `
            <h2>🏆 Concursos registrados</h2>
            <div style="margin-bottom:15px; color:#666; font-size:0.9rem;">
                Total: <strong>${concursos.length}</strong> concurso${concursos.length !== 1 ? "s" : ""}
            </div>
            <div class="tabla-container">
                <table class="tabla-admin">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Club organizador</th>
                            <th>Fecha inicio</th>
                            <th>Fecha fin</th>
                            <th>Participantes</th>
                            <th>Ganador</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

    concursos.forEach((concurso) => {
      const fechaInicio = concurso.fecha_inicio
        ? new Date(concurso.fecha_inicio).toLocaleDateString("es-ES")
        : "-";
      const fechaFin = concurso.fecha_fin
        ? new Date(concurso.fecha_fin).toLocaleDateString("es-ES")
        : "-";
      const nombreClub = concurso.nombre_club || "Sin club";
      const participantes = concurso.num_participantes || 0;
      const ganador = concurso.nombre_ganador || "-";

      html += `
                <tr>
                    <td><strong>${concurso.id_concurso}</strong></td>
                    <td>${concurso.nombre_concurso || "-"}</td>
                    <td>${nombreClub}</td>
                    <td>${fechaInicio}</td>
                    <td>${fechaFin}</td>
                    <td style="text-align:center;">${participantes}</td>
                    <td>${ganador}</td>
                    <td>
                        <button class="btn-eliminar-admin" onclick="eliminarConcurso(${concurso.id_concurso})" title="Eliminar concurso">
                            🗑️
                        </button>
                    </td>
                </tr>
            `;
    });

    html += `
                    </tbody>
                </table>
            </div>
        `;

    centro.innerHTML = html;
  } catch (error) {
    console.error("Error cargando concursos:", error);
    centro.innerHTML = `
            <div style="text-align:center; padding:40px; color:#721c24; background:#f8d7da; border-radius:8px;">
                <p style="font-size:1.1rem;">❌ Error al cargar los concursos</p>
                <p style="font-size:0.85rem; color:#666;">${error.message}</p>
            </div>
        `;
  }
}

// ============================================================
// eliminarConcurso() - Eliminar un concurso
// ============================================================
async function eliminarConcurso(id) {
  if (
    !confirm(
      "⚠️ ¿Estás seguro de que quieres eliminar este concurso?\n\nSe eliminarán también todas sus capturas y participaciones asociadas.",
    )
  ) {
    return;
  }

  try {
    const response = await fetch(
      `https://geopesca.basilicontech.com/api/concursos/${id}`,
      {
        method: "DELETE",
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Error al eliminar el concurso");
    }

    alert(`✅ ${data.message}`);

    const centro = document.querySelector(".admin-centro");
    await cargarConcursos(centro);
  } catch (error) {
    console.error("Error eliminando concurso:", error);
    alert("❌ Error: " + error.message);
  }
}

// ============================================================
// CARGAR ADMINISTRADORES
// ============================================================
async function cargarAdministradores(centro) {
  try {
    centro.innerHTML =
      '<div style="text-align:center; padding:40px; color:#666;">Cargando administradores...</div>';

    const response = await fetch(
      "https://geopesca.basilicontech.com/api/administradores/list",
    );

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const administradores = await response.json();

    if (!administradores || administradores.length === 0) {
      centro.innerHTML = `
                <div style="text-align:center; padding:40px; color:#666;">
                    <p style="font-size:1.2rem;">📭 No hay administradores registrados</p>
                </div>
            `;
      return;
    }

    let html = `
            <h2>👤 Administradores registrados</h2>
            <div style="margin-bottom:15px; color:#666; font-size:0.9rem;">
                Total: <strong>${administradores.length}</strong> administrador${administradores.length !== 1 ? "es" : ""}
            </div>
            <div class="tabla-container">
                <table class="tabla-admin">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Email</th>
                            <th>Fecha registro</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

    administradores.forEach((admin) => {
      const fechaRegistro = admin.fecha_registro
        ? new Date(admin.fecha_registro).toLocaleDateString("es-ES")
        : "-";

      const esUltimo = administradores.length === 1;

      html += `
                <tr>
                    <td><strong>${admin.id_administrador}</strong></td>
                    <td>${admin.nombre_administrador || "-"}</td>
                    <td>${admin.email_administrador || "-"}</td>
                    <td>${fechaRegistro}</td>
                    <td>
                        <button class="btn-eliminar-admin"
                                onclick="eliminarAdministrador(${admin.id_administrador})"
                                title="${esUltimo ? "No se puede eliminar el último administrador" : "Eliminar administrador"}"
                                ${esUltimo ? 'disabled style="opacity:0.3; cursor:not-allowed;"' : ""}>
                            🗑️
                        </button>
                    </td>
                </tr>
            `;
    });

    html += `
                    </tbody>
                </table>
            </div>
        `;

    centro.innerHTML = html;
  } catch (error) {
    console.error("Error cargando administradores:", error);
    centro.innerHTML = `
            <div style="text-align:center; padding:40px; color:#721c24; background:#f8d7da; border-radius:8px;">
                <p style="font-size:1.1rem;">❌ Error al cargar los administradores</p>
                <p style="font-size:0.85rem; color:#666;">${error.message}</p>
            </div>
        `;
  }
}

// ============================================================
// eliminarAdministrador() - Eliminar un administrador
// ============================================================
async function eliminarAdministrador(id) {
  if (
    !confirm("⚠️ ¿Estás seguro de que quieres eliminar este administrador?")
  ) {
    return;
  }

  try {
    const response = await fetch(
      `https://geopesca.basilicontech.com/api/administradores/${id}`,
      {
        method: "DELETE",
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Error al eliminar el administrador");
    }

    alert(`✅ ${data.message}`);

    const centro = document.querySelector(".admin-centro");
    await cargarAdministradores(centro);
  } catch (error) {
    console.error("Error eliminando administrador:", error);
    alert("❌ Error: " + error.message);
  }
}

// ============================================================
// CARGAR PESCADORES
// ============================================================
async function cargarPescadores(centro) {
  try {
    centro.innerHTML =
      '<div style="text-align:center; padding:40px; color:#666;">Cargando pescadores...</div>';

    const response = await fetch(
      "https://geopesca.basilicontech.com/api/pescadores/list",
    );

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const pescadores = await response.json();

    if (!pescadores || pescadores.length === 0) {
      centro.innerHTML = `
                <div style="text-align:center; padding:40px; color:#666;">
                    <p style="font-size:1.2rem;">📭 No hay pescadores registrados</p>
                </div>
            `;
      return;
    }

    let html = `
            <h2>🎣 Pescadores registrados</h2>
            <div style="margin-bottom:15px; color:#666; font-size:0.9rem;">
                Total: <strong>${pescadores.length}</strong> pescador${pescadores.length !== 1 ? "es" : ""}
            </div>
            <div class="tabla-container">
                <table class="tabla-admin">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Email</th>
                            <th>Fecha registro</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

    pescadores.forEach((pescador) => {
      const fechaRegistro = pescador.fecha_registro
        ? new Date(pescador.fecha_registro).toLocaleDateString("es-ES")
        : "-";

      html += `
                <tr>
                    <td><strong>${pescador.id_pescador}</strong></td>
                    <td>${pescador.nombre_pescador || "-"}</td>
                    <td>${pescador.email_pescador || "-"}</td>
                    <td>${fechaRegistro}</td>
                    <td>
                        <button class="btn-eliminar-admin" onclick="eliminarPescador(${pescador.id_pescador})" title="Eliminar pescador">
                            🗑️
                        </button>
                    </td>
                </tr>
            `;
    });

    html += `
                    </tbody>
                </table>
            </div>
        `;

    centro.innerHTML = html;
  } catch (error) {
    console.error("Error cargando pescadores:", error);
    centro.innerHTML = `
            <div style="text-align:center; padding:40px; color:#721c24; background:#f8d7da; border-radius:8px;">
                <p style="font-size:1.1rem;">❌ Error al cargar los pescadores</p>
                <p style="font-size:0.85rem; color:#666;">${error.message}</p>
            </div>
        `;
  }
}

// ============================================================
// eliminarPescador() - Eliminar un pescador
// ============================================================
async function eliminarPescador(id) {
  if (
    !confirm(
      "⚠️ ¿Estás seguro de que quieres eliminar este pescador?\n\nNo se podrá eliminar si tiene jornadas asociadas.",
    )
  ) {
    return;
  }

  try {
    const response = await fetch(
      `https://geopesca.basilicontech.com/api/pescadores/${id}`,
      {
        method: "DELETE",
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Error al eliminar el pescador");
    }

    alert(`✅ ${data.message}`);

    const centro = document.querySelector(".admin-centro");
    await cargarPescadores(centro);
  } catch (error) {
    console.error("Error eliminando pescador:", error);
    alert("❌ Error: " + error.message);
  }
}

// ============================================================
// CARGAR JORNADAS
// ============================================================
async function cargarJornadas(centro) {
  try {
    centro.innerHTML =
      '<div style="text-align:center; padding:40px; color:#666;">Cargando jornadas...</div>';

    const response = await fetch(
      "https://geopesca.basilicontech.com/api/jornadas/list",
    );

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const jornadas = await response.json();

    if (!jornadas || jornadas.length === 0) {
      centro.innerHTML = `
                <div style="text-align:center; padding:40px; color:#666;">
                    <p style="font-size:1.2rem;">📭 No hay jornadas registradas</p>
                </div>
            `;
      return;
    }

    let html = `
            <h2>📅 Jornadas registradas</h2>
            <div style="margin-bottom:15px; color:#666; font-size:0.9rem;">
                Total: <strong>${jornadas.length}</strong> jornada${jornadas.length !== 1 ? "s" : ""}
            </div>
            <div class="tabla-container">
                <table class="tabla-admin">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Pescador</th>
                            <th>Fecha</th>
                            <th>Hora inicio</th>
                            <th>Hora fin</th>
                            <th>Fecha registro</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

    jornadas.forEach((jornada) => {
      const fecha = jornada.fecha_inicio
        ? new Date(jornada.fecha_inicio).toLocaleDateString("es-ES")
        : "-";
      const horaInicio = jornada.hora_inicio || "-";
      const horaFin = jornada.hora_fin || "-";
      const fechaRegistro = jornada.creado_en
        ? new Date(jornada.creado_en).toLocaleDateString("es-ES")
        : "-";
      const nombrePescador = jornada.nombre_pescador || "Sin asignar";

      html += `
                <tr>
                    <td><strong>${jornada.id_jornada}</strong></td>
                    <td>${nombrePescador}</td>
                    <td>${fecha}</td>
                    <td>${horaInicio}</td>
                    <td>${horaFin}</td>
                    <td>${fechaRegistro}</td>
                    <td>
                        <button class="btn-eliminar-admin" onclick="eliminarJornada(${jornada.id_jornada})" title="Eliminar jornada">
                            🗑️
                        </button>
                    </td>
                </tr>
            `;
    });

    html += `
                    </tbody>
                </table>
            </div>
        `;

    centro.innerHTML = html;
  } catch (error) {
    console.error("Error cargando jornadas:", error);
    centro.innerHTML = `
            <div style="text-align:center; padding:40px; color:#721c24; background:#f8d7da; border-radius:8px;">
                <p style="font-size:1.1rem;">❌ Error al cargar las jornadas</p>
                <p style="font-size:0.85rem; color:#666;">${error.message}</p>
            </div>
        `;
  }
}

// ============================================================
// eliminarJornada() - Eliminar una jornada
// ============================================================
async function eliminarJornada(id) {
  if (
    !confirm(
      "⚠️ ¿Estás seguro de que quieres eliminar esta jornada?\n\nSe eliminarán también todas sus capturas asociadas.",
    )
  ) {
    return;
  }

  try {
    const response = await fetch(
      `https://geopesca.basilicontech.com/api/jornadas/${id}`,
      {
        method: "DELETE",
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Error al eliminar la jornada");
    }

    alert("✅ Jornada eliminada correctamente");

    const centro = document.querySelector(".admin-centro");
    await cargarJornadas(centro);
  } catch (error) {
    console.error("Error eliminando jornada:", error);
    alert("❌ Error: " + error.message);
  }
}

// ============================================================
// CARGAR CLUBS
// ============================================================
async function cargarClubs(centro) {
  try {
    centro.innerHTML =
      '<div style="text-align:center; padding:40px; color:#666;">Cargando clubs...</div>';

    const response = await fetch(
      "https://geopesca.basilicontech.com/api/clubs/list",
    );

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const clubs = await response.json();

    if (!clubs || clubs.length === 0) {
      centro.innerHTML = `
                <div style="text-align:center; padding:40px; color:#666;">
                    <p style="font-size:1.2rem;">📭 No hay clubs registrados</p>
                </div>
            `;
      return;
    }

    let html = `
            <h2>🏢 Clubs registrados</h2>
            <div style="margin-bottom:15px; color:#666; font-size:0.9rem;">
                Total: <strong>${clubs.length}</strong> club${clubs.length !== 1 ? "s" : ""}
            </div>
            <div class="tabla-container">
                <table class="tabla-admin">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Email</th>
                            <th>Estado</th>
                            <th>Fecha registro</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

    clubs.forEach((club) => {
      const fechaRegistro = club.fecha_registro
        ? new Date(club.fecha_registro).toLocaleDateString("es-ES")
        : "-";

      let estadoHtml;
      if (club.validado) {
        estadoHtml = '<span class="badge-validado">Validado</span>';
      } else {
        estadoHtml = `<button class="btn-validar-admin" onclick="validarClub(${club.id_club})">Pendiente</button>`;
      }

      html += `
                <tr>
                    <td><strong>${club.id_club}</strong></td>
                    <td>${club.nombre_club || "-"}</td>
                    <td>${club.email_contacto || "-"}</td>
                    <td>${estadoHtml}</td>
                    <td>${fechaRegistro}</td>
                    <td>
                        <button class="btn-eliminar-admin" onclick="eliminarClub(${club.id_club})" title="Eliminar club">
                            🗑️
                        </button>
                    </td>
                </tr>
            `;
    });

    html += `
                    </tbody>
                </table>
            </div>
        `;

    centro.innerHTML = html;
  } catch (error) {
    console.error("Error cargando clubs:", error);
    centro.innerHTML = `
            <div style="text-align:center; padding:40px; color:#721c24; background:#f8d7da; border-radius:8px;">
                <p style="font-size:1.1rem;">❌ Error al cargar los clubs</p>
                <p style="font-size:0.85rem; color:#666;">${error.message}</p>
            </div>
        `;
  }
}

// ============================================================
// validarClub() - Validar un club
// ============================================================
async function validarClub(id) {
  try {
    const response = await fetch(
      `https://geopesca.basilicontech.com/api/clubs/${id}/validar`,
      {
        method: "PUT",
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Error al validar el club");
    }

    alert("✅ Club validado correctamente");

    const centro = document.querySelector(".admin-centro");
    await cargarClubs(centro);
  } catch (error) {
    console.error("Error validando club:", error);
    alert("❌ Error: " + error.message);
  }
}

// ============================================================
// eliminarClub() - Eliminar un club y todos sus concursos
// ============================================================
async function eliminarClub(id) {
  if (
    !confirm(
      "⚠️ ¿Estás seguro de que quieres eliminar este club?\n\nSe eliminarán también TODOS sus concursos y capturas asociadas.",
    )
  ) {
    return;
  }

  try {
    const response = await fetch(
      `https://geopesca.basilicontech.com/api/clubs/${id}`,
      {
        method: "DELETE",
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Error al eliminar el club");
    }

    const mensaje =
      data.concursos_eliminados > 0
        ? `✅ ${data.message}`
        : `✅ Club eliminado correctamente (sin concursos asociados)`;

    alert(mensaje);

    const centro = document.querySelector(".admin-centro");
    await cargarClubs(centro);
  } catch (error) {
    console.error("Error eliminando club:", error);
    alert("❌ Error: " + error.message);
  }
}

// ============================================================
// CARGAR ESPECIES
// ============================================================
async function cargarEspecies(centro) {
  try {
    centro.innerHTML =
      '<div style="text-align:center; padding:40px; color:#666;">Cargando especies...</div>';

    const response = await fetch(
      "https://geopesca.basilicontech.com/api/especies/list",
    );

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const especies = await response.json();

    if (!especies || especies.length === 0) {
      centro.innerHTML = `
                <div style="text-align:center; padding:40px; color:#666;">
                    <p style="font-size:1.2rem;">🐟 No hay especies registradas</p>
                </div>
            `;
      return;
    }

    let html = `
            <h2>🐟 Especies registradas</h2>
            <div style="margin-bottom:15px; color:#666; font-size:0.9rem;">
                Total: <strong>${especies.length}</strong> especie${especies.length !== 1 ? "s" : ""}
            </div>
            <div class="tabla-container">
                <table class="tabla-admin">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre común</th>
                            <th>Nombre científico</th>
                            <th>Familia</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

    especies.forEach((especie) => {
      html += `
                <tr>
                    <td><strong>${especie.id_especie}</strong></td>
                    <td>${especie.nombre_comun || "-"}</td>
                    <td><em>${especie.nombre_cientifico || "-"}</em></td>
                    <td>${especie.familia || "-"}</td>
                    <td>
                        <button class="btn-eliminar-admin" onclick="eliminarEspecie(${especie.id_especie})" title="Eliminar especie">
                            🗑️
                        </button>
                    </td>
                </tr>
            `;
    });

    html += `
                    </tbody>
                </table>
            </div>
        `;

    centro.innerHTML = html;
  } catch (error) {
    console.error("Error cargando especies:", error);
    centro.innerHTML = `
            <div style="text-align:center; padding:40px; color:#721c24; background:#f8d7da; border-radius:8px;">
                <p style="font-size:1.1rem;">❌ Error al cargar las especies</p>
                <p style="font-size:0.85rem; color:#666;">${error.message}</p>
            </div>
        `;
  }
}

// ============================================================
// eliminarEspecie() - Eliminar una especie
// ============================================================
async function eliminarEspecie(id) {
  if (
    !confirm(
      "⚠️ ¿Estás seguro de que quieres eliminar esta especie?\n\nNo se podrá eliminar si está siendo utilizada en capturas.",
    )
  ) {
    return;
  }

  try {
    const response = await fetch(
      `https://geopesca.basilicontech.com/api/especies/${id}`,
      {
        method: "DELETE",
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Error al eliminar la especie");
    }

    alert(`✅ ${data.message}`);

    const centro = document.querySelector(".admin-centro");
    await cargarEspecies(centro);
  } catch (error) {
    console.error("Error eliminando especie:", error);
    alert("❌ Error: " + error.message);
  }
}