// modal.js - Gestión de modales para jornadas de pescadores y concursos

// ============================================================
// FUNCIÓN: abrirModalJornada()
// ============================================================

function abrirModalJornada(jornada) {
  let capturasHtml = "";
  if (jornada.capturas && jornada.capturas.length > 0) {
    capturasHtml = "<div style='margin-top:10px'><strong>🐟 Capturas:</strong><ul>";
    jornada.capturas.forEach((c) => {
      capturasHtml += `<li>${c.especie}: ${c.talla_cm}cm</li>`;
    });
    capturasHtml += "</ul></div>";
  } else {
    capturasHtml = "<div style='margin-top:10px'><strong>🐟 Capturas:</strong> Ninguna</div>";
  }

  let detallesHtml = "";
  if (jornada.habitat || jornada.direccion_viento || jornada.altura_ola) {
    detallesHtml = "<details style='margin-top:10px'><summary>🌊 Datos ambientales</summary>";
    detallesHtml += "<div style='margin-top:8px'>";
    if (jornada.habitat) detallesHtml += `<div><strong>Hábitat:</strong> ${jornada.habitat}</div>`;
    if (jornada.tipo_lecho) detallesHtml += `<div><strong>Tipo de lecho:</strong> ${jornada.tipo_lecho}</div>`;
    if (jornada.algas_presente !== null && jornada.algas_presente !== undefined)
      detallesHtml += `<div><strong>Algas:</strong> ${jornada.algas_presente ? "Sí" : "No"}</div>`;
    if (jornada.direccion_viento) detallesHtml += `<div><strong>Dirección viento:</strong> ${jornada.direccion_viento}</div>`;
    if (jornada.velocidad_viento) detallesHtml += `<div><strong>Velocidad viento:</strong> ${jornada.velocidad_viento}</div>`;
    if (jornada.altura_ola) detallesHtml += `<div><strong>Altura ola:</strong> ${jornada.altura_ola}</div>`;
    if (jornada.turbidez) detallesHtml += `<div><strong>Turbidez:</strong> ${jornada.turbidez}</div>`;
    if (jornada.tiempo) detallesHtml += `<div><strong>Tiempo:</strong> ${jornada.tiempo}</div>`;
    if (jornada.tipo_pesca) detallesHtml += `<div><strong>Tipo de pesca:</strong> ${jornada.tipo_pesca}</div>`;
    if (jornada.cebo_natural) detallesHtml += `<div><strong>Cebo natural:</strong> ${jornada.cebo_natural}</div>`;
    if (jornada.cebo_artificial) detallesHtml += `<div><strong>Señuelo artificial:</strong> ${jornada.cebo_artificial}</div>`;
    if (jornada.mar_fondo !== null && jornada.mar_fondo !== undefined)
      detallesHtml += `<div><strong>Mar de fondo:</strong> ${jornada.mar_fondo ? "Sí" : "No"}</div>`;
    detallesHtml += "</div></details>";
  }

  let notasHtml = "";
  if (jornada.notas && jornada.notas.trim() !== "") {
    notasHtml = `<div style='margin-top:10px'><em>📝 Notas: ${jornada.notas}</em></div>`;
  }

  const modalBody = document.getElementById("modal-body");
  modalBody.innerHTML = `
    <h3 style="color:#1e5799; margin-bottom:15px;">📅 ${jornada.fecha_inicio} ${jornada.hora_inicio} - ${jornada.hora_fin}</h3>
    <div><strong>🎣 Pescador:</strong> ${jornada.pescador || "No especificado"}</div>
    ${capturasHtml}
    ${detallesHtml}
    ${notasHtml}
  `;

  document.getElementById("modalJornada").style.display = "flex";
}

// ============================================================
// FUNCIÓN: abrirModalConcurso()
// ============================================================

