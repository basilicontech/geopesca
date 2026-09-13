// blog.js - Gestión del enlace al blog

// ============================================
// URL DE DESTINO
// ============================================

const URL_BLOG = "https://geopesca.basilicontech.com/blog/";

// ============================================
// FUNCIÓN
// ============================================

function abrirBlog() {
  window.open(URL_BLOG, "_blank");
}

// ============================================
// ASIGNACIÓN DE EVENTOS
// ============================================

document.addEventListener("DOMContentLoaded", function () {
  // Blog - Desktop
  const btnBlogDesktop = document.getElementById("btnBlogDesktop");
  if (btnBlogDesktop) {
    btnBlogDesktop.addEventListener("click", abrirBlog);
  }

  // Blog - Mobile
  const btnBlogMobile = document.getElementById("btnBlogMobile");
  if (btnBlogMobile) {
    btnBlogMobile.addEventListener("click", function () {
      if (typeof window.cerrarMenus === "function") window.cerrarMenus();
      abrirBlog();
    });
  }
});
