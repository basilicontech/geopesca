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

add_action( 'wp_footer', 'gp_test_footer' );

function gp_test_footer() {
    echo '<div style="background:#ff0000; color:#ffffff; padding:20px; text-align:center; font-size:18px; font-weight:bold;">TEST FOOTER - El functions.php funciona</div>';
}