function abrirModalConcurso(concurso) {
  const modalBody = document.getElementById("modal-body");
  
  let capturasHtml = "";
  if (concurso.capturas && concurso.capturas.length > 0) {
    capturasHtml = "<div style='margin-top:10px'><strong>🐟 Capturas del concurso:</strong><ul>";
    concurso.capturas.forEach((c) => {
      capturasHtml += `<li>${c.especie || "Especie"}: ${c.num_ejemplares || 0} ejemplares, ${c.peso_total_kg || 0}kg, mayor: ${c.pieza_mayor_kg || 0}kg</li>`;
    });
    capturasHtml += "</ul></div>";
  }

  let detallesHtml = "";
  if (concurso.habitat || concurso.direccion_viento || concurso.altura_ola) {
    detallesHtml = "<details style='margin-top:10px'><summary>🌊 Datos ambientales</summary>";
    detallesHtml += "<div style='margin-top:8px'>";
    if (concurso.habitat) detallesHtml += `<div><strong>Hábitat:</strong> ${concurso.habitat}</div>`;
    if (concurso.tipo_lecho) detallesHtml += `<div><strong>Tipo de lecho:</strong> ${concurso.tipo_lecho}</div>`;
    if (concurso.algas_presente !== null && concurso.algas_presente !== undefined)
      detallesHtml += `<div><strong>Algas:</strong> ${concurso.algas_presente ? "Sí" : "No"}</div>`;
    if (concurso.direccion_viento) detallesHtml += `<div><strong>Dirección viento:</strong> ${concurso.direccion_viento}</div>`;
    if (concurso.velocidad_viento) detallesHtml += `<div><strong>Velocidad viento:</strong> ${concurso.velocidad_viento}</div>`;
    if (concurso.altura_ola) detallesHtml += `<div><strong>Altura ola:</strong> ${concurso.altura_ola}</div>`;
    if (concurso.turbidez) detallesHtml += `<div><strong>Turbidez:</strong> ${concurso.turbidez}</div>`;
    if (concurso.tiempo) detallesHtml += `<div><strong>Tiempo:</strong> ${concurso.tiempo}</div>`;
    if (concurso.mar_fondo !== null && concurso.mar_fondo !== undefined)
      detallesHtml += `<div><strong>Mar de fondo:</strong> ${concurso.mar_fondo ? "Sí" : "No"}</div>`;
    detallesHtml += "</div></details>";
  }

  modalBody.innerHTML = `
    <h3 style="color:#6f42c1; margin-bottom:15px;">🏆 ${concurso.nombre_concurso}</h3>
    <div><strong>📅 Fechas:</strong> ${concurso.fecha_inicio} - ${concurso.fecha_fin}</div>
    <div><strong>⏰ Horas:</strong> ${concurso.hora_inicio || "N/A"} - ${concurso.hora_fin || "N/A"}</div>
    <div><strong>👥 Participantes:</strong> ${concurso.num_participantes || 0}</div>
    ${concurso.nombre_ganador ? `<div><strong>🏅 Ganador:</strong> ${concurso.nombre_ganador}</div>` : ''}
    <div><strong>📍 Ubicación:</strong> ${concurso.lat}, ${concurso.lng}</div>
    ${concurso.descripcion ? `<div style='margin-top:10px'><strong>📝 Descripción:</strong> ${concurso.descripcion}</div>` : ''}
    ${capturasHtml}
    ${detallesHtml}
  `;

  document.getElementById("modalJornada").style.display = "flex";
}

// ============================================================
// FUNCIÓN: cerrarModal()
// ============================================================

function cerrarModal() {
  const modal = document.getElementById("modalJornada");
  if (modal) {
    modal.style.display = "none";
  }
}

// ============================================================
// INICIALIZACIÓN DE EVENTOS DEL MODAL - VERSIÓN SIMPLIFICADA
// ============================================================

function inicializarModal() {
  console.log("📦 Inicializando modal...");
  
  const modal = document.getElementById("modalJornada");
  
  // === CERRAR CON EL BOTÓN X - Usando onclick directamente ===
  const closeBtn = document.querySelector(".modal-close");
  if (closeBtn) {
    closeBtn.onclick = function(e) {
      e.stopPropagation();
      cerrarModal();
      console.log("✅ Modal cerrado con X (onclick)");
    };
    console.log("✅ Botón X configurado con onclick");
  } else {
    console.warn("⚠️ No se encontró .modal-close");
  }

  // === CERRAR HACIENDO CLIC FUERA ===
  if (modal) {
    modal.onclick = function(e) {
      if (e.target === modal) {
        cerrarModal();
        console.log("✅ Modal cerrado por clic fuera (onclick)");
      }
    };
    console.log("✅ Clic fuera configurado con onclick");
  }

  // === CERRAR CON TECLA ESC ===
  document.onkeydown = function(e) {
    if (e.key === "Escape") {
      const modalActual = document.getElementById("modalJornada");
      if (modalActual && modalActual.style.display === "flex") {
        cerrarModal();
        console.log("✅ Modal cerrado con ESC");
      }
    }
  };
  console.log("✅ Tecla ESC configurada");
}

// ============================================================
// EXPORTACIÓN GLOBAL
// ============================================================

window.abrirModalJornada = abrirModalJornada;
window.abrirModalConcurso = abrirModalConcurso;
window.cerrarModal = cerrarModal;
window.inicializarModal = inicializarModal;