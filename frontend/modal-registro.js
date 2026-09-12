// modal-registro.js - Login automático solo para pescadores

function abrirModalPescador() {
  const modal = document.getElementById("modalRegistro");
  const title = document.getElementById("modalTitle");
  const body = document.getElementById("modalBody");

  title.textContent = "🎣 Registro Pescador";

  body.innerHTML = `
    <div class="modal-group">
      <label>Nombre de usuario</label>
      <input type="text" id="reg-nombre" placeholder="Ej: JuanPerez">
    </div>
    <div class="modal-group">
      <label>Email</label>
      <input type="email" id="reg-email" placeholder="tu@email.com">
    </div>
    <div class="modal-group">
      <label>Contraseña</label>
      <input type="password" id="reg-password" placeholder="••••••••">
    </div>
    <div class="modal-group">
      <label>Repita contraseña</label>
      <input type="password" id="reg-password2" placeholder="••••••••">
    </div>

    <div class="modal-group">
      <input type="checkbox" id="reg-acepto-terminos">
      <label for="reg-acepto-terminos">
        He leído y acepto los términos y condiciones de uso, los cuales se reflejan en:
        <ul style="margin: 6px 0 0 24px; font-size: 0.9rem; list-style: disc; padding-left: 20px;">
          <li><a href="./aviso-legal.html" target="_blank">Aviso legal</a></li>
          <li><a href="./politica-privacidad.html" target="_blank">Política de privacidad</a></li>
          <li><a href="./politica-de-cookies.html" target="_blank">Política de cookies</a></li>
          <li><a href="./condiciones-de-uso.html" target="_blank">Condiciones de uso</a></li>
        </ul>
        <div style="margin-top: 8px; font-size: 0.9rem; color: #555; line-height: 1.5;">
          <p style="margin: 4px 0;">
            🔐 <strong>Derecho de eliminación de datos:</strong>
          </p>
          <ul style="margin: 4px 0 0 20px; list-style: circle; padding-left: 16px;">
            <li>Tiene derecho a solicitar la completa eliminación de sus datos personales.</li>
            <li>Eliminarlos implica también la eliminación total y absoluta de toda la información registrada por usted.</li>
            <li>Para eliminar sus datos puede:
              <ul style="margin: 2px 0 0 20px; list-style: none; padding-left: 0;">
                <li>📧 Escribir un email a <a href="#" style="color: #0066cc;">alfonsoisman@gmail.com</a> solicitándolo, o</li>
                <li>🔘 Utilizar el botón <strong>"Eliminar cuenta"</strong>, presente en la cabecera tras el inicio de sesión.</li>
              </ul>
            </li>
          </ul>
        </div>
      </label>
    </div>

    <button class="btn-modal btn-modal-pescador" id="btnRegistrarPescador">✅ Registrarse</button>
    <div id="registroMensaje" style="margin-top:12px; font-size:0.85rem; text-align:center;"></div>
  `;

  modal.style.display = "flex";

  const btnReg = document.getElementById("btnRegistrarPescador");
  if (btnReg) {
    btnReg.onclick = () => {
      const nombre = document.getElementById("reg-nombre")?.value;
      const email = document.getElementById("reg-email")?.value;
      const password = document.getElementById("reg-password")?.value;
      const password2 = document.getElementById("reg-password2")?.value;

      if (!nombre || !email || !password || !password2) {
        mostrarMensajeRegistro("Completa todos los campos", "error");
        return;
      }

      if (password !== password2) {
        mostrarMensajeRegistro("Las contraseñas no coinciden", "error");
        return;
      }

      if (password.length < 4) {
        mostrarMensajeRegistro(
          "La contraseña debe tener al menos 4 caracteres",
          "error",
        );
        return;
      }

      const aceptaTerminos = document.getElementById(
        "reg-acepto-terminos",
      )?.checked;

      if (!aceptaTerminos) {
        mostrarMensajeRegistro(
          "Debes aceptar los términos y condiciones para registrarte",
          "error",
        );
        return;
      }

      enviarRegistro(nombre, email, password, "pescador");
    };
  }
}

