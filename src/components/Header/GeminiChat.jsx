import { useState } from 'react';
import { sendQueryToGemini } from '../utils/Gemini';

function GeminiChat() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = { id: Date.now(), text: message.trim(), timestamp: new Date(), sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);

    try {
      const geminiResponse = await sendQueryToGemini(userMessage.text);
      setMessages(prev => [...prev, { id: Date.now() + 1, text: geminiResponse, timestamp: new Date(), sender: 'gemini' }]);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date) => date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

  return (
    <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#f9fafb', borderRadius: '6px', border: '1px solid #e5e7eb' }}>
      <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500', marginBottom: '8px' }}>
        How can I help you today?
      </div>
      
      <div style={{ maxHeight: '200px', overflowY: 'auto', marginBottom: '8px', backgroundColor: 'white', borderRadius: '4px', border: '1px solid #e5e7eb', padding: '6px' }}>
        {messages.length === 0 ? (
          <div style={{ fontSize: '11px', color: '#9ca3af', fontStyle: 'italic', textAlign: 'center', padding: '8px' }}>
            Ask anything!
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} style={{ fontSize: '11px', marginBottom: '8px', padding: '6px 8px', borderRadius: '6px', backgroundColor: msg.sender === 'user' ? '#dbeafe' : '#e0ffe0', border: `1px solid ${msg.sender === 'user' ? '#bfdbfe' : '#bfffbf'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                <span style={{ fontSize: '10px', color: '#6b7280', fontWeight: '500' }}>
                  {msg.sender === 'user' ? 'You' : 'Gemini'}
                </span>
                <span style={{ fontSize: '10px', color: '#9ca3af' }}>{formatTime(msg.timestamp)}</span>
              </div>
              <div style={{ color: '#374151', lineHeight: '1.4', whiteSpace: 'pre-wrap' }}>{msg.text}</div>
            </div>
          ))
        )}
        {isLoading && <div style={{ fontSize: '11px', fontStyle: 'italic', textAlign: 'center', padding: '8px', color: '#6b7280' }}>Gemini is typing...</div>}
      </div>

      <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-end' }}>
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} onKeyPress={handleKeyPress}
          placeholder="Start adding your prompt..."
          style={{ flex: 1, padding: '4px 8px', fontSize: '11px', border: '1px solid #d1d5db', borderRadius: '4px', outline: 'none', backgroundColor: 'white', resize: 'none', minHeight: '24px', maxHeight: '60px', fontFamily: 'inherit' }}
          rows={1} />
        <button onClick={handleSendMessage} disabled={!message.trim() || isLoading}
          style={{ padding: '4px 12px', fontSize: '11px', fontWeight: '500', border: '1px solid #d1d5db', borderRadius: '4px', backgroundColor: (!message.trim() || isLoading) ? '#f9fafb' : '#2563eb', color: (!message.trim() || isLoading) ? '#9ca3af' : 'white', cursor: (!message.trim() || isLoading) ? 'not-allowed' : 'pointer', transition: 'all 0.2s', height: '32px' }}>
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </div>
      
      <div style={{ fontSize: '10px', color: '#9ca3af', marginTop: '4px', textAlign: 'center' }}>
        Press Enter to send, Shift+Enter for new line
      </div>
    </div>
  );
}

export default GeminiChat;