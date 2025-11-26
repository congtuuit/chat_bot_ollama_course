<?php
/**
 * Plugin Name: ChatBot Popup
 * Description: Plugin hiển thị ChatBot popup với API tùy chỉnh.
 * Version: 1.1
 * Author: Tú Văn
 */

if (!defined('ABSPATH')) exit;

// Include admin settings
include_once plugin_dir_path(__FILE__) . 'admin/admin-settings.php';

// Include AJAX handlers
include_once plugin_dir_path(__FILE__) . 'includes/class-chatbot-ajax.php';

// Enqueue frontend scripts and styles
function cbp_enqueue_scripts() {
    wp_enqueue_style('cbp-style', plugin_dir_url(__FILE__) . 'assets/css/chatbot-popup.css');
    wp_enqueue_script('cbp-script', plugin_dir_url(__FILE__) . 'assets/js/chatbot-popup.js', ['jquery'], null, true);

    // Localize ajax url
    wp_localize_script('cbp-script', 'cbp_ajax_obj', [
        'ajax_url' => admin_url('admin-ajax.php')
    ]);
}
add_action('wp_enqueue_scripts', 'cbp_enqueue_scripts');

// Display chatbot icon if enabled
function cbp_display_chatbot() {
    $enabled = get_option('cbp_enable_chatbot', 0);
    if (!$enabled) return;
    ?>
    <div id="cbp-chatbot">
        <div id="cbp-chat-icon" onclick="toggleChat()">
            <img src="https://raw.githubusercontent.com/congtuuit/assets/main/chatbot/bot-avatar.png" alt="ChatBot" />
        </div>
        <div id="cbp-chat-window">
            <div id="cbp-chat-header">
                <div id="cbp-chat-title">Trợ lý ReviewKhoaHoc.Net</div>
                <div id="cbp-chat-subtitle">Hỏi đáp 24/7</div>
                <div id="cbp-chat-close" onclick="toggleChat()">&times;</div>
            </div>
            <div id="cbp-chat-messages"></div>
            <div id="cbp-chat-input-area">
                <input type="text" id="cbp-chat-input" placeholder="Nhập câu hỏi của bạn..."/>
                <button id="cbp-chat-send">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                </button>
            </div>
        </div>
    </div>

    <?php
}
add_action('wp_footer', 'cbp_display_chatbot');
