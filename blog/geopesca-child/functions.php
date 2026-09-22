<?php
/**
 * GeoPesca Child Theme functions and definitions
 */

add_action( 'wp_enqueue_scripts', 'geopesca_child_enqueue_styles', PHP_INT_MAX );

function geopesca_child_enqueue_styles() {
    wp_enqueue_style(
        'geopesca-child-style',
        get_stylesheet_uri(),
        array(),
        wp_get_theme()->get( 'Version' )
    );
}

/**
 * Footer personalizado de Bitácora Pesca
 */
add_action( 'wp_footer', 'gp_footer_personalizado', 100 );

function gp_footer_personalizado() {
    ?>
    <footer class="footer">
      <p>
        © 2026 - Registro de Jornadas de Pesca Recreativa |
        <a href="/blog/aviso-legal/">Aviso legal</a> |
        <a href="/blog/politica-de-privacidad/">Política de privacidad</a> |
        <a href="/blog/politica-de-cookies/">Política de cookies</a> |
        <a href="/blog/condiciones-de-uso/">Condiciones de uso</a> |
        <a href="mailto:basilicontech@gmail.com">Contacto: basilicontech@gmail.com</a>
      </p>
      <p>Sistema de Información Geográfica para pescadores recreativos</p>
    </footer>
    <?php
}