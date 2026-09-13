<?php
/**
 * GeoPesca Child Theme functions and definitions
 */

add_action( 'wp_enqueue_scripts', 'geopesca_child_enqueue_styles' );

function geopesca_child_enqueue_styles() {
    wp_enqueue_style(
        'astra-parent-style',
        get_template_directory_uri() . '/style.css',
        array(),
        wp_get_theme()->parent()->get( 'Version' )
    );

    wp_enqueue_style(
        'geopesca-child-style',
        get_stylesheet_uri(),
        array( 'astra-parent-style' ),
        wp_get_theme()->get( 'Version' )
    );
}