import { openDB } from 'idb';

const DB_NAME = 'cpx-chat-db';
const STORE_NAME = 'chats';

const initDB = async () => {
  const db = await openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    },
  });
  return db;
};

export const saveChat = async (messages) => {
  try {
    const db = await initDB();
    await db.put(STORE_NAME, messages, 'chat-history');
  } catch (error) {
    console.error('채팅 저장 오류:', error);
  }
};

export const getChats = async () => {
  try {
    const db = await initDB();
    return await db.get(STORE_NAME, 'chat-history');
  } catch (error) {
    console.error('채팅 불러오기 오류:', error);
    return null;
  }
};

export const clearChatHistory = async () => {
  try {
    const db = await initDB();
    await db.delete(STORE_NAME, 'chat-history');
    console.log('Chat history cleared from IndexedDB.');
  } catch (error) {
    console.error('채팅 기록 삭제 오류:', error);
  }
}; 