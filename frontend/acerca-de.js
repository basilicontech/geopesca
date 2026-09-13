// acerca-de.js - Modal "Acerca de"

const contenidoAcercaDe = `
  <div class="modal-info-header">
    <h2>ℹ️ Acerca de GeoPesca</h2>
    <button class="modal-info-close" onclick="cerrarAcercaDe()">✕</button>
  </div>
  <div class="modal-info-body">

    <!-- BLOQUE DE PRESENTACIÓN -->
    <div class="bloque-presentacion">
      <div class="presentacion-foto">
        <img src="images/foto-perfil.jpg" alt="Alfonso Ismael Manano Rodríguez">
      </div>
      <div class="presentacion-texto">
        <div class="presentacion-nombre">Alfonso Ismael Manzano Rodríguez</div>
        <div class="presentacion-descripcion">Pescador deportivo y creador de GeoPesca.</div>
      </div>
    </div>

    <p>
      A todos nos ha pasado alguna vez: llegas por primera vez a una zona de pesca y estás <strong>más perdido que un pulpo en un garaje</strong>. No conoces los mejores spots, qué cebos utilizar, qué técnicas funcionan, qué especies puedes encontrar o incluso cuáles son las condiciones meteorológicas y de pesca más favorables en ese momento.
    </p>

    <p>
      Precisamente para ayudar a los pescadores a afrontar esta situación nace <strong>GeoPesca</strong>: un proyecto creado para <strong>compartir información, experiencias y capturas</strong>, y poner todo ese conocimiento al alcance de la comunidad.
    </p>

    <hr class="modal-info-divider">

    <h3>🎣 ¿Qué puedes encontrar en GeoPesca?</h3>

    <h4>🗺️ Mapa interactivo</h4>
    <p>
      En esta misma página encontrarás un <strong>mapa interactivo</strong> acompañado de un sistema de filtros y herramientas de registro e inicio de sesión.
    </p>
    <p>
      Los pescadores independientes podrán <strong>registrar sus capturas</strong>, mientras que los clubes podrán <strong>publicar y registrar sus concursos</strong>. Toda esta información podrá consultarse y filtrarse directamente sobre el mapa mediante puntos geolocalizados.
    </p>
    <p>
      De esta forma, entre todos podemos crear una <strong>base de datos colaborativa de información sobre pesca</strong>, basada en experiencias reales de los propios pescadores.
    </p>
    <p>
      Para conocer con más detalle cómo funciona esta sección, haz clic aquí:<br>
      <strong>👉 <span class="modal-info-link" onclick="cerrarAcercaDe(); abrirComoFunciona();">Cómo funciona</span></strong>
    </p>

    <hr class="modal-info-divider">

    <h4>📰 GeoPescaBlog</h4>
    <p>
      En <strong>GeoPescaBlog</strong> encontrarás artículos y contenidos relacionados con la pesca deportiva: <strong>especies, técnicas, legislación, consejos, noticias y mucho más</strong>.
    </p>
    <p>
      Un espacio pensado para aprender, descubrir y mantenerse informado sobre todo lo relacionado con nuestra afición.
    </p>
    <p>
      <strong>👉 <a href="https://geopesca.basilicontech.com/blog/" target="_blank" class="modal-info-link">Haz clic aquí para acceder a GeoPescaBlog</a></strong>
    </p>

    <hr class="modal-info-divider">

    <h4>💬 GeoPescaForo</h4>
    <p>
      Como buen pescador, seguro que también te gusta <strong>compartir y presumir de tus capturas</strong>.
    </p>
    <p>
      En <strong>GeoPescaForo</strong> podrás hacerlo, además de conectar con otros pescadores, plantear dudas, compartir experiencias y participar en debates relacionados con nuestra pasión.
    </p>
    <p>
      <strong>👉 <a href="https://foro.geopesca.basilicontech.com/" target="_blank" class="modal-info-link">Haz clic aquí para acceder a GeoPescaForo</a></strong>
    </p>

    <hr class="modal-info-divider">

    <h3>🌊 ÚNETE A GEOPESCA</h3>
    <p>
      Tanto si eres <strong>pescador independiente</strong> como si formas parte de un <strong>club de pesca</strong>, te invitamos a formar parte de esta comunidad.
    </p>
    <p>
      <strong>Comparte tus capturas, aporta tus conocimientos, descubre nuevos lugares y ayuda a otros pescadores a disfrutar aún más de nuestra pasión.</strong>
    </p>
    <p style="text-align: center; font-size: 1.2rem; font-weight: 700; color: #0a3d4f; margin-top: 20px;">
      🎣 ¡ÚNETE Y COMPARTE TUS EXPERIENCIAS!
    </p>
  </div>
  <div class="modal-info-footer">
    <button class="btn-modal-info btn-modal-info-small" onclick="cerrarAcercaDe(); abrirComoFunciona();">
      📖 Cómo funciona
    </button>
  </div>       
`;

function abrirAcercaDe() {
  const existente = document.querySelector(".modal-info-overlay");
  if (existente) {
    existente.remove();
  }

  const overlay = document.createElement("div");
  overlay.className = "modal-info-overlay active";

  const container = document.createElement("div");
  container.className = "modal-info-container";
  container.innerHTML = contenidoAcercaDe;

  overlay.appendChild(container);
  document.body.appendChild(overlay);

  overlay.addEventListener("click", function (e) {
    if (e.target === overlay) {
      cerrarAcercaDe();
    }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      cerrarAcercaDe();
    }
  });
}

function cerrarAcercaDe() {
  const overlay = document.querySelector(".modal-info-overlay");
  if (overlay) {
    overlay.remove();
  }
}

// ============================================
// EVENTO PARA EL BOTÓN "ACERCA DE"
// ============================================
document.addEventListener("DOMContentLoaded", function () {
  // Desktop
  const btnAcercaDesktop = document.getElementById("btnAcercaDesktop");
  if (btnAcercaDesktop) {
    btnAcercaDesktop.addEventListener("click", abrirAcercaDe);
  }

  // Mobile
  const btnAcercaMobile = document.getElementById("btnAcercaMobile");
  if (btnAcercaMobile) {
    btnAcercaMobile.addEventListener("click", abrirAcercaDe);
  }
});
