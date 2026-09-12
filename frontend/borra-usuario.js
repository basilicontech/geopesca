// frontend/borra-usuario.js - Eliminación de la cuenta del usuario logueado
// Depende de: frontend-login.js (usa window.usuarioActual y localStorage["usuarioActual"])

const API_BASE = "/api";

async function eliminarCuenta() {
  const usuario = window.usuarioActual;

  if (!usuario) {
    alert("⚠️ No hay sesión activa.");
    return;
  }

  // El admin no puede eliminar su cuenta desde aquí
  if (usuario.rol === "admin") {
    alert("⚠️ Los administradores no pueden eliminar su cuenta desde aquí.");
    return;
  }

  // Texto específico según el rol
  const queSeBorra =
    usuario.rol === "pescador"
      ? "Se borrarán TODAS tus jornadas de pesca y sus capturas."
      : "Se borrarán TODOS los concursos que hayas organizado y sus capturas.";

  const confirmar = confirm(
    `⚠️ ELIMINAR CUENTA DEFINITIVAMENTE\n\n` +
      `Usuario: ${usuario.nombre} (${usuario.email})\n\n` +
      `${queSeBorra}\n\n` +
      `Esta acción es IRREVERSIBLE. ¿Quieres continuar?`,
  );

  if (!confirmar) return;

  const url =
    usuario.rol === "pescador"
      ? `${API_BASE}/pescadores/${usuario.id}`
      : `${API_BASE}/clubs/${usuario.id}`;

  try {
    const response = await fetch(url, { method: "DELETE" });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || data.mensaje || "Error al eliminar la cuenta",
      );
    }

    alert(
      `✅ ${data.message || "Cuenta eliminada correctamente"}\n\nHasta pronto 👋`,
    );

    // Limpiar sesión y recargar
    window.usuarioActual = null;
    localStorage.removeItem("usuarioActual");
    location.reload();
  } catch (error) {
    console.error("Error eliminando cuenta:", error);
    alert("❌ No se pudo eliminar la cuenta:\n" + error.message);
  }
}

function inicializarBorraUsuario() {
  const headerDeleteBtn = document.getElementById("headerDeleteBtn");
  if (headerDeleteBtn) {
    headerDeleteBtn.addEventListener("click", eliminarCuenta);
    console.log("✅ Botón eliminar cuenta asignado");
  } else {
    console.log("❌ No se encontró el botón headerDeleteBtn");
  }
}

// Inicialización cuando el DOM esté listo
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", inicializarBorraUsuario);
} else {
  inicializarBorraUsuario();
}

// Exponer por si quieres llamarlo desde consola o desde otro script
window.eliminarCuenta = eliminarCuenta;
