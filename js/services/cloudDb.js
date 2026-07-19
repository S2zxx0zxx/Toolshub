import { db, fbFirestoreModule } from './firebase.js';
import { Auth } from './auth.js';
import { LocalSettings } from './localSettings.js';

export const CloudDB = (() => {
  let conversationsUnsubscribe = null;

  function _uid() {
    const user = Auth.getCurrentUser();
    return user ? user.uid : null;
  }

  function subscribeConversations(callback, retryCount = 1) {
    const uid = _uid();
    if (!uid || !db || !fbFirestoreModule) { 
      callback(LocalSettings.getAllChats()); 
      return; 
    }
    
    if (conversationsUnsubscribe) conversationsUnsubscribe();
    
    try {
      const q = fbFirestoreModule.query(
        fbFirestoreModule.collection(db, `users/${uid}/conversations`), 
        fbFirestoreModule.orderBy('updatedAt', 'desc')
      );
      
      conversationsUnsubscribe = fbFirestoreModule.onSnapshot(q, (snapshot) => {
        const chats = [];
        snapshot.forEach(doc => {
          chats.push({ id: doc.id, ...doc.data() });
        });
        callback(chats);
      }, (e) => {
        if (e.code === 'unavailable' && retryCount > 0) {
          console.warn("Firestore unavailable, retrying subscribeConversations...");
          setTimeout(() => subscribeConversations(callback, 0), 800);
        } else {
          console.error("CloudDB subscribeConversations failed:", e);
          if (typeof Toast !== 'undefined') Toast.show('Error loading chat history.');
          callback([]);
        }
      });
    } catch (e) {
      if (e.code === 'unavailable' && retryCount > 0) {
        console.warn("Firestore unavailable synchronously, retrying subscribe...");
        setTimeout(() => subscribeConversations(callback, 0), 800);
      } else {
        console.warn("CloudDB disabled:", e);
        callback([]);
      }
    }
  }

  async function loadChatMessages(chatId, retryCount = 1) {
    const uid = _uid();
    if (!uid || !db || !fbFirestoreModule) {
      const localChat = LocalSettings.getChat(chatId);
      return localChat ? (localChat.messages || []) : [];
    }
    
    try {
      const q = fbFirestoreModule.query(
        fbFirestoreModule.collection(db, `users/${uid}/conversations/${chatId}/messages`),
        fbFirestoreModule.orderBy('timestamp', 'asc')
      );
      const snap = await fbFirestoreModule.getDocs(q);
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
      if (e.code === 'unavailable' && retryCount > 0) {
        console.warn("Firestore unavailable, retrying loadChatMessages...");
        await new Promise(r => setTimeout(r, 800));
        return loadChatMessages(chatId, 0);
      }
      console.error("CloudDB loadChatMessages failed:", e);
      if (typeof Toast !== 'undefined') Toast.show('Error loading messages.');
      return [];
    }
  }

  async function saveConversation(chat) {
    const uid = _uid();
    if (!uid || !db || !fbFirestoreModule) {
      LocalSettings.saveChat(chat);
      return;
    }
    
    try {
      const { id, title, toolId, projectId } = chat;
      const convRef = fbFirestoreModule.doc(db, `users/${uid}/conversations`, id);
      
      await fbFirestoreModule.setDoc(convRef, {
        title: title || 'New chat',
        toolId: toolId || null,
        projectId: projectId || null,
        updatedAt: fbFirestoreModule.serverTimestamp()
      }, { merge: true });
    } catch (e) {
      console.warn("CloudDB saveConversation failed:", e);
    }
  }

  async function saveMessage(chatId, message) {
    const uid = _uid();
    
    if (!message.id) {
      const rand = typeof crypto !== 'undefined' && crypto.randomUUID 
        ? crypto.randomUUID().split('-')[0]
        : Math.random().toString(36).substring(2, 7);
      message.id = 'msg_' + Date.now() + '_' + rand;
    }
    
    if (!uid || !db || !fbFirestoreModule) {
      const localChat = LocalSettings.getChat(chatId);
      if (localChat) {
        if (!localChat.messages) localChat.messages = [];
        localChat.messages.push(message);
        localChat.updatedAt = Date.now();
        LocalSettings.saveChat(localChat);
      }
      return;
    }
    
    try {
      const msgId = message.id;
      
      await fbFirestoreModule.setDoc(fbFirestoreModule.doc(db, `users/${uid}/conversations/${chatId}/messages`, msgId), {
        role: message.role,
        content: message.text || '',
        timestamp: fbFirestoreModule.serverTimestamp(),
        model: message.model || 'llama-3.3-70b-versatile',
        tokensUsed: message.tokensUsed || 0,
        toolId: message.toolId || null,
        isError: message.isError || false
      });

      await fbFirestoreModule.setDoc(fbFirestoreModule.doc(db, `users/${uid}/conversations`, chatId), {
        updatedAt: fbFirestoreModule.serverTimestamp(),
        lastMessage: message.text ? message.text.slice(0, 100) : ''
      }, { merge: true });
    } catch (e) {
      console.warn("CloudDB saveMessage failed:", e);
    }
  }

  async function deleteConversation(chatId) {
    const uid = _uid();
    if (!uid || !db || !fbFirestoreModule) {
      LocalSettings.deleteChat(chatId);
      return;
    }
    await fbFirestoreModule.deleteDoc(fbFirestoreModule.doc(db, `users/${uid}/conversations`, chatId));
  }
  
  async function trackUsage(tokensCount) {
    const uid = _uid();
    if (!uid || !tokensCount || !db || !fbFirestoreModule) return;
    try {
      const usageRef = fbFirestoreModule.doc(db, `users/${uid}/usage`, 'current');
      await fbFirestoreModule.setDoc(usageRef, {
        requestsToday: fbFirestoreModule.increment(1),
        tokensUsed: fbFirestoreModule.increment(tokensCount),
        lastRequest: fbFirestoreModule.serverTimestamp(),
        updatedAt: fbFirestoreModule.serverTimestamp()
      }, { merge: true });
    } catch (e) {
      console.warn("Failed to track usage:", e);
    }
  }

  async function logToolExecution(metadata) {
    const uid = _uid();
    if (!uid || !metadata || !db || !fbFirestoreModule) return;
    try {
      const toolRef = fbFirestoreModule.doc(fbFirestoreModule.collection(db, `users/${uid}/toolHistory`));
      await fbFirestoreModule.setDoc(toolRef, {
        toolId: metadata.toolId,
        executionTime: metadata.executionTime,
        version: metadata.version || '1.0',
        timestamp: fbFirestoreModule.serverTimestamp()
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

  // Fix #2: expose whether a live Firestore subscription is active (false = guest mode)
  function isSubscribed() {
    return conversationsUnsubscribe !== null;
  }

  async function joinProWaitlist() {
    const user = Auth.getCurrentUser();
    if (!user) {
      throw new Error('Please sign in first to join the waitlist.');
    }
    const docRef = fbFirestoreModule.doc(db, `proWaitlist/${user.uid}`);
    
    const writePromise = fbFirestoreModule.setDoc(docRef, {
      uid: user.uid,
      email: user.email || null,
      timestamp: fbFirestoreModule.serverTimestamp()
    }, { merge: true });

    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('This is taking longer than expected. Please check your connection and try again.')), 8000)
    );

    await Promise.race([writePromise, timeoutPromise]);
  }

  return {
    subscribeConversations,
    loadChatMessages,
    saveConversation,
    saveMessage,
    deleteConversation,
    trackUsage,
    logToolExecution,
    migrateLocalChats,
    isSubscribed,
    joinProWaitlist
  };
})();
