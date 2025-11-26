jQuery(document).ready(function($){
    // 1. Khai báo biến & Selector
    const chatIcon = $('#cbp-chat-icon');
    const chatWindow = $('#cbp-chat-window');
    const chatMessages = $('#cbp-chat-messages');
    const chatInput = $('#cbp-chat-input');
    const sendButton = $('#cbp-chat-send');
    const closeButton = $('#cbp-chat-close');

    const historyKey = 'cbp_chat_history';
    
    // Lấy lịch sử từ LocalStorage
    let history = [];
    try {
        history = JSON.parse(localStorage.getItem(historyKey) || '[]');
    } catch (e) {
        history = [];
    }

    // 2. Khởi tạo: Load lịch sử cũ
    // Tham số thứ 3 là 'false' để không lưu lại tin nhắn cũ vào storage lần nữa
    if(history.length > 0) {
        history.forEach(msg => appendMessage(msg.text, msg.type, false));
    }

    // 3. Xử lý Sự kiện (Event Listeners)
    
    // Toggle Chat
    chatIcon.click(function() {
        toggleChat();
    });

    closeButton.click(function() {
        toggleChat();
    });

    // Gửi tin nhắn
    sendButton.click(sendMessage);
    chatInput.keypress(function(e) {
        if(e.which == 13) sendMessage();
    });

    // 4. Các hàm chức năng (Functions)

    // Hàm Bật/Tắt Chat có Animation
    function toggleChat() {
        // Kiểm tra xem đang ẩn hay hiện
        const isHidden = chatWindow.css('display') === 'none';
    
        if (isHidden) {
            chatWindow.css('display', 'flex');
            // Timeout nhỏ để trình duyệt nhận diện thay đổi display trước khi add class animation
            setTimeout(() => {
                chatWindow.addClass('active');
    
                // Scroll đến tin nhắn cuối cùng
                chatMessages.scrollTop(chatMessages[0].scrollHeight);
            }, 10);
        } else {
            chatWindow.removeClass('active');
            // Đợi 300ms (khớp với transition CSS) rồi mới ẩn display
            setTimeout(() => chatWindow.css('display', 'none'), 300);
        }
    }
    

    // Hàm lấy URL Avatar
    function pluginURL(type){
        if(type === 'user') return ''; // User không cần avatar
        // Thay link này bằng link ảnh thực tế của bạn
        return 'https://raw.githubusercontent.com/congtuuit/assets/main/chatbot/bot-avatar.png';
    }

    // Hàm hiển thị tin nhắn
    // saveToHistory: mặc định là true (tin nhắn mới), false khi load lại trang
    function appendMessage(text, type = 'bot', saveToHistory = true) {
        let avatarHTML = '';
        
        // Chỉ tạo HTML avatar nếu là bot
        if (type === 'bot') {
            avatarHTML = `
                <div class="cbp-avatar">
                    <img src="${pluginURL(type)}" alt="Bot" onerror="this.style.display='none'" />
                </div>
            `;
        }

        const msgDiv = $(`
            <div class="cbp-msg ${type}">
                ${avatarHTML}
                <div class="cbp-text">${text}</div>
            </div>
        `);

        // Thêm vào DOM
        chatMessages.append(msgDiv);
        
        // Scroll mượt xuống dưới cùng
        chatMessages.stop().animate({ scrollTop: chatMessages.prop("scrollHeight") }, 500);

        // Lưu vào LocalStorage nếu cần
        if(saveToHistory){
            history.push({text, type});
            localStorage.setItem(historyKey, JSON.stringify(history));
        }
    }

    // Hàm hiển thị hiệu ứng "Đang gõ..."
    function showTypingIndicator() {
        const typingHtml = `
            <div class="cbp-msg bot typing-indicator" id="cbp-typing">
                <div class="cbp-avatar">
                    <img src="${pluginURL('bot')}" />
                </div>
                <div class="cbp-text" style="font-style: italic; color: #888;">
                    <span class="dot">.</span><span class="dot">.</span><span class="dot">.</span>
                </div>
            </div>
        `;
        chatMessages.append(typingHtml);
        chatMessages.stop().animate({ scrollTop: chatMessages.prop("scrollHeight") }, 500);
    }

    // Hàm xóa hiệu ứng "Đang gõ..."
    function removeTypingIndicator() {
        $('#cbp-typing').remove();
    }


    function formatMarkdownLinks(text) {
        const regex = /\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g;
        // Chuyển markdown [label](url) thành <a> ngay
        return text.replace(regex, function(_, label, url) {
            return `<a href="${url}" target="_blank" rel="noopener noreferrer">${label}</a>`;
        });
    }
    
    function appendMessageStreaming(text, type='bot', saveToHistory = true) {
        const formatted = formatMarkdownLinks(text);
    
        // Tách text vs HTML tags
        const parts = formatted.split(/(<a [^>]+>.*?<\/a>|<[^>]+>)/g).filter(Boolean);
    
        const msgDiv = $(`
            <div class="cbp-msg ${type}">
                <div class="cbp-avatar"><img src="${pluginURL(type)}" /></div>
                <div class="cbp-text"></div>
            </div>
        `);
        const textContainer = msgDiv.find('.cbp-text');
        chatMessages.append(msgDiv);
    
        let partIndex = 0;
        let charIndex = 0;
    
        function typeNext() {
            if (partIndex >= parts.length) {
                if (saveToHistory) {
                    history.push({ text: formatted, type });
                    localStorage.setItem(historyKey, JSON.stringify(history));
                }
                return;
            }
    
            const current = parts[partIndex];
    
            // Nếu là thẻ HTML <a ...> hoặc thẻ khác → append nguyên đoạn
            if (current.startsWith("<") && current.endsWith(">")) {
                textContainer.append(current);
                partIndex++;
                charIndex = 0;
                setTimeout(typeNext, 10);
                return;
            }
    
            // Nếu là text → gõ từng ký tự
            if (charIndex < current.length) {
                const ch = current.charAt(charIndex);
                textContainer.append(ch === "\n" ? "<br>" : ch);
                charIndex++;
    
                chatMessages.stop().animate({
                    scrollTop: chatMessages.prop("scrollHeight")
                }, 50);
    
                setTimeout(typeNext, 18);
                return;
            }
    
            partIndex++;
            charIndex = 0;
            setTimeout(typeNext, 10);
        }
    
        typeNext();
    }
    

    // Hàm Gửi tin nhắn chính
    function sendMessage() {
        const msg = chatInput.val().trim();
        if(!msg) return;

        // 1. Hiển thị tin nhắn User
        appendMessage(msg, 'user', true);
        chatInput.val(''); // Xóa ô nhập liệu

        // 2. Hiển thị "Đang gõ..."
        showTypingIndicator();

        // 3. Gửi AJAX
        $.post(cbp_ajax_obj.ajax_url, { 
            action: 'cbp_send_message', 
            message: msg 
        }, function(res){
            // Xóa "Đang gõ..." khi có phản hồi
            removeTypingIndicator();

            if(res.success){
                // res.data là object JSON trả từ API
                const api = res.data;

                // Lấy phần trả lời chính
                const answer = api.answer || "Xin lỗi, tôi không tìm thấy thông tin phù hợp.";

                //appendMessage(answer, 'bot', true);

                // Hiển thị kiểu ChatGPT
                appendMessageStreaming(answer, 'bot');

            } else {
                appendMessage('Xin lỗi, tôi đang gặp chút sự cố kết nối.', 'bot', true);
            }
        }).fail(function() {
            removeTypingIndicator();
            appendMessage('Lỗi kết nối server.', 'bot', true);
        });
    }
});