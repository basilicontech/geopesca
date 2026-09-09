// cookies-frontend.js
// Escucha los eventos de Zest y envía el consentimiento al servidor

function enviarConsentimiento(tipo, configuracion) {
  const datos = {
    tipo: tipo, // 'all', 'reject', 'partial'
    configuracion: configuracion || null,
    fecha: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href,
    version: "1.0",
  };

  console.log(`📤 Enviando consentimiento: ${tipo}`, datos);

  fetch("/api/registrar-consentimiento", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(datos),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error al guardar el consentimiento");
      }
      return response.json();
    })
    .then((data) => {
      console.log("✅ Consentimiento guardado correctamente:", data);
    })
    .catch((error) => {
      console.error("❌ Error al enviar el consentimiento:", error);
    });
}

// ===== DETECCIÓN DE LA COOKIE DE ZEST =====
function detectarCookieZest() {
  console.log("🔍 Buscando cookie zest_consent...");
  
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    const trimmedCookie = cookie.trim();
    if (trimmedCookie.startsWith('zest_consent=')) {
      console.log('🍪 Cookie encontrada:', trimmedCookie);
      
      try {
        // Extraer el valor de la cookie
        const value = trimmedCookie.substring('zest_consent='.length);
        const decoded = decodeURIComponent(value);
        console.log('📦 Valor decodificado:', decoded);
        
        const datos = JSON.parse(decoded);
        console.log('✅ Datos parseados:', datos);
        
        // Verificar las categorías
        if (datos.categories) {
          // Si tiene analytics o marketing en true, es aceptación parcial
          if (datos.categories.analytics === true || datos.categories.marketing === true) {
            console.log('📊 Usuario aceptó cookies de analytics/marketing');
            enviarConsentimiento('partial', datos.categories);
            return true;
          }
          // Si solo tiene essential y functional (las básicas), podría ser rechazo
          else if (datos.categories.essential === true && 
                   datos.categories.functional === true && 
                   datos.categories.analytics === false && 
                   datos.categories.marketing === false) {
            console.log('❌ Usuario solo aceptó cookies esenciales (rechazo)');
            enviarConsentimiento('reject', null);
            return true;
          }
        }
        
        // Si no podemos determinar, lo guardamos como partial
        console.log('⚙️ Estado desconocido, guardando como partial');
        enviarConsentimiento('partial', datos);
        return true;
        
      } catch (error) {
        console.error('❌ Error parseando cookie:', error);
      }
    }
  }
  
  console.log('ℹ️ No se encontró cookie zest_consent');
  return false;
}

// ===== MONITOREAR CAMBIOS EN COOKIES =====
function monitorearCookies() {
  let ultimaCookie = document.cookie;
  
  setInterval(() => {
    const cookieActual = document.cookie;
    if (cookieActual !== ultimaCookie) {
      console.log('🔔 Cambio detectado en cookies');
      ultimaCookie = cookieActual;
      
      // Esperar un momento y detectar
      setTimeout(detectarCookieZest, 500);
    }
  }, 1000);
  
  console.log("✅ Monitoreo de cookies activado");
}

// ===== EVENTOS DE ZEST (por si funcionan) =====
document.addEventListener("zest:accepted", function (e) {
  console.log("🔔 Evento zest:accepted detectado");
  enviarConsentimiento("all", null);
});

document.addEventListener("zest:rejected", function (e) {
  console.log("🔔 Evento zest:rejected detectado");
  enviarConsentimiento("reject", null);
});

document.addEventListener("zest:saved", function (e) {
  console.log("🔔 Evento zest:saved detectado");
  console.log("  Detalles:", e.detail);
  enviarConsentimiento("partial", e.detail);
});

// ===== INICIALIZACIÓN =====
document.addEventListener("DOMContentLoaded", function() {
  console.log("🚀 Inicializando sistema de cookies...");
  
  // Detectar cookie existente después de 1 segundo
  setTimeout(() => {
    detectarCookieZest();
  }, 1000);
  
  // Activar monitoreo de cookies
  monitorearCookies();
  
  // Comprobación periódica (cada 3 segundos, 5 veces)
  let intentos = 0;
  const intervalo = setInterval(() => {
    intentos++;
    if (intentos <= 5) {
      console.log(`🔄 Comprobación periódica #${intentos}`);
      detectarCookieZest();
    } else {
      clearInterval(intervalo);
      console.log('⏹️ Fin de comprobaciones periódicas');
    }
  }, 3000);
});

console.log("🍪 cookies-frontend.js cargado correctamente");