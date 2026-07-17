import { db } from './firebase.js';
import { Auth } from './auth.js';
import { 
  collection, doc, setDoc, getDocs, query, orderBy, 
  onSnapshot, serverTimestamp, deleteDoc, increment 
} from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js';

export const CloudDB = (() => {
  let conversationsUnsubscribe = null;

  function _uid() {
    const user = Auth.getCurrentUser();
    return user ? user.uid : null;
  }

  function subscribeConversations(callback) {
    const uid = _uid();
    if (!uid) { callback([]); return; }
    
    if (conversationsUnsubscribe) conversationsUnsubscribe();
    
    try {
      const q = query(
        collection(db, `users/${uid}/conversations`), 
        orderBy('updatedAt', 'desc')
      );
      
      conversationsUnsubscribe = onSnapshot(q, (snapshot) => {
        const chats = [];
        snapshot.forEach(doc => {
          chats.push({ id: doc.id, ...doc.data() });
        });
        callback(chats);
      });
    } catch (e) {
      console.warn("CloudDB disabled:", e);
      callback([]);
    }
  }

  async function loadChatMessages(chatId) {
    const uid = _uid();
    if (!uid) return [];
    
    try {
      const q = query(
        collection(db, `users/${uid}/conversations/${chatId}/messages`),
        orderBy('timestamp', 'asc')
      );
      const snap = await getDocs(q);
      const messages = [];
      snap.forEach(doc => {
        const data = doc.data();
        messages.push({ 
          id: doc.id, 
          role: data.role, 
          text: data.content, 
          ts: data.timestamp ? data.timestamp.toMillis() : Date.now(),
          toolId: data.toolId,
          isError: data.isError
        });
      });
      return messages;
    } catch (e) {
      console.warn("CloudDB loadChatMessages failed:", e);
      return [];
    }
  }

  async function saveConversation(chat) {
    const uid = _uid();
    if (!uid) return;
    
    try {
      const { id, title, toolId, projectId } = chat;
      const convRef = doc(db, `users/${uid}/conversations`, id);
      
      await setDoc(convRef, {
        title: title || 'New chat',
        toolId: toolId || null,
        projectId: projectId || null,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (e) {
      console.warn("CloudDB saveConversation failed:", e);
    }
  }

  async function saveMessage(chatId, message) {
    const uid = _uid();
    if (!uid) return;
    
    try {
      const msgId = message.id || ('msg_' + Date.now() + '_' + Math.random().toString(36).substr(2,5));
      message.id = msgId;
      
      await setDoc(doc(db, `users/${uid}/conversations/${chatId}/messages`, msgId), {
        role: message.role,
        content: message.text || '',
        timestamp: serverTimestamp(),
        model: message.model || 'llama-3.3-70b-versatile',
        tokensUsed: message.tokensUsed || 0,
        toolId: message.toolId || null,
        isError: message.isError || false
      });

      await setDoc(doc(db, `users/${uid}/conversations`, chatId), {
        updatedAt: serverTimestamp(),
        lastMessage: message.text ? message.text.slice(0, 100) : ''
      }, { merge: true });
    } catch (e) {
      console.warn("CloudDB saveMessage failed:", e);
    }
  }

  async function deleteConversation(chatId) {
    await deleteDoc(doc(db, `users/${_uid()}/conversations`, chatId));
  }
  
  async function trackUsage(tokensCount) {
    if (!tokensCount) return;
    const usageRef = doc(db, `users/${_uid()}/usage`, 'current');
    await setDoc(usageRef, {
      requestsToday: increment(1),
      tokensUsed: increment(tokensCount),
      lastRequest: serverTimestamp(),
      updatedAt: serverTimestamp()
    }, { merge: true });
  }

  async function logToolExecution(metadata) {
    if (!metadata) return;
    try {
      const toolRef = doc(collection(db, `users/${_uid()}/toolHistory`));
      await setDoc(toolRef, {
        toolId: metadata.toolId,
        executionTime: metadata.executionTime,
        version: metadata.version || '1.0',
        timestamp: serverTimestamp()
      });
    } catch (e) {
      console.warn("Failed to log tool execution:", e);
    }
  }

  async function migrateLocalChats() {
    try {
      const raw = localStorage.getItem('toolshub_chats');
      if (!raw) return;
      const localChats = JSON.parse(raw);
      if (!Array.isArray(localChats) || localChats.length === 0) return;
      
      console.log('Migrating local chats to Firestore...');
      for (const chat of localChats) {
        await saveConversation(chat);
        if (chat.messages && chat.messages.length > 0) {
          for (const msg of chat.messages) {
             await saveMessage(chat.id, msg);
          }
        }
      }
      
      localStorage.setItem('toolshub_chats_migrated', raw);
      localStorage.removeItem('toolshub_chats');
      console.log('Migration complete!');
    } catch (e) {
      console.error('Migration failed:', e);
    }
  }

  return {
    subscribeConversations,
    loadChatMessages,
    saveConversation,
    saveMessage,
    deleteConversation,
    trackUsage,
    logToolExecution,
    migrateLocalChats
  };
})();
