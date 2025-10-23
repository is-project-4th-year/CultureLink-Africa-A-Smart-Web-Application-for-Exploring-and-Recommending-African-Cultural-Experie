// src/pages/Chat/ChatInterface.js
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getChatbotResponse, initializeChatbot } from '../../services/chatbotService';
import { saveMessage, loadChatHistory, clearChatHistory } from '../../services/chatHistoryService';
import { Send, Bot, User, Loader, Trash2 } from 'lucide-react';
import './ChatInterface.css';

const ChatInterface = () => {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const messagesEndRef = useRef(null);

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize chatbot
  useEffect(() => {
    const init = async () => {
      const success = await initializeChatbot();
      if (success) {
        setInitialized(true);
        console.log('✅ Chatbot initialized with cultural data');
      } else {
        console.error('❌ Failed to initialize chatbot');
      }
    };
    init();
  }, []);

  // Load chat history when user is available
  useEffect(() => {
    const loadHistory = async () => {
      if (currentUser && !historyLoaded) {
        const history = await loadChatHistory(currentUser.uid);
        
        if (history.length > 0) {
          setMessages(history);
          console.log(`✅ Loaded ${history.length} messages from history`);
        } else {
          // Show welcome message only if no history
          setMessages([{
            role: 'assistant',
            content: 'Jambo! 🇰🇪 I\'m your Kenyan culture assistant. Ask me anything about Kenyan tribes, traditions, languages, foods, ceremonies, or customs!',
            timestamp: new Date()
          }]);
        }
        setHistoryLoaded(true);
      } else if (!currentUser) {
        // User not logged in - show welcome message without history
        setMessages([{
          role: 'assistant',
          content: 'Jambo! 🇰🇪 I\'m your Kenyan culture assistant. Ask me anything about Kenyan tribes, traditions, languages, foods, ceremonies, or customs!',
          timestamp: new Date()
        }]);
        setHistoryLoaded(true);
      }
    };
    
    if (initialized) {
      loadHistory();
    }
  }, [currentUser, initialized, historyLoaded]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Save user message to Firestore
    if (currentUser) {
      await saveMessage(currentUser.uid, userMessage);
    }
    
    setInput('');
    setLoading(true);

    try {
      const history = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const response = await getChatbotResponse(input, history);

      const aiMessage = {
        role: 'assistant',
        content: response.message,
        sources: response.sources,
        sourcesCount: response.sourcesCount,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
      // Save AI message to Firestore
      if (currentUser) {
        await saveMessage(currentUser.uid, aiMessage);
      }

    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
        error: true
      };
      setMessages(prev => [...prev, errorMessage]);
      
      if (currentUser) {
        await saveMessage(currentUser.uid, errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = async () => {
    if (!currentUser) return;
    
    const confirmClear = window.confirm('Are you sure you want to clear your chat history? This cannot be undone.');
    
    if (confirmClear) {
      await clearChatHistory(currentUser.uid);
      setMessages([{
        role: 'assistant',
        content: 'Jambo! 🇰🇪 I\'m your Kenyan culture assistant. Ask me anything about Kenyan tribes, traditions, languages, foods, ceremonies, or customs!',
        timestamp: new Date()
      }]);
      console.log('✅ Chat history cleared');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-page">
      <div className="chat-container">
        {/* Header */}
        <div className="chat-header">
          <div className="header-content">
            <Bot size={40} className="header-icon" />
            <div className="header-text">
              <h1>Kenyan Culture Assistant</h1>
              <p>Powered by Qwen AI • {initialized ? '342 cultural facts loaded' : 'Loading...'}</p>
            </div>
          </div>
          {currentUser && messages.length > 1 && (
            <button onClick={handleClearHistory} className="clear-btn" title="Clear chat history">
              <Trash2 size={20} />
            </button>
          )}
        </div>

        {/* Messages */}
        <div className="chat-messages">
          {messages.map((msg, idx) => (
            <div key={idx} className={`message ${msg.role}`}>
              <div className="message-avatar">
                {msg.role === 'user' ? (
                  currentUser?.photoURL ? (
                    <img 
                      src={currentUser.photoURL} 
                      alt="User" 
                      className="avatar-image"
                    />
                  ) : (
                    <User size={24} />
                  )
                ) : (
                  <Bot size={24} />
                )}
              </div>
              <div className="message-bubble">
                <p className="message-text">{msg.content}</p>
                {msg.sources && msg.sources.length > 0 && (
                  <div className="message-sources">
                    <small>📚 Sources used: {msg.sources.slice(0, 2).join(', ')}
                      {msg.sources.length > 2 && ` +${msg.sources.length - 2} more`}
                    </small>
                  </div>
                )}
                <span className="message-time">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="message assistant">
              <div className="message-avatar">
                <Bot size={24} />
              </div>
              <div className="message-bubble loading">
                <Loader size={20} className="spinner" />
                <span>Thinking...</span>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="chat-input-container">
          <div className="chat-input">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about Kenyan culture, traditions, languages..."
              disabled={!initialized || loading}
            />
            <button 
              onClick={handleSend} 
              disabled={!input.trim() || !initialized || loading}
              className="send-button"
            >
              <Send size={20} />
            </button>
          </div>
          <p className="input-hint">
            Try: "Tell me about Maasai warriors" or "What foods do Kikuyu people eat?"
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;