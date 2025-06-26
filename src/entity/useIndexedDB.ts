import { useCallback } from "react";
export const CanvasStorage = "CanvasStorage";
export const CalendarStorage = "CalendarStorage";

const DB_NAME = "OdetteResumeAppDB";
const DB_VERSION = 1;

const DB_List = [
  { table_name: CanvasStorage },
  { table_name: CalendarStorage },
];

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      for (let index = 0; index < DB_List.length; index++) {
        const tableItem = DB_List[index];
        if (!db.objectStoreNames.contains(tableItem.table_name)) {
          db.createObjectStore(tableItem.table_name);
        }
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
    async <T>(table_name: string, value: T): Promise<void> => {
      const db = await openDB();
      const tx = db.transaction(table_name, "readwrite");
      const store = tx.objectStore(table_name);
      store.put(value);
      await tx.oncomplete;
      db.close();
    },
    []
  );

  /** 讀取資料 */
  const getItem = useCallback(
    async <T>(table_name: string, keyPath: string): Promise<T | null> => {
      const db = await openDB();
      const tx = db.transaction(table_name, "readonly");
      const store = tx.objectStore(table_name);

      return new Promise((resolve, reject) => {
        const request = store.get(keyPath);
        request.onsuccess = () => {
          db.close();
          resolve(request.result ?? null);
        };
        request.onerror = () => {
          db.close();
          reject(request.error);
        };
      });
    },
    []
  );

  /** 讀取全部資料 */
  const getAllItem = useCallback(
    async (table_name: string): Promise<IDBValidKey[] | null> => {
      const db = await openDB();
      const tx = db.transaction(table_name, "readonly");
      const store = tx.objectStore(table_name);

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
    },
    []
  );

  /** 刪除資料 */
  const removeItem = useCallback(
    async (table_name: string, keyPath: string): Promise<void> => {
      const db = await openDB();
      const tx = db.transaction(table_name, "readwrite");
      const store = tx.objectStore(table_name);
      store.delete(keyPath);
      await tx.oncomplete;
      db.close();
    },
    []
  );

  /** 清空所有資料 */
  const clear = useCallback(async (table_name: string): Promise<void> => {
    const db = await openDB();
    const tx = db.transaction(table_name, "readwrite");
    const store = tx.objectStore(table_name);
    store.clear();
    await tx.oncomplete;
    db.close();
  }, []);

  return { setItem, getItem, getAllItem, removeItem, clear };
}