function abrirModalClub() {
  const modal = document.getElementById("modalRegistro");
  const title = document.getElementById("modalTitle");
  const body = document.getElementById("modalBody");

  title.textContent = "🏢 Registro Club";

  body.innerHTML = `
    <div class="modal-group">
      <label>Nombre del club</label>
      <input type="text" id="reg-club" placeholder="Ej: Club Náutico">
    </div>
    <div class="modal-group">
      <label>Email de contacto</label>
      <input type="email" id="reg-email" placeholder="club@email.com">
    </div>
    <div class="modal-group">
      <label>Contraseña</label>
      <input type="password" id="reg-password" placeholder="••••••••">
    </div>
    <div class="modal-group">
      <label>Repita contraseña</label>
      <input type="password" id="reg-password2" placeholder="••••••••">
    </div>

    <div class="modal-note">
      ⚠️ Los clubs requieren validación manual del administrador
    </div>

    <div class="modal-group">
      <input type="checkbox" id="reg-acepto-terminos">
      <label for="reg-acepto-terminos">
        He leído y acepto los términos y condiciones de uso, los cuales se reflejan en:
        <ul style="margin: 6px 0 0 24px; font-size: 0.9rem; list-style: disc; padding-left: 20px;">
          <li><a href="./aviso-legal.html" target="_blank">Aviso legal</a></li>
          <li><a href="./politica-privacidad.html" target="_blank">Política de privacidad</a></li>
          <li><a href="./politica-de-cookies.html" target="_blank">Política de cookies</a></li>
          <li><a href="./condiciones-de-uso.html" target="_blank">Condiciones de uso</a></li>
        </ul>
        <div style="margin-top: 8px; font-size: 0.9rem; color: #555; line-height: 1.5;">
          <p style="margin: 4px 0;">
            🔐 <strong>Derecho de eliminación de datos:</strong>
          </p>
          <ul style="margin: 4px 0 0 20px; list-style: circle; padding-left: 16px;">
            <li>Tiene derecho a solicitar la completa eliminación de sus datos personales.</li>
            <li>Eliminarlos implica también la eliminación total y absoluta de toda la información registrada por usted.</li>
            <li>Para eliminar sus datos puede:
              <ul style="margin: 2px 0 0 20px; list-style: none; padding-left: 0;">
                <li>📧 Escribir un email a <a href="#" style="color: #0066cc;">alfonsoisman@gmail.com</a> solicitándolo, o</li>
                <li>🔘 Utilizar el botón <strong>"Eliminar cuenta"</strong>, presente en la cabecera tras el inicio de sesión.</li>
              </ul>
            </li>
          </ul>
        </div>
      </label>
    </div>

    <button class="btn-modal btn-modal-club" id="btnRegistrarClub">✅ Registrarse</button>
    <div id="registroMensaje" style="margin-top:12px; font-size:0.85rem; text-align:center;"></div>
  `;

  modal.style.display = "flex";

  const btnReg = document.getElementById("btnRegistrarClub");
  if (btnReg) {
    btnReg.onclick = () => {
      const nombre = document.getElementById("reg-club")?.value;
      const email = document.getElementById("reg-email")?.value;
      const password = document.getElementById("reg-password")?.value;
      const password2 = document.getElementById("reg-password2")?.value;

      if (!nombre || !email || !password || !password2) {
        mostrarMensajeRegistro("Completa todos los campos", "error");
        return;
      }

      if (password !== password2) {
        mostrarMensajeRegistro("Las contraseñas no coinciden", "error");
        return;
      }

      if (password.length < 4) {
        mostrarMensajeRegistro(
          "La contraseña debe tener al menos 4 caracteres",
          "error",
        );
        return;
      }

      const aceptaTerminos = document.getElementById(
        "reg-acepto-terminos",
      )?.checked;

      if (!aceptaTerminos) {
        mostrarMensajeRegistro(
          "Debes aceptar los términos y condiciones para registrarte",
          "error",
        );
        return;
      }

      enviarRegistro(nombre, email, password, "club");
    };
  }
}

// ============================================
// FUNCIÓN: enviarRegistro()
// ============================================
async function enviarRegistro(nombre, email, password, rol) {
  const mensajeDiv = document.getElementById("registroMensaje");

  try {
    mostrarMensajeRegistro("⏳ Registrando...", "info");

    const response = await fetch(
      "/api/registro",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: nombre,
          email: email,
          password: password,
          rol: rol,
        }),
      },
    );

    const data = await response.json();

    if (response.ok) {
      mostrarMensajeRegistro(`✅ ${data.mensaje}`, "success");

      setTimeout(() => {
        cerrarModalRegistro();

        // ============================================
        // LOGIN AUTOMÁTICO SOLO PARA PESCADORES
        // ============================================
        if (rol === "pescador" && typeof window.procesarLogin === "function") {
          window.procesarLogin(email, password);
        }

        // Si es club, NO hay login automático
        if (rol === "club") {
          alert(
            "✅ Club registrado correctamente. Espera la validación del administrador.",
          );
        }
      }, 1500);
    } else {
      mostrarMensajeRegistro(`❌ ${data.mensaje}`, "error");
    }
  } catch (error) {
    console.error("Error en registro:", error);
    mostrarMensajeRegistro("❌ Error de conexión con el servidor", "error");
  }
}

