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
        mostrarMensajeRegistro("La contraseña debe tener al menos 4 caracteres", "error");
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
        mostrarMensajeRegistro("La contraseña debe tener al menos 4 caracteres", "error");
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

    const response = await fetch("https://azaharlimpieza.es/api/registro", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nombre: nombre,
        email: email,
        password: password,
        rol: rol
      })
    });

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
          alert("✅ Club registrado correctamente. Espera la validación del administrador.");
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
    info: "#17a2b8"
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