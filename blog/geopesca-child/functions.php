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
 * PRUEBA 1 - wp_footer
 */
add_action( 'wp_footer', 'gp_prueba_footer' );

function gp_prueba_footer() {
    echo '<div style="background:red; color:white; padding:30px; text-align:center; font-size:24px; font-weight:bold;">PRUEBA FOOTER OK</div>';
}

/**
 * PRUEBA 2 - wp_head
 */
add_action( 'wp_head', 'gp_prueba_head' );

function gp_prueba_head() {
    echo '<div style="background:blue; color:white; padding:30px; text-align:center; font-size:24px; font-weight:bold;">PRUEBA HEAD OK</div>';
}