<?php
// wp-content/themes/your-child-theme/functions.php

// 1. Load parent theme styles
add_action('wp_enqueue_scripts', function () {

    // Parent theme CSS
    wp_enqueue_style(
        'parent-style',
        get_template_directory_uri() . '/style.css'
    );

    // Only load React bundle on the specific page (change 'home' to your page slug)
    if (!is_page('home')) return;

    wp_enqueue_style(
        'react-bundle-css',
        get_stylesheet_directory_uri() . '/dist/bundle.css',
        [],
        '1.0'
    );

    wp_enqueue_script(
        'react-bundle',
        get_stylesheet_directory_uri() . '/dist/bundle.js',
        [],
        '1.0',
        true // load in footer
    );

    // Pass WordPress data to React via window.wpData
    wp_localize_script('react-bundle', 'wpData', [
        'siteUrl' => get_site_url(),
        'apiUrl'  => rest_url('wp/v2/'),
        'nonce'   => wp_create_nonce('wp_rest'),
        'userId'  => get_current_user_id(),
    ]);
});