function mostrarMensajeRegistro(mensaje, tipo) {
  const mensajeDiv = document.getElementById("registroMensaje");
  if (!mensajeDiv) return;

  mensajeDiv.textContent = mensaje;

  const colores = {
    success: "#28a745",
    error: "#dc3545",
    info: "#17a2b8",
  };

  mensajeDiv.style.color = colores[tipo] || "#333";
}

function cerrarModalRegistro() {
  const modal = document.getElementById("modalRegistro");
  if (modal) {
    modal.style.display = "none";
  }
}

function inicializarRegistro() {
  console.log("🔐 Inicializando registro...");

  const btnPescador = document.getElementById("btnRegistroPescador");
  const btnClub = document.getElementById("btnRegistroClub");
  const modalClose = document.getElementById("modalClose");

  if (btnPescador) {
    btnPescador.addEventListener("click", abrirModalPescador);
  }

  if (btnClub) {
    btnClub.addEventListener("click", abrirModalClub);
  }

  if (modalClose) {
    modalClose.addEventListener("click", cerrarModalRegistro);
  }
}

document.addEventListener("DOMContentLoaded", inicializarRegistro);

// ============================================
// FUNCIONES PARA VENTANA DE TÉRMINOS Y CONDICIONES
// ============================================

function abrirVentanaTerminos(callback) {
  const overlay = document.createElement("div");
  overlay.id = "terminosOverlay";
  overlay.className = "terminos-overlay";

  const ventana = document.createElement("div");
  ventana.className = "terminos-ventana";

  ventana.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
      <h2 style="margin: 0;">📋 Términos y Condiciones</h2>
      <button id="btnCerrarTerminos" style="background: none; border: none; font-size: 28px; cursor: pointer; color: #999; padding: 0 8px;">✕</button>
    </div>
    <p>Para continuar con el registro, debes leer y aceptar los siguientes documentos:</p>

    <div>
      <div>
        <input type="checkbox" id="term-privacidad">
        <label for="term-privacidad">
          He leído y acepto la
          <a href="./politica-privacidad.html" target="_blank">Política de Privacidad</a>
          y el tratamiento de mis datos personales.
        </label>
      </div>

      <div>
        <input type="checkbox" id="term-condiciones">
        <label for="term-condiciones">
          Acepto las
          <a href="./condiciones-de-uso.html" target="_blank">Condiciones Generales de Uso</a>.
        </label>
      </div>

      <div>
        <input type="checkbox" id="term-cookies">
        <label for="term-cookies">
          He leído y acepto la
          <a href="./politica-de-cookies.html" target="_blank">Política de Cookies</a>.
        </label>
      </div>

      <div>
        <input type="checkbox" id="term-marketing">
        <label for="term-marketing">
          📧 Deseo recibir información sobre novedades y concursos (opcional)
        </label>
      </div>
    </div>

    <div id="errorTerminos" style="display:none; color: #dc3545; margin: 10px 0;">
      ❌ Debes aceptar todos los documentos obligatorios.
    </div>

    <div style="display: flex; gap: 12px; margin-top: 20px; justify-content: flex-end;">
      <button id="btnRechazarTerminos" style="padding: 10px 24px; background: #6c757d; color: white; border: none; border-radius: 6px; cursor: pointer;">Cancelar</button>
      <button id="btnAceptarTerminos" style="padding: 10px 24px; background: #28a745; color: white; border: none; border-radius: 6px; cursor: pointer;">✅ Aceptar y continuar</button>
    </div>
  `;

  overlay.appendChild(ventana);
  document.body.appendChild(overlay);

  // Cerrar con la cruz
  document.getElementById("btnCerrarTerminos").onclick = function () {
    document.body.removeChild(overlay);
    callback(false);
  };

  document.getElementById("btnAceptarTerminos").onclick = function () {
    const privacidad = document.getElementById("term-privacidad").checked;
    const condiciones = document.getElementById("term-condiciones").checked;
    const cookies = document.getElementById("term-cookies").checked;

    if (!privacidad || !condiciones || !cookies) {
      document.getElementById("errorTerminos").style.display = "block";
      return;
    }

    document.body.removeChild(overlay);
    callback(true);
  };

  document.getElementById("btnRechazarTerminos").onclick = function () {
    document.body.removeChild(overlay);
    callback(false);
  };

  overlay.onclick = function (e) {
    if (e.target === overlay) {
      document.body.removeChild(overlay);
      callback(false);
    }
  };
}
