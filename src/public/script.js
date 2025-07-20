document.addEventListener('DOMContentLoaded', () => {
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const systemPrompt = document.getElementById('system-prompt');
    const sendButton = document.getElementById('send-button');

    // Fungsi untuk menambahkan pesan ke chat
    function addMessage(content, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        messageDiv.classList.add(isUser ? 'user' : 'system');

        const messageContent = document.createElement('div');
        messageContent.classList.add('message-content');
        messageContent.textContent = content;

        messageDiv.appendChild(messageContent);
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        return messageDiv;
    }

    // Fungsi untuk menambahkan pesan loading
    function addLoadingMessage() {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', 'loading');

        const messageContent = document.createElement('div');
        messageContent.classList.add('message-content');
        messageContent.innerHTML = 'AI sedang mengetik<span class="loading-dots"></span>';

        messageDiv.appendChild(messageContent);
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        return messageDiv;
    }

    // Fungsi untuk mengirim pesan ke API
    async function sendMessage() {
        const message = userInput.value.trim();
        const systemPromptValue = systemPrompt.value.trim();
        
        if (!message) return;
        
        // Tambahkan pesan pengguna ke chat
        addMessage(message, true);
        
        // Tambahkan pesan loading
        const loadingMessage = addLoadingMessage();
        
        // Kosongkan input
        userInput.value = '';
        
        // Nonaktifkan tombol kirim
        sendButton.disabled = true;
        
        try {
            // Kirim permintaan ke API
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userMessage: message,
                    systemPrompt: systemPromptValue || 'You are a helpful assistant.'
                })
            });
            
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            
            // Hapus pesan loading
            chatMessages.removeChild(loadingMessage);
            
            // Buat pesan AI baru
            const aiMessageDiv = addMessage('', false);
            const aiMessageContent = aiMessageDiv.querySelector('.message-content');
            
            // Baca stream respons
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            
            let aiResponse = '';
            
            while (true) {
                const { value, done } = await reader.read();
                
                if (done) break;
                
                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split('\n\n');
                
                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = line.substring(6);
                        
                        if (data === '[DONE]') continue;
                        
                        try {
                            const parsed = JSON.parse(data);
                            if (parsed.content) {
                                aiResponse += parsed.content;
                                aiMessageContent.textContent = aiResponse;
                                chatMessages.scrollTop = chatMessages.scrollHeight;
                            }
                        } catch (e) {
                            console.error('Error parsing SSE data:', e);
                        }
                    }
                }
            }
            
        } catch (error) {
            console.error('Error:', error);
            // Hapus pesan loading
            chatMessages.removeChild(loadingMessage);
            // Tambahkan pesan error
            addMessage('Maaf, terjadi kesalahan saat berkomunikasi dengan AI.', false);
        } finally {
            // Aktifkan kembali tombol kirim
            sendButton.disabled = false;
        }
    }

    // Event listener untuk tombol kirim
    sendButton.addEventListener('click', sendMessage);

    // Event listener untuk input (Enter untuk mengirim)
    userInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
});