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
add_filter( 'astra_footer_copyright', 'gp_footer_copyright' );

function gp_footer_copyright() {
    $html  = '<p>© 2026 - Registro de Jornadas de Pesca Recreativa | ';
    $html .= '<a href="/blog/aviso-legal/">Aviso legal</a> | ';
    $html .= '<a href="/blog/politica-de-privacidad/">Política de privacidad</a> | ';
    $html .= '<a href="/blog/politica-de-cookies/">Política de cookies</a> | ';
    $html .= '<a href="/blog/condiciones-de-uso/">Condiciones de uso</a> | ';
    $html .= '<a href="mailto:basilicontech@gmail.com">Contacto: basilicontech@gmail.com</a></p>';
    $html .= '<p>Sistema de Información Geográfica para pescadores recreativos</p>';
    return $html;
}