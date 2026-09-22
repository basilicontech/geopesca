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
    <footer class="gp-footer">
      <p>
        <a href="https://bitacorapesca.basilicontech.com/aviso-legal.html">Aviso legal</a> |
        <a href="https://bitacorapesca.basilicontech.com/politica-privacidad.html">Política de privacidad</a> |
        <a href="https://bitacorapesca.basilicontech.com/politica-de-cookies.html">Política de cookies</a> |
        <a href="https://bitacorapesca.basilicontech.com/condiciones-de-uso.html">Condiciones de uso</a> |
        <a href="mailto:basilicontech@gmail.com">Contacto: basilicontech@gmail.com</a>
      </p>
    </footer>
    <?php
}