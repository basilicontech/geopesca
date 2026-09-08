// como-funciona.js - Modal "Cómo funciona"

const contenidoComoFunciona = `
  <div class="modal-info-header">
    <h2>📖 Cómo funciona GeoPesca</h2>
    <button class="modal-info-close" onclick="cerrarComoFunciona()">✕</button>
  </div>
  <div class="modal-info-body">
    <p class="intro-text">
      <strong>GeoPesca se organiza en tres secciones que trabajan juntas</strong> para que puedas explorar, filtrar y registrar tus jornadas y concursos de pesca.
    </p>

    <ul>
      <li>
        <strong>Filtros:</strong> Selecciona pescadores, clubs e intervalo de fechas para acotar tu búsqueda.
        <ul>
          <li>Selecciona los pescadores y clubs que desees que aparezcan como puntos en el mapa y añádelos con los botones <strong>"Añadir filtro"</strong>.</li>
          <li>Materializa la búsqueda con el botón <strong>"Aplicar filtros"</strong> y aparecerán puntos en el mapa con las jornadas y concursos seleccionados.</li>
        </ul>
      </li>
      <li>
        <strong>Mapa:</strong> Visualiza las jornadas y concursos como puntos geolocalizados. Mediante un clic en el punto podrás ver toda la información registrada por el usuario.
      </li>
      <li>
        <strong>Formularios:</strong> En esta sección podrás registrarte como usuario nuevo y hacer login una vez te hayas registrado.
        <ul>
          <li>
            <strong>Registro:</strong>
            <ul>
              <li><strong>Registro como club:</strong> En el botón <strong>"Registrar como club"</strong> podrás registrarte como tal. Posteriormente se evaluará tu registro para su validación. Una vez validado podrás hacer login y añadir tus concursos al sistema.</li>
              <li><strong>Registro como pescador:</strong> En el botón <strong>"Registrar como pescador"</strong> podrás registrarte como tal. En este caso no necesitas validación, solo tendrás que hacer login y podrás registrar tus jornadas de pesca.</li>
            </ul>
          </li>
          <li>
            <strong>Login:</strong> Introduciendo tu email y contraseña correspondiente, el sistema te logueará como club o pescador.
            <ul>
              <li><strong>Login como club:</strong> Se desplegará el formulario completo que te permitirá añadir toda la información relevante sobre la celebración de un concurso.</li>
              <li><strong>Login como pescador:</strong> Se desplegará el formulario completo que te permitirá añadir toda la información relevante sobre la celebración de una de tus jornadas.</li>
            </ul>
          </li>
        </ul>
      </li>
    </ul>
  </div>
  <div class="modal-info-footer">
    <button class="btn-modal-info btn-modal-info-small" onclick="cerrarComoFunciona(); abrirAcercaDe();">
      ℹ️ Acerca de
    </button>
  </div>
`;

function abrirComoFunciona() {
  const existente = document.querySelector(".modal-info-overlay");
  if (existente) {
    existente.remove();
  }

  const overlay = document.createElement("div");
  overlay.className = "modal-info-overlay active";

  const container = document.createElement("div");
  container.className = "modal-info-container";
  container.innerHTML = contenidoComoFunciona;

  overlay.appendChild(container);
  document.body.appendChild(overlay);

  overlay.addEventListener("click", function (e) {
    if (e.target === overlay) {
      cerrarComoFunciona();
    }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      cerrarComoFunciona();
    }
  });
}

function cerrarComoFunciona() {
  const overlay = document.querySelector(".modal-info-overlay");
  if (overlay) {
    overlay.remove();
  }
}

// ============================================
// EVENTO PARA EL BOTÓN "CÓMO FUNCIONA"
// ============================================
document.addEventListener("DOMContentLoaded", function () {
  // Desktop
  const btnComoFuncionaDesktop = document.getElementById(
    "btnComoFuncionaDesktop",
  );
  if (btnComoFuncionaDesktop) {
    btnComoFuncionaDesktop.addEventListener("click", abrirComoFunciona);
  }

  // Mobile
  const btnComoFuncionaMobile = document.getElementById(
    "btnComoFuncionaMobile",
  );
  if (btnComoFuncionaMobile) {
    btnComoFuncionaMobile.addEventListener("click", abrirComoFunciona);
  }
});
