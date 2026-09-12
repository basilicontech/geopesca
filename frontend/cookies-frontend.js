// cookies-frontend.js
// Escucha los eventos de Zest y envía el consentimiento al servidor
// Con deduplicación para evitar bucles.

const CONSENT_SENT_KEY = "geopesca_consent_sent";

function enviarConsentimiento(tipo, configuracion) {
  // Deduplicación: si ya enviamos este mismo consentimiento en esta sesión, no repetir
  const huella = JSON.stringify({ tipo, configuracion });
  const huellaAnterior = sessionStorage.getItem(CONSENT_SENT_KEY);

  if (huella === huellaAnterior) {
    console.log("⏭️ Consentimiento ya enviado previamente, se omite");
    return;
  }

  const datos = {
    tipo: tipo,
    configuracion: configuracion || null,
    fecha: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href,
    version: "1.0",
  };

  console.log(`📤 Enviando consentimiento: ${tipo}`, datos);

  fetch("/api/registrar-consentimiento", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  })
    .then((response) => {
      if (!response.ok) throw new Error("Error al guardar el consentimiento");
      return response.json();
    })
    .then((data) => {
      console.log("✅ Consentimiento guardado correctamente:", data);
      sessionStorage.setItem(CONSENT_SENT_KEY, huella);
    })
    .catch((error) => {
      console.error("❌ Error al enviar el consentimiento:", error);
    });
}

// ===== DETECCIÓN DE LA COOKIE DE ZEST =====
function detectarCookieZest() {
  const cookies = document.cookie.split(";");
  for (let cookie of cookies) {
    const trimmedCookie = cookie.trim();
    if (trimmedCookie.startsWith("zest_consent=")) {
      try {
        const value = trimmedCookie.substring("zest_consent=".length);
        const decoded = decodeURIComponent(value);
        const datos = JSON.parse(decoded);

        if (datos.categories) {
          if (
            datos.categories.analytics === true ||
            datos.categories.marketing === true
          ) {
            enviarConsentimiento("partial", datos.categories);
            return true;
          } else if (
            datos.categories.essential === true &&
            datos.categories.functional === true &&
            datos.categories.analytics === false &&
            datos.categories.marketing === false
          ) {
            enviarConsentimiento("reject", null);
            return true;
          }
        }
        enviarConsentimiento("partial", datos);
        return true;
      } catch (error) {
        console.error("❌ Error parseando cookie:", error);
      }
    }
  }
  return false;
}

// ===== EVENTOS DE ZEST (por si funcionan) =====
document.addEventListener("zest:accepted", () =>
  enviarConsentimiento("all", null),
);
document.addEventListener("zest:rejected", () =>
  enviarConsentimiento("reject", null),
);
document.addEventListener("zest:saved", (e) =>
  enviarConsentimiento("partial", e.detail),
);

// ===== INICIALIZACIÓN =====
document.addEventListener("DOMContentLoaded", () => {
  // Una única comprobación al cargar (1s para dar margen a Zest)
  setTimeout(detectarCookieZest, 1000);
});

console.log("🍪 cookies-frontend.js cargado correctamente");
