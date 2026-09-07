// frontend/frontend-login.js - Versión que NO muestra el panel de club

async function procesarLogin(email, password) {
  if (!email || !password) {
    mostrarMensajeLogin("Completa todos los campos", "error");
    return false;
  }

  if (!email.includes("@") || !email.includes(".")) {
    mostrarMensajeLogin("Introduce un email válido", "error");
    return false;
  }

  if (password.length < 4) {
    mostrarMensajeLogin(
      "La contraseña debe tener al menos 4 caracteres",
      "error",
    );
    return false;
  }

  mostrarMensajeLogin("⏳ Iniciando sesión...", "info");

  try {
    const response = await fetch("https://geopesca.basilicontech.com/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      mostrarMensajeLogin(`✅ ${data.mensaje}`, "success");

      window.usuarioActual = data.usuario;
      // Guardar sesión en localStorage
      localStorage.setItem("usuarioActual", JSON.stringify(data.usuario));

      if (data.usuario.rol === "pescador") {
        mostrarFormularioPescador(data.usuario);
      } else if (data.usuario.rol === "club") {
        // VERIFICAR SI EL CLUB ESTÁ VALIDADO
        if (data.usuario.validado === true) {
          // Club validado - mostrar formulario
          mostrarFormularioPescador(data.usuario);
        } else {
          // Club no validado - mostrar mensaje de espera
          alert(
            `⏳ ${data.usuario.nombre} - Pendiente de validación. Espera la confirmación del administrador.`,
          );
          localStorage.removeItem("usuarioActual");
          location.reload();
        }
      } else if (data.usuario.rol === "admin") {
        alert(`✅ Bienvenido ${data.usuario.nombre} (Administrador)`);
        // Abrir panel de administración en nueva pestaña
        window.open("administrador.html", "_blank");
        // Cerrar sesión en esta pestaña y recargar para volver al login
        localStorage.removeItem("usuarioActual");
        location.reload();
        return true;
      }

      return true;
    } else {
      mostrarMensajeLogin(`❌ ${data.mensaje}`, "error");
      return false;
    }
  } catch (error) {
    console.error("Error en login:", error);
    mostrarMensajeLogin("❌ Error de conexión con el servidor", "error");
    return false;
  }
}

function mostrarFormularioPescador(usuario) {
  const authPanel = document.querySelector(".auth-panel");
  if (authPanel) authPanel.style.display = "none";

  // Mostrar usuario en el header
  const headerUserInfo = document.getElementById("headerUserInfo");
  const headerUserName = document.getElementById("headerUserName");
  if (headerUserInfo && headerUserName) {
    headerUserInfo.style.display = "flex";
    let icono = usuario.rol === "pescador" ? "👤" : "🏢";
    headerUserName.textContent = `${icono} ${usuario.nombre}`;
  }

  const fishingForm = document.getElementById("fishingForm");
  const concursoForm = document.getElementById("concursoForm");

  if (usuario.rol === "pescador") {
    if (fishingForm) {
      fishingForm.style.display = "block";
      fishingForm.classList.add("visible");
    }
    if (concursoForm) {
      concursoForm.style.display = "none";
    }
    if (typeof inicializarInsertarJornada === "function") {
      inicializarInsertarJornada();
    }
  } else if (usuario.rol === "club" && usuario.validado === true) {
    if (concursoForm) {
      concursoForm.style.display = "block";
      concursoForm.classList.add("visible");
    }
    if (fishingForm) {
      fishingForm.style.display = "none";
    }
    if (typeof inicializarInsertarConcurso === "function") {
      inicializarInsertarConcurso();
    }
  }
}

function cerrarSesion() {
  console.log("🔄 Cerrando sesión...");
  window.usuarioActual = null;
  // Eliminar sesión de localStorage
  localStorage.removeItem("usuarioActual");

  // Ocultar usuario del header
  const headerUserInfo = document.getElementById("headerUserInfo");
  if (headerUserInfo) {
    headerUserInfo.style.display = "none";
  }

  // Mostrar el panel de autenticación
  const authPanel = document.querySelector(".auth-panel");
  if (authPanel) authPanel.style.display = "block";

  // Ocultar formularios
  const fishingForm = document.getElementById("fishingForm");
  const concursoForm = document.getElementById("concursoForm");
  if (fishingForm) fishingForm.style.display = "none";
  if (concursoForm) concursoForm.style.display = "none";

  location.reload();
}

function mostrarMensajeLogin(mensaje, tipo) {
  const mensajeDiv = document.getElementById("loginMessage");
  if (!mensajeDiv) return;

  mensajeDiv.textContent = mensaje;
  mensajeDiv.className = `auth-message ${tipo}`;
  mensajeDiv.style.display = "block";

  if (tipo !== "error") {
    setTimeout(() => {
      if (mensajeDiv.textContent === mensaje) {
        mensajeDiv.style.display = "none";
        mensajeDiv.className = "auth-message";
      }
    }, 4000);
  }
}

function restaurarSesion() {
  const usuarioGuardado = localStorage.getItem("usuarioActual");
  if (usuarioGuardado) {
    try {
      const usuario = JSON.parse(usuarioGuardado);
      window.usuarioActual = usuario;

      // Mostrar usuario en el header
      const headerUserInfo = document.getElementById("headerUserInfo");
      const headerUserName = document.getElementById("headerUserName");
      if (headerUserInfo && headerUserName) {
        headerUserInfo.style.display = "flex";
        let icono = usuario.rol === "pescador" ? "👤" : "🏢";
        headerUserName.textContent = `${icono} ${usuario.nombre}`;
      }

      // Mostrar el formulario correspondiente
      if (typeof mostrarFormularioPescador === "function") {
        mostrarFormularioPescador(usuario);
      }

      console.log("🔄 Sesión restaurada:", usuario.nombre);
    } catch (error) {
      console.error("Error restaurando sesión:", error);
      localStorage.removeItem("usuarioActual");
    }
  }
}

function inicializarLogin() {
  const btnLogin = document.getElementById("btnLogin");
  const inputEmail = document.getElementById("loginEmail");
  const inputPassword = document.getElementById("loginPassword");

  if (btnLogin) {
    btnLogin.addEventListener("click", () => {
      procesarLogin(inputEmail?.value || "", inputPassword?.value || "");
    });
  }

  [inputEmail, inputPassword].forEach((input) => {
    if (input) {
      input.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          btnLogin?.click();
        }
      });
    }
  });

  // Botón de cerrar sesión en el header
  const headerLogoutBtn = document.getElementById("headerLogoutBtn");
  if (headerLogoutBtn) {
    headerLogoutBtn.addEventListener("click", cerrarSesion);
    console.log("✅ Botón cerrar sesión asignado");
  } else {
    console.log("❌ No se encontró el botón headerLogoutBtn");
  }

  console.log("🔐 Sistema de login inicializado");
}

// Para registro automático de pescadores (login real con credenciales)
window.procesarLogin = procesarLogin;

window.simularLogin = async function (nombre, email, password, rol) {
  if (rol === "pescador" && password) {
    return procesarLogin(email, password);
  }
};

// Inicializar con restauración de sesión
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    restaurarSesion();
    inicializarLogin();
  });
} else {
  restaurarSesion();
  inicializarLogin();
}
