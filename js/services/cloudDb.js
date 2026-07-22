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
      const today = new Date().toISOString().slice(0, 10);
      const usageRef = fbFirestoreModule.doc(db, `users/${uid}/usage`, today);
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

  async function getTodayUsage() {
    const uid = _uid();
    if (!uid || !db || !fbFirestoreModule) return null;
    try {
      const today = new Date().toISOString().slice(0, 10);
      const usageRef = fbFirestoreModule.doc(db, `users/${uid}/usage`, today);
      const snap = await fbFirestoreModule.getDoc(usageRef);
      if (snap.exists()) {
        const data = snap.data();
        return { 
          count: data.requestsToday || 0,
          tokens: data.tokensUsed || 0
        };
      }
      return { count: 0, tokens: 0 };
    } catch (e) {
      console.warn("Failed to fetch today usage:", e);
      return null;
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

  async function exportUserData() {
    const uid = _uid();
    if (!uid || !db || !fbFirestoreModule) {
      // Guest mode: export whatever's in LocalSettings
      const chats = LocalSettings.getAllChats();
      return { exportedAt: new Date().toISOString(), mode: 'guest', conversations: chats };
    }
    const convSnap = await fbFirestoreModule.getDocs(
      fbFirestoreModule.collection(db, `users/${uid}/conversations`)
    );
    const conversations = [];
    for (const convDoc of convSnap.docs) {
      const msgSnap = await fbFirestoreModule.getDocs(
        fbFirestoreModule.query(
          fbFirestoreModule.collection(db, `users/${uid}/conversations/${convDoc.id}/messages`),
          fbFirestoreModule.orderBy('timestamp', 'asc')
        )
      );
      const messages = msgSnap.docs.map(d => {
        const m = d.data();
        return {
          role: m.role,
          content: m.content,
          timestamp: m.timestamp ? m.timestamp.toDate().toISOString() : null,
          toolId: m.toolId || null
        };
      });
      conversations.push({ id: convDoc.id, ...convDoc.data(), messages });
    }
    return { exportedAt: new Date().toISOString(), mode: 'cloud', uid, conversations };
  }

  async function clearAllConversations() {
    const uid = _uid();
    if (!uid || !db || !fbFirestoreModule) {
      LocalSettings.clearAllChats(); 
      return;
    }
    const convSnap = await fbFirestoreModule.getDocs(
      fbFirestoreModule.collection(db, `users/${uid}/conversations`)
    );
    for (const convDoc of convSnap.docs) {
      const msgSnap = await fbFirestoreModule.getDocs(
        fbFirestoreModule.collection(db, `users/${uid}/conversations/${convDoc.id}/messages`)
      );
      for (const msgDoc of msgSnap.docs) {
        await fbFirestoreModule.deleteDoc(msgDoc.ref);
      }
      await fbFirestoreModule.deleteDoc(convDoc.ref);
    }
  }

  async function deleteUserAccount() {
    const uid = _uid();
    if (!uid) throw new Error("No signed-in user.");
    await clearAllConversations();
    if (db && fbFirestoreModule) {
      await fbFirestoreModule.deleteDoc(fbFirestoreModule.doc(db, 'users', uid)).catch(() => {});
    }
  }

  async function syncPlanFromServer() {
    const uid = _uid();
    if (!uid || !db || !fbFirestoreModule) {
      LocalSettings.setCurrentPlan('free');
      return;
    }

    const user = Auth.getCurrentUser();
    if (user && (user.email === 'Satyamk82476@gmail.com' || user.email === 'satyamk82476@gmail.com' || user.email === 'Styamk82476@gmail.com' || user.email === 'styamk82476@gmail.com')) {
      const devPlan = localStorage.getItem('dev_mock_plan');
      if (devPlan) {
        LocalSettings.setCurrentPlan(devPlan);
      } else {
        LocalSettings.setCurrentPlan('yearly'); // Default to MAX plan
      }
      return;
    }
    
    try {
      const userRef = fbFirestoreModule.doc(db, 'users', uid);
      const snap = await fbFirestoreModule.getDoc(userRef);
      if (snap.exists()) {
        const data = snap.data();
        const sub = data.subscription;
        if (sub && sub.status === 'active' && sub.expiresAt > Date.now()) {
          LocalSettings.setCurrentPlan(sub.planId);
        } else {
          LocalSettings.setCurrentPlan('free');
        }
      } else {
        LocalSettings.setCurrentPlan('free');
      }
    } catch (e) {
      console.warn("Failed to sync plan from server:", e);
      // Keep existing cache on network failure, or degrade to free?
      // Better to keep cache if offline, but don't blindly grant access.
      // We rely on rules for real security, so keeping cache is fine for UX.
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
    migrateLocalChats,
    isSubscribed,
    joinProWaitlist,
    exportUserData,
    clearAllConversations,
    deleteUserAccount,
    syncPlanFromServer,
    getTodayUsage
  };
})();
