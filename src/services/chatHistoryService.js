// src/services/chatHistoryService.js
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  getDocs,
  doc,
  deleteDoc,  // Add this import
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase/config';

// Save a message to Firestore
export async function saveMessage(userId, message) {
  try {
    const messagesRef = collection(db, 'chatHistory');
    await addDoc(messagesRef, {
      userId: userId,
      role: message.role,
      content: message.content,
      sources: message.sources || [],
      sourcesCount: message.sourcesCount || 0,
      timestamp: serverTimestamp(),
      createdAt: new Date()
    });
  } catch (error) {
    console.error('Error saving message:', error);
  }
}

// Load chat history for a user
export async function loadChatHistory(userId) {
  try {
    const messagesRef = collection(db, 'chatHistory');
    const q = query(
      messagesRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'asc')
    );
    
    const querySnapshot = await getDocs(q);
    const messages = [];
    
    querySnapshot.forEach((document) => {
      const data = document.data();
      messages.push({
        id: document.id,
        role: data.role,
        content: data.content,
        sources: data.sources || [],
        sourcesCount: data.sourcesCount || 0,
        timestamp: data.createdAt?.toDate() || new Date()
      });
    });
    
    return messages;
  } catch (error) {
    console.error('Error loading chat history:', error);
    return [];
  }
}

// Clear chat history for a user
export async function clearChatHistory(userId) {
  try {
    const messagesRef = collection(db, 'chatHistory');
    const q = query(messagesRef, where('userId', '==', userId));
    
    const querySnapshot = await getDocs(q);
    const deletePromises = [];
    
    querySnapshot.forEach((document) => {
      deletePromises.push(deleteDoc(doc(db, 'chatHistory', document.id)));
    });
    
    await Promise.all(deletePromises);
    console.log(' Chat history cleared');
  } catch (error) {
    console.error('Error clearing chat history:', error);
  }
}