import { useState } from 'react';

function ChatBox() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Get API key from environment variable
  const API_KEY = process.env.GEMINI_API_KEY;

  const callGeminiAPI = async (userMessage) => {
    if (!API_KEY) {
      return "Error: API key not configured. Please check your environment variables.";
    }

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: userMessage
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        return data.candidates[0].content.parts[0].text;
      } else {
        throw new Error('No response generated');
      }
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      return `Error: ${error.message}. Please try again.`;
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: message.trim(),
      timestamp: new Date(),
      sender: 'user'
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);

    // Get AI response
    const aiResponse = await callGeminiAPI(userMessage.text);
    
    const aiMessage = {
      id: Date.now() + 1,
      text: aiResponse,
      timestamp: new Date(),
      sender: 'ai'
    };

    setMessages(prev => [...prev, aiMessage]);
    setIsLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  // Show setup message if no API key
  if (!API_KEY) {
    return (
      <div style={{
        marginTop: '16px',
        padding: '12px',
        backgroundColor: '#fef2f2',
        borderRadius: '6px',
        border: '1px solid #fecaca'
      }}>
        <div style={{
          fontSize: '12px',
          color: '#dc2626',
          fontWeight: '500',
          marginBottom: '8px'
        }}>
          Gemini AI Chat - Configuration Required
        </div>
        
        <div style={{
          fontSize: '11px',
          color: '#7f1d1d',
          lineHeight: '1.4'
        }}>
          Please add your Gemini API key to your .env file:
          <br />
          <code style={{
            backgroundColor: 'rgba(0,0,0,0.1)',
            padding: '2px 4px',
            borderRadius: '2px',
            fontFamily: 'monospace'
          }}>
            GEMINI_API_KEY=your_api_key_here
          </code>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      marginTop: '16px',
      padding: '12px',
      backgroundColor: '#f9fafb',
      borderRadius: '6px',
      border: '1px solid #e5e7eb'
    }}>
      <div style={{
        fontSize: '12px',
        color: '#6b7280',
        fontWeight: '500',
        marginBottom: '8px'
      }}>
        Gemini AI Chat
      </div>
      
      {/* Messages display */}
      <div style={{
        maxHeight: '200px',
        overflowY: 'auto',
        marginBottom: '8px',
        backgroundColor: 'white',
        borderRadius: '4px',
        border: '1px solid #e5e7eb',
        padding: '6px'
      }}>
        {messages.length === 0 ? (
          <div style={{
            fontSize: '11px',
            color: '#9ca3af',
            fontStyle: 'italic',
            textAlign: 'center',
            padding: '8px'
          }}>
            Start a conversation with Gemini AI...
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} style={{
              fontSize: '11px',
              marginBottom: '8px',
              padding: '6px 8px',
              borderRadius: '6px',
              backgroundColor: msg.sender === 'user' ? '#dbeafe' : '#f3f4f6',
              border: `1px solid ${msg.sender === 'user' ? '#bfdbfe' : '#e5e7eb'}`,
              marginLeft: msg.sender === 'user' ? '20px' : '0',
              marginRight: msg.sender === 'ai' ? '20px' : '0'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '2px'
              }}>
                <span style={{
                  fontSize: '10px',
                  color: '#6b7280',
                  fontWeight: '500'
                }}>
                  {msg.sender === 'user' ? 'You' : 'Gemini AI'}
                </span>
                <span style={{
                  fontSize: '10px',
                  color: '#9ca3af'
                }}>
                  {formatTime(msg.timestamp)}
                </span>
              </div>
              <div style={{
                color: '#374151',
                lineHeight: '1.4',
                whiteSpace: 'pre-wrap'
              }}>
                {msg.text}
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div style={{
            fontSize: '11px',
            color: '#6b7280',
            fontStyle: 'italic',
            textAlign: 'center',
            padding: '8px'
          }}>
            Gemini AI is thinking...
          </div>
        )}
      </div>

      {/* Input area */}
      <div style={{
        display: 'flex',
        gap: '6px',
        alignItems: 'flex-end'
      }}>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask Gemini AI anything..."
          disabled={isLoading}
          style={{
            flex: 1,
            padding: '4px 8px',
            fontSize: '11px',
            border: '1px solid #d1d5db',
            borderRadius: '4px',
            outline: 'none',
            backgroundColor: 'white',
            resize: 'none',
            minHeight: '24px',
            maxHeight: '60px',
            fontFamily: 'inherit'
          }}
          rows={1}
        />
        <button
          onClick={handleSendMessage}
          disabled={isLoading || !message.trim()}
          style={{
            padding: '4px 12px',
            fontSize: '11px',
            fontWeight: '500',
            border: '1px solid #d1d5db',
            borderRadius: '4px',
            backgroundColor: isLoading || !message.trim() ? '#f9fafb' : '#2563eb',
            color: isLoading || !message.trim() ? '#9ca3af' : 'white',
            cursor: isLoading || !message.trim() ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
            height: '32px'
          }}
        >
          {isLoading ? '...' : 'Send'}
        </button>
      </div>
      
      <div style={{
        fontSize: '10px',
        color: '#9ca3af',
        marginTop: '4px',
        textAlign: 'center'
      }}>
        Press Enter to send, Shift+Enter for new line
      </div>
    </div>
  );
}

export default ChatBox;