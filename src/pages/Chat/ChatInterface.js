// src/pages/Chat/ChatInterface.js - Updated with Auto-naming and Rename
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import ReactMarkdown from 'react-markdown';
import { getChatbotResponse, initializeChatbot } from '../../services/chatbotService';
import { 
  createChatSession, 
  getChatSessions, 
  deleteChatSession,
  saveSessionMessage,
  loadSessionMessages,
  updateSession,
  renameSession,
  updateSessionTitle
} from '../../services/chatSessionService';
import { Send, Bot, User, Loader, Trash2, Plus, MessageSquare, Edit2, Check, X } from 'lucide-react';
import './ChatInterface.css';

const ChatInterface = () => {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  
  // Session management
  const [sessions, setSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [sessionsLoaded, setSessionsLoaded] = useState(false);
  
  // Rename functionality
  const [renamingSessionId, setRenamingSessionId] = useState(null);
  const [renameValue, setRenameValue] = useState('');
  
  const messagesEndRef = useRef(null);
  const renameInputRef = useRef(null);

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus rename input when editing starts
  useEffect(() => {
    if (renamingSessionId && renameInputRef.current) {
      renameInputRef.current.focus();
      renameInputRef.current.select();
    }
  }, [renamingSessionId]);

  // Initialize chatbot
  useEffect(() => {
    const init = async () => {
      const success = await initializeChatbot();
      if (success) {
        setInitialized(true);
        console.log('Chatbot initialized with cultural data');
      } else {
        console.error('Failed to initialize chatbot');
      }
    };
    init();
  }, []);

  // Load chat sessions when user is available
  useEffect(() => {
    const loadSessions = async () => {
      if (currentUser && initialized && !sessionsLoaded) {
        const userSessions = await getChatSessions(currentUser.uid);
        setSessions(userSessions);
        
        if (userSessions.length > 0) {
          // Load the most recent session
          const latestSession = userSessions[0];
          setCurrentSessionId(latestSession.id);
          const sessionMessages = await loadSessionMessages(currentUser.uid, latestSession.id);
          setMessages(sessionMessages);
        } else {
          // No sessions, create a new one
          await handleNewChat();
        }
        
        setSessionsLoaded(true);
      } else if (!currentUser && initialized) {
        // User not logged in - show welcome message
        setMessages([{
          role: 'assistant',
          content: 'Jambo! 🇰🇪 I\'m your Kenyan culture assistant. Ask me anything about Kenyan tribes, traditions, languages, foods, ceremonies, or customs!',
          timestamp: new Date()
        }]);
        setSessionsLoaded(true);
      }
    };
    
    loadSessions();
  }, [currentUser, initialized, sessionsLoaded]);

  // Create new chat session
  const handleNewChat = async () => {
    if (!currentUser) {
      // Just reset messages for non-logged in users
      setMessages([{
        role: 'assistant',
        content: 'Jambo! 🇰🇪 I\'m your Kenyan culture assistant. Ask me anything about Kenyan tribes, traditions, languages, foods, ceremonies, or customs!',
        timestamp: new Date()
      }]);
      setCurrentSessionId(null);
      return;
    }

    try {
      // Create new session with placeholder title
      const newSessionId = await createChatSession(currentUser.uid, 'New Chat');
      
      // Reset messages with welcome message
      const welcomeMessage = {
        role: 'assistant',
        content: 'Jambo! 🇰🇪 I\'m your Kenyan culture assistant. Ask me anything about Kenyan tribes, traditions, languages, foods, ceremonies, or customs!',
        timestamp: new Date()
      };
      
      setMessages([welcomeMessage]);
      setCurrentSessionId(newSessionId);
      
      // Save welcome message to session
      await saveSessionMessage(currentUser.uid, newSessionId, welcomeMessage);
      
      // Reload sessions list
      const userSessions = await getChatSessions(currentUser.uid);
      setSessions(userSessions);
      
      console.log('Created new chat session:', newSessionId);
    } catch (error) {
      console.error('Error creating new chat:', error);
    }
  };

  // Load specific session
  const handleLoadSession = async (sessionId) => {
    if (!currentUser || sessionId === currentSessionId) return;
    
    try {
      setLoading(true);
      const sessionMessages = await loadSessionMessages(currentUser.uid, sessionId);
      setMessages(sessionMessages);
      setCurrentSessionId(sessionId);
      console.log('Loaded session:', sessionId);
    } catch (error) {
      console.error('Error loading session:', error);
    } finally {
      setLoading(false);
    }
  };

  // Start renaming a session
  const handleStartRename = (sessionId, currentTitle, e) => {
    e.stopPropagation();
    setRenamingSessionId(sessionId);
    setRenameValue(currentTitle);
  };

  // Save renamed session
  const handleSaveRename = async (sessionId) => {
    if (!currentUser || !renameValue.trim()) {
      setRenamingSessionId(null);
      return;
    }

    try {
      await renameSession(currentUser.uid, sessionId, renameValue.trim());
      
      // Update local sessions list
      setSessions(prevSessions =>
        prevSessions.map(session =>
          session.id === sessionId
            ? { ...session, title: renameValue.trim(), isRenamed: true }
            : session
        )
      );
      
      setRenamingSessionId(null);
      console.log('Renamed session:', sessionId);
    } catch (error) {
      console.error('Error renaming session:', error);
      alert('Failed to rename chat. Please try again.');
    }
  };

  // Cancel renaming
  const handleCancelRename = () => {
    setRenamingSessionId(null);
    setRenameValue('');
  };

  // Handle Enter key in rename input
  const handleRenameKeyPress = (e, sessionId) => {
    if (e.key === 'Enter') {
      handleSaveRename(sessionId);
    } else if (e.key === 'Escape') {
      handleCancelRename();
    }
  };

  // Delete a session
  const handleDeleteSession = async (sessionId, e) => {
    e.stopPropagation();
    
    if (!currentUser) return;
    
    const confirmDelete = window.confirm('Are you sure you want to delete this chat? This cannot be undone.');
    
    if (!confirmDelete) return;
    
    try {
      await deleteChatSession(currentUser.uid, sessionId);
      
      // Reload sessions
      const userSessions = await getChatSessions(currentUser.uid);
      setSessions(userSessions);
      
      // If deleted current session, create new one
      if (sessionId === currentSessionId) {
        await handleNewChat();
      }
      
      console.log('Deleted session:', sessionId);
    } catch (error) {
      console.error('Error deleting session:', error);
    }
  };

  // Send message
  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userInput = input.trim();

    // If no current session and user is logged in, create one with the user's message
    if (!currentSessionId && currentUser) {
      const newSessionId = await createChatSession(currentUser.uid, userInput);
      setCurrentSessionId(newSessionId);
      
      // Reload sessions list
      const userSessions = await getChatSessions(currentUser.uid);
      setSessions(userSessions);
    }

    const userMessage = {
      role: 'user',
      content: userInput,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Save user message to session
    if (currentUser && currentSessionId) {
      await saveSessionMessage(currentUser.uid, currentSessionId, userMessage);
      
      // Update session title with first user message (if not renamed)
      if (messages.length === 1) { // Only welcome message exists
        await updateSessionTitle(currentUser.uid, currentSessionId, userInput);
        
        // Update local sessions list
        setSessions(prevSessions =>
          prevSessions.map(session =>
            session.id === currentSessionId && !session.isRenamed
              ? { ...session, title: userInput.substring(0, 40) + (userInput.length > 40 ? '...' : '') }
              : session
          )
        );
      }
    }
    
    setInput('');
    setLoading(true);

    try {
      const history = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const response = await getChatbotResponse(userInput, history);

      const aiMessage = {
        role: 'assistant',
        content: response.message,
        sources: response.sources,
        sourcesCount: response.sourcesCount,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
      // Save AI message to session
      if (currentUser && currentSessionId) {
        await saveSessionMessage(currentUser.uid, currentSessionId, aiMessage);
        
        // Update session with message count
        await updateSession(currentUser.uid, currentSessionId, messages.length + 2);
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
      
      if (currentUser && currentSessionId) {
        await saveSessionMessage(currentUser.uid, currentSessionId, errorMessage);
      }
    } finally {
      setLoading(false);
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
      <div className="main-chat-layout">
        
        {/* Sessions Sidebar */}
        <div className="chatbot-info-panel">
          <h2>
            <MessageSquare size={20} style={{ marginRight: '8px' }} />
            Chat Sessions
          </h2>
          
          {/* New Chat Button */}
          <button 
            className="new-chat-btn" 
            onClick={handleNewChat}
            disabled={!initialized}
          >
            <Plus size={18} />
            New Chat
          </button>
          
          {/* Session List */}
          <div className="session-list-container">
            {currentUser ? (
              <div className="session-list">
                {sessions.length === 0 ? (
                  <p style={{ textAlign: 'center', color: '#8A7E70', fontSize: '0.9rem', marginTop: '2rem' }}>
                    No chat sessions yet. Start a new chat!
                  </p>
                ) : (
                  sessions.map(session => (
                    <div
                      key={session.id}
                      className={`session-item ${session.id === currentSessionId ? 'active' : ''}`}
                      onClick={() => renamingSessionId !== session.id && handleLoadSession(session.id)}
                    >
                      <MessageSquare size={16} className="session-icon" />
                      
                      {renamingSessionId === session.id ? (
                        <div className="rename-input-container" onClick={(e) => e.stopPropagation()}>
                          <input
                            ref={renameInputRef}
                            type="text"
                            className="rename-input"
                            value={renameValue}
                            onChange={(e) => setRenameValue(e.target.value)}
                            onKeyDown={(e) => handleRenameKeyPress(e, session.id)}
                            onBlur={() => handleSaveRename(session.id)}
                            maxLength={50}
                          />
                          <div className="rename-actions">
                            <button
                              className="rename-action-btn save"
                              onClick={() => handleSaveRename(session.id)}
                              title="Save"
                            >
                              <Check size={12} />
                            </button>
                            <button
                              className="rename-action-btn cancel"
                              onClick={handleCancelRename}
                              title="Cancel"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <span className="session-item-title">{session.title || 'Untitled Chat'}</span>
                          <div className="session-actions">
                            <button
                              className="session-action-btn"
                              onClick={(e) => handleStartRename(session.id, session.title, e)}
                              title="Rename chat"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              className="session-action-btn delete"
                              onClick={(e) => handleDeleteSession(session.id, e)}
                              title="Delete chat"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))
                )}
              </div>
            ) : (
              <p style={{ textAlign: 'center', color: '#8A7E70', fontSize: '0.9rem', marginTop: '2rem' }}>
                Log in to save and view chat history
              </p>
            )}
          </div>
          
          {/* Static Info */}
          <div className="session-static-info">
            <p>
              Status: {initialized ? 'Online • 342 cultural facts loaded' : 'Initializing...'}
            </p>
          </div>
        </div>
        
        {/* Main Chat Interface */}
        <div className="chat-container">
          {/* Header */}
          <div className="chat-header">
            <div className="header-content">
              <Bot size={30} className="header-icon" />
              <div className="header-text">
                <h1>Kenyan Culture Assistant (Shujaa AI)</h1>
                <p>Powered by Qwen AI</p>
              </div>
            </div>
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
                      <User size={20} />
                    )
                  ) : (
                    <Bot size={20} />
                  )}
                </div>
                <div className="message-bubble">
                  <div className="message-text">
  <ReactMarkdown>{msg.content}</ReactMarkdown>
</div>

                  {msg.sources && msg.sources.length > 0 && (
                    <div className="message-sources">
                      <small>Sources used: {msg.sources.slice(0, 2).join(', ')}
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
                  <Bot size={20} />
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
    </div>
  );
};

export default ChatInterface;