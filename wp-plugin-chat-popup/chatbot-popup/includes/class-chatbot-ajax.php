<?php

add_action('wp_ajax_cbp_send_message', 'cbp_send_message');
add_action('wp_ajax_nopriv_cbp_send_message', 'cbp_send_message');


function cbp_log_message($message) {
    // Thư mục lưu log (nằm trong wp-content)
    $log_dir = WP_CONTENT_DIR . '/chat_logs';

    // Tạo thư mục nếu chưa tồn tại
    if (!file_exists($log_dir)) {
        wp_mkdir_p($log_dir);
    }

    // Ngày hôm nay
    $date = date('Y-m-d');

    // Session
    if (!session_id()) {
        session_start();
    }
    $session_id = session_id();

    // User ID nếu đã đăng nhập
    $user_id = get_current_user_id();
    if (!$user_id) {
        $user_id = 'guest';
    }

    // Tên file log
    $file_name = $log_dir . "/chat_{$date}_user{$user_id}_{$session_id}.log";

    // Nội dung log
    $log_entry = date('H:i:s') . " | " . $message . PHP_EOL;

    // Ghi vào file
    file_put_contents($file_name, $log_entry, FILE_APPEND);
}



function cbp_send_message() {
    $query = sanitize_text_field($_POST['message']); // message chính là query
    $api_url = get_option('cbp_api_url');

    if (!$api_url) {
        wp_send_json_error('API chưa được cấu hình.');
    }

    // Lưu log tin nhắn của người dùng
    cbp_log_message($query);

    // Body JSON đúng yêu cầu
    $body = [
        'query' => $query,
        'top_k' => 20
    ];

    // Gửi POST JSON
    $response = wp_remote_post($api_url, [
        'body'    => json_encode($body),
        'headers' => [
            'Content-Type' => 'application/json'
        ],
        'timeout' => 20
    ]);

    if (is_wp_error($response)) {
        wp_send_json_error($response->get_error_message());
    }

    $body = wp_remote_retrieve_body($response);

    // Decode JSON từ API
    $data = json_decode($body, true);

    // Nếu decode lỗi hoặc API không trả JSON
    if ($data === null) {
        wp_send_json_error('Phản hồi API không hợp lệ.');
    }

    // Trả JSON đúng chuẩn
    wp_send_json_success($data);
}
