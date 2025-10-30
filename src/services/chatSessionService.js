// src/services/chatSessionService.js - Updated with Auto-naming and Rename
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  getDocs, 
  query, 
  orderBy,
  serverTimestamp,
  getDoc 
} from 'firebase/firestore';
import { db } from '../firebase/config';

// Generate a smart title from the first message
const generateTitleFromMessage = (message) => {
  if (!message || message.trim().length === 0) {
    return 'New Chat';
  }
  
  // Take first 40 characters for the title
  let title = message.trim().substring(0, 40);
  
  // If we cut off mid-word, try to end at last complete word
  if (message.length > 40) {
    const lastSpace = title.lastIndexOf(' ');
    if (lastSpace > 20) {
      title = title.substring(0, lastSpace);
    }
    title += '...';
  }
  
  return title;
};

// Create a new chat session
export const createChatSession = async (userId, firstMessage = '') => {
  try {
    const sessionsRef = collection(db, 'users', userId, 'chatSessions');
    
    // Generate smart title from first message
    const title = generateTitleFromMessage(firstMessage);
    
    const newSession = await addDoc(sessionsRef, {
      title,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      messageCount: 0,
      isRenamed: false // Track if user manually renamed it
    });
    
    console.log('Created new chat session:', newSession.id, 'with title:', title);
    return newSession.id;
  } catch (error) {
    console.error('Error creating chat session:', error);
    throw error;
  }
};

// Get all chat sessions for a user
export const getChatSessions = async (userId) => {
  try {
    const sessionsRef = collection(db, 'users', userId, 'chatSessions');
    const q = query(sessionsRef, orderBy('updatedAt', 'desc'));
    const snapshot = await getDocs(q);
    
    const sessions = [];
    snapshot.forEach(doc => {
      sessions.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return sessions;
  } catch (error) {
    console.error('Error loading chat sessions:', error);
    return [];
  }
};

// Rename a session (manual rename by user)
export const renameSession = async (userId, sessionId, newTitle) => {
  try {
    if (!newTitle || newTitle.trim().length === 0) {
      throw new Error('Title cannot be empty');
    }
    
    const sessionRef = doc(db, 'users', userId, 'chatSessions', sessionId);
    await updateDoc(sessionRef, {
      title: newTitle.trim(),
      isRenamed: true, // Mark as manually renamed
      updatedAt: serverTimestamp()
    });
    
    console.log('Renamed session:', sessionId, 'to:', newTitle);
  } catch (error) {
    console.error('Error renaming session:', error);
    throw error;
  }
};

// Update session title from first message (auto-update, only if not manually renamed)
export const updateSessionTitle = async (userId, sessionId, title) => {
  try {
    const sessionRef = doc(db, 'users', userId, 'chatSessions', sessionId);
    const sessionDoc = await getDoc(sessionRef);
    
    // Only auto-update if user hasn't manually renamed it
    if (sessionDoc.exists() && !sessionDoc.data().isRenamed) {
      await updateDoc(sessionRef, {
        title,
        updatedAt: serverTimestamp()
      });
      console.log('Auto-updated session title:', title);
    }
  } catch (error) {
    console.error('Error updating session title:', error);
  }
};

// Update session (last activity)
export const updateSession = async (userId, sessionId, messageCount) => {
  try {
    const sessionRef = doc(db, 'users', userId, 'chatSessions', sessionId);
    await updateDoc(sessionRef, {
      updatedAt: serverTimestamp(),
      messageCount: messageCount || 0
    });
  } catch (error) {
    console.error('Error updating session:', error);
    throw error;
  }
};

// Delete a chat session and its messages
export const deleteChatSession = async (userId, sessionId) => {
  try {
    // Delete all messages in this session
    const messagesRef = collection(db, 'users', userId, 'chatSessions', sessionId, 'messages');
    const messagesSnapshot = await getDocs(messagesRef);
    
    const deletePromises = messagesSnapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
    
    // Delete the session itself
    const sessionRef = doc(db, 'users', userId, 'chatSessions', sessionId);
    await deleteDoc(sessionRef);
    
    console.log('Deleted chat session:', sessionId);
  } catch (error) {
    console.error('Error deleting chat session:', error);
    throw error;
  }
};

// Save message to specific session
export const saveSessionMessage = async (userId, sessionId, message) => {
  try {
    const messagesRef = collection(db, 'users', userId, 'chatSessions', sessionId, 'messages');
    await addDoc(messagesRef, {
      role: message.role,
      content: message.content,
      sources: message.sources || [],
      sourcesCount: message.sourcesCount || 0,
      timestamp: serverTimestamp()
    });
    
    // Update session last activity
    await updateSession(userId, sessionId);
  } catch (error) {
    console.error('Error saving message to session:', error);
    throw error;
  }
};

// Load messages from specific session
export const loadSessionMessages = async (userId, sessionId) => {
  try {
    const messagesRef = collection(db, 'users', userId, 'chatSessions', sessionId, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc'));
    const snapshot = await getDocs(q);
    
    const messages = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      messages.push({
        role: data.role,
        content: data.content,
        sources: data.sources || [],
        sourcesCount: data.sourcesCount || 0,
        timestamp: data.timestamp?.toDate() || new Date()
      });
    });
    
    return messages;
  } catch (error) {
    console.error('Error loading session messages:', error);
    return [];
  }
};

// Get session details
export const getSessionDetails = async (userId, sessionId) => {
  try {
    const sessionRef = doc(db, 'users', userId, 'chatSessions', sessionId);
    const sessionDoc = await getDoc(sessionRef);
    
    if (sessionDoc.exists()) {
      return {
        id: sessionDoc.id,
        ...sessionDoc.data()
      };
    }
    return null;
  } catch (error) {
    console.error('Error getting session details:', error);
    return null;
  }
};