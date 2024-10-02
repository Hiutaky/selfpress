<?php
/**
 * Plugin Name: SelfPress Utils
 * Description: A set of custom tools used by SelfPress
 * Version: 1.0
 * Author: Alessandro De Cristofaro
 * Author URI: https://selfpress.xyz
 * License: GPL2
 */

defined('ABSPATH') or die('No script kiddies please!');
add_action('init', 'bta_handle_authentication');

function bta_handle_authentication() {
    if (isset($_GET['accessToken'])) {
        $accessToken = sanitize_text_field($_GET['accessToken']);
        $credentials = explode(':', base64_decode($accessToken));
        if (count($credentials) === 2) {
            $username = $credentials[0];
            $password = $credentials[1];
            $user = wp_authenticate($username, $password);
            if (!is_wp_error($user)) {
                wp_set_current_user($user->ID);
                wp_set_auth_cookie($user->ID);
                wp_redirect(admin_url());
                exit;
            } else {
                wp_die('Credentials not valid.');
            }
        } else {
            wp_die('Format not valid.');
        }
    }
}
