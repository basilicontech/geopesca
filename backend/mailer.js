// backend/mailer.js
const nodemailer = require("nodemailer");

// Transportador reutilizable
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587", 10),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Función genérica de envío con manejo de errores
async function enviarEmail({ to, subject, html }) {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    });
    console.log(`📧 Email enviado a ${to}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`❌ Error enviando email a ${to}:`, error.message);
    return { success: false, error: error.message };
  }
}

// --- Plantillas de correo predefinidas ---

// Para PESCADORES (registro)
function plantillaBienvenidaPescador(nombre) {
  return {
    subject: "🎣 ¡Bienvenido a GeoPesca!",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2c3e50;">¡Hola ${nombre}! 🎣</h2>
        <p>Tu cuenta de pescador en <strong>GeoPesca</strong> se ha creado correctamente.</p>
        <p>Ya puedes iniciar sesión y empezar a registrar tus jornadas de pesca con geolocalización.</p>
        <p style="margin-top: 30px;">
          <a href="${process.env.FRONTEND_URL}" 
             style="background-color: #3498db; color: white; padding: 12px 24px; 
                    text-decoration: none; border-radius: 5px;">
            Ir a GeoPesca
          </a>
        </p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #7f8c8d; font-size: 12px;">
          Si no te has registrado en GeoPesca, ignora este mensaje.
        </p>
      </div>
    `,
  };
}

// Para CLUBS (registro - solicitud recibida)
function plantillaSolicitudClub(nombre) {
  return {
    subject: "🏢 Solicitud de registro recibida - GeoPesca",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2c3e50;">Hola, ${nombre} 🏢</h2>
        <p>Hemos recibido tu solicitud de registro como <strong>club</strong> en GeoPesca.</p>
        <p>Tu cuenta está actualmente <strong>pendiente de validación</strong> por parte del administrador.</p>
        <p>Te notificaremos por email en cuanto tu club sea validado y puedas empezar a organizar concursos.</p>
        <p style="margin-top: 30px;">
          <a href="${process.env.FRONTEND_URL}" 
             style="background-color: #3498db; color: white; padding: 12px 24px; 
                    text-decoration: none; border-radius: 5px;">
            Visitar GeoPesca
          </a>
        </p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #7f8c8d; font-size: 12px;">
          Si no has solicitado este registro, ignora este mensaje.
        </p>
      </div>
    `,
  };
}

// Para CLUBS (validación por el administrador)
function plantillaClubValidado(nombre) {
  return {
    subject: "✅ ¡Tu club ha sido validado en GeoPesca!",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #27ae60;">¡Enhorabuena, ${nombre}! ✅</h2>
        <p>Tu club ha sido <strong>validado</strong> por el administrador de GeoPesca.</p>
        <p>Ya puedes iniciar sesión y empezar a organizar concursos de pesca deportiva.</p>
        <p style="margin-top: 30px;">
          <a href="${process.env.FRONTEND_URL}" 
             style="background-color: #27ae60; color: white; padding: 12px 24px; 
                    text-decoration: none; border-radius: 5px;">
            Iniciar sesión
          </a>
        </p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #7f8c8d; font-size: 12px;">
          Si tienes alguna duda, contacta con el administrador.
        </p>
      </div>
    `,
  };
}

// --- Plantillas de borrado de cuenta ---

function plantillaCuentaEliminadaPescador(nombre) {
  return {
    subject: "👋 Tu cuenta de pescador ha sido eliminada - GeoPesca",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2c3e50;">Hasta pronto, ${nombre} 👋</h2>
        <p>Tu cuenta de <strong>pescador</strong> en GeoPesca ha sido eliminada correctamente.</p>
        <p>Se han borrado también todas tus jornadas de pesca y capturas asociadas.</p>
        <p>Si no has sido tú, contacta con nosotros respondiendo a este correo lo antes posible.</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #7f8c8d; font-size: 12px;">
          Gracias por haber formado parte de la comunidad GeoPesca. 🎣
        </p>
      </div>
    `,
  };
}

function plantillaCuentaEliminadaClub(nombre) {
  return {
    subject: "👋 Tu cuenta de club ha sido eliminada - GeoPesca",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2c3e50;">Hasta pronto, ${nombre} 👋</h2>
        <p>La cuenta de tu <strong>club</strong> en GeoPesca ha sido eliminada correctamente.</p>
        <p>Se han borrado también todos los concursos que habías organizado y las capturas asociadas.</p>
        <p>Si no has sido tú, contacta con nosotros respondiendo a este correo lo antes posible.</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #7f8c8d; font-size: 12px;">
          Gracias por haber formado parte de la comunidad GeoPesca. 🎣
        </p>
      </div>
    `,
  };
}

// --- Avisos internos al administrador ---

async function avisarAdmin(evento, datos = {}) {
  const eventos = {
    registro_pescador: {
      subject: "🆕 Nuevo pescador registrado",
      body: `
        <h2>Nuevo pescador registrado</h2>
        <ul>
          <li><strong>Nombre:</strong> ${datos.nombre}</li>
          <li><strong>Email:</strong> ${datos.email}</li>
        </ul>
      `,
    },
    registro_club: {
      subject: "🆕 Nuevo club registrado (pendiente de validación)",
      body: `
        <h2>Nuevo club registrado</h2>
        <ul>
          <li><strong>Nombre:</strong> ${datos.nombre}</li>
          <li><strong>Email:</strong> ${datos.email}</li>
          <li><strong>Estado:</strong> Pendiente de validación</li>
        </ul>
      `,
    },
    validacion_club: {
      subject: "✅ Club validado",
      body: `
        <h2>Club validado</h2>
        <ul>
          <li><strong>Nombre:</strong> ${datos.nombre}</li>
          <li><strong>Email:</strong> ${datos.email}</li>
        </ul>
      `,
    },
    eliminacion_pescador: {
      subject: "🗑️ Cuenta de pescador eliminada",
      body: `
        <h2>Cuenta de pescador eliminada</h2>
        <ul>
          <li><strong>Nombre:</strong> ${datos.nombre}</li>
          <li><strong>Email:</strong> ${datos.email}</li>
          <li><strong>Jornadas eliminadas:</strong> ${datos.jornadas ?? "?"}</li>
        </ul>
      `,
    },
    eliminacion_club: {
      subject: "🗑️ Cuenta de club eliminada",
      body: `
        <h2>Cuenta de club eliminada</h2>
        <ul>
          <li><strong>Nombre:</strong> ${datos.nombre}</li>
          <li><strong>Email:</strong> ${datos.email}</li>
          <li><strong>Concursos eliminados:</strong> ${datos.concursos ?? "?"}</li>
        </ul>
      `,
    },
  };

  const config = eventos[evento];
  if (!config) {
    console.warn(`⚠️ Evento desconocido para aviso admin: ${evento}`);
    return;
  }

  return enviarEmail({
    to: process.env.ADMIN_EMAIL,
    subject: config.subject,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        ${config.body}
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #7f8c8d; font-size: 12px;">Aviso automático de GeoPesca.</p>
      </div>
    `,
  });
}

module.exports = {
  enviarEmail,
  plantillaBienvenidaPescador,
  plantillaSolicitudClub,
  plantillaClubValidado,
  plantillaCuentaEliminadaPescador,
  plantillaCuentaEliminadaClub,
  avisarAdmin,
};
