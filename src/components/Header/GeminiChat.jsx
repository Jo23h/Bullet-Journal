import { GoogleGenerativeAI } from '@google/generative-ai';
import { useEffect, useState, useRef } from 'react';

function GeminiChat() {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY || 'your-api-key-here');
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const result = await model.generateContent(inputMessage);
      const response = await result.response;
      
      const aiMessage = {
        id: Date.now() + 1,
        text: response.text(),
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error generating response:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div style={styles.chatContainer}>
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        style={styles.chatToggleButton}
        onMouseEnter={(e) => e.target.style.backgroundColor = '#1d4ed8'}
        onMouseLeave={(e) => e.target.style.backgroundColor = '#2563eb'}
      >
        💬 Ask Gemini
      </button>

      {isChatOpen && (
        <div style={styles.chatWindow}>
          <div style={styles.chatHeader}>
            <div style={styles.chatHeaderLeft}>
              <div style={styles.geminiAvatar}>
                <span style={styles.geminiAvatarText}>G</span>
              </div>
              <span style={styles.chatTitle}>Gemini Assistant</span>
            </div>
            <button
              onClick={() => setIsChatOpen(false)}
              style={styles.closeButton}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              ✕
            </button>
          </div>

          <div style={styles.messagesContainer}>
            {messages.length === 0 && (
              <div style={styles.emptyState}>
                <div style={styles.emptyStateIcon}>💬</div>
                <p style={styles.emptyStateText}>Start a conversation with Gemini!</p>
              </div>
            )}
            
            {messages.map((message) => (
              <div
                key={message.id}
                style={{
                  ...styles.messageWrapper,
                  justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start'
                }}
              >
                <div
                  style={{
                    ...styles.messageBubble,
                    ...(message.sender === 'user' ? styles.userMessage : styles.aiMessage)
                  }}
                >
                  <p style={styles.messageText}>{message.text}</p>
                  <p style={{
                    ...styles.messageTime,
                    color: message.sender === 'user' ? 'rgba(255, 255, 255, 0.7)' : '#9ca3af'
                  }}>
                    {message.timestamp.toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div style={styles.messageWrapper}>
                <div style={{...styles.messageBubble, ...styles.aiMessage, ...styles.loadingMessage}}>
                  <div style={styles.loadingIcon}>⟳</div>
                  <span style={styles.loadingText}>Thinking...</span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          <div style={styles.chatInput}>
            <div style={styles.inputWrapper}>
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask Gemini anything..."
                style={styles.textInput}
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isLoading}
                style={{
                  ...styles.sendButton,
                  opacity: (!inputMessage.trim() || isLoading) ? 0.5 : 1,
                  cursor: (!inputMessage.trim() || isLoading) ? 'not-allowed' : 'pointer'
                }}
                onMouseEnter={(e) => {
                  if (!e.target.disabled) {
                    e.target.style.backgroundColor = '#1d4ed8';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!e.target.disabled) {
                    e.target.style.backgroundColor = '#2563eb';
                  }
                }}
              >
                ➤
              </button>
            </div>
            <p style={styles.inputHint}>
              Press Enter to send, Shift+Enter for new line
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default GeminiChat