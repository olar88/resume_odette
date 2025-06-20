import { useCallback } from "react";

const DB_NAME = "OdetteResumeAppDB";
const STORE_NAME = "CanvasStorage";
const DB_VERSION = 1;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/** 存取 IDB */
export function useIndexedDB() {
  /** 儲存資料 */
  const setItem = useCallback(
    async <T>(key: string, value: T): Promise<void> => {
      const db = await openDB();
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      store.put(value, key);
      await tx.oncomplete;
      db.close();
    },
    []
  );

  /** 讀取資料 */
  const getItem = useCallback(async <T>(key: string): Promise<T | null> => {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);

    return new Promise((resolve, reject) => {
      const request = store.get(key);
      request.onsuccess = () => {
        db.close();
        resolve(request.result ?? null);
      };
      request.onerror = () => {
        db.close();
        reject(request.error);
      };
    });
  }, []);

  /** 讀取全部資料 */
  const getAllItem = useCallback(async (): Promise<IDBValidKey[] | null> => {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);

    return new Promise((resolve, reject) => {
      const request = store.getAllKeys();
      request.onsuccess = () => {
        db.close();
        resolve(request.result ?? null);
      };
      request.onerror = () => {
        db.close();
        reject(request.error);
      };
    });
  }, []);

  /** 刪除資料 */
  const removeItem = useCallback(async (key: string): Promise<void> => {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    store.delete(key);
    await tx.oncomplete;
    db.close();
  }, []);

  /** 清空所有資料 */
  const clear = useCallback(async (): Promise<void> => {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    store.clear();
    await tx.oncomplete;
    db.close();
  }, []);

  return { setItem, getItem, getAllItem, removeItem, clear };
}
