<?php

function cbp_admin_menu() {
    add_menu_page(
        'ChatBot Popup',
        'ChatBot Popup',
        'manage_options',
        'chatbot-popup',
        'cbp_admin_page'
    );
}
add_action('admin_menu', 'cbp_admin_menu');

function cbp_admin_page() {
    if (isset($_POST['cbp_save_settings'])) {
        update_option('cbp_enable_chatbot', isset($_POST['cbp_enable_chatbot']) ? 1 : 0);
        update_option('cbp_api_url', sanitize_text_field($_POST['cbp_api_url']));
        echo '<div class="updated"><p>Cập nhật thành công!</p></div>';
    }

    $enabled = get_option('cbp_enable_chatbot', 0);
    $api_url = get_option('cbp_api_url', '');
    ?>
    <div class="wrap">
        <h1>ChatBot Popup Settings</h1>
        <form method="POST">
            <p>
                <label>
                    <input type="checkbox" name="cbp_enable_chatbot" <?php checked($enabled, 1); ?> />
                    Kích hoạt ChatBot trên website
                </label>
            </p>
            <p>
                <label>API URL:</label>
                <input type="text" name="cbp_api_url" value="<?php echo esc_attr($api_url); ?>" style="width: 400px;" />
            </p>
            <p>
                <input type="submit" name="cbp_save_settings" class="button button-primary" value="Lưu"/>
            </p>
        </form>
    </div>
    <?php
}
