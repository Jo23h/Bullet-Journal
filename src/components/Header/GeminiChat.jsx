import {useState} from 'react';
import {sendQueryToGemini} from '../utils/Gemini';

function GeminiChat() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = { 
      id: Date.now(), 
      text: message.trim(), 
      timestamp: new Date(), 
      sender: 'user' 
    };
    
    setMessages(existingMessage => [...existingMessage, userMessage]);
    setMessage('');
    setIsLoading(true);

    try {
      const geminiResponse = await sendQueryToGemini(userMessage.text);
      setMessages(existingMessage => [...existingMessage, { 
        id: Date.now() + 1, 
        text: geminiResponse, 
        timestamp: new Date(), 
        sender: 'gemini' 
      }]);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date) => 
    date.toLocaleTimeString('en-US', {hour: 'numeric', minute: '2-digit', hour12: true});

  return (
    <div className="gemini-chat">
      <div className="gemini-title">How can I help you today?</div>
      
      <div className="gemini-messages">
        {messages.length === 0 ? (
          <div className="gemini-empty">Ask anything!</div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={`gemini-message ${msg.sender === 'user' ? 'user' : 'ai'}`}>
              <div className="gemini-message-header">
                <span className="gemini-sender">
                  {msg.sender === 'user' ? 'You' : 'Gemini'}
                </span>
                <span className="gemini-time">{formatTime(msg.timestamp)}</span>
              </div>
              <div className="gemini-text">{msg.text}</div>
            </div>
          ))
        )}
        {isLoading && <div className="gemini-loading">Gemini is typing...</div>}
      </div>

      <div className="gemini-input-row">
        <textarea 
          value={message} 
          onChange={(e) => setMessage(e.target.value)} 
          onKeyDown={handleKeyDown}
          placeholder="Start adding your prompt..."
          className="gemini-textarea"
          rows={1} 
        />
        <button 
          onClick={handleSendMessage} 
          disabled={!message.trim() || isLoading}
          className="gemini-send-btn"
        >
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </div>
      
      <div className="gemini-hint">
        Press Enter to send, Shift+Enter for new line
      </div>
    </div>
  );
}

export default GeminiChat;