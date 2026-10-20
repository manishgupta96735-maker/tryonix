export type TryOnRecord = {
  result: string;
  person: string;
  outfit: string;
  createdAt: string;
};

const DATABASE_NAME = "tryonix-creator";
const STORE_NAME = "session";
const RESULT_KEY = "latest-result";
const DRAFT_KEY = "upload-draft";

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("Browser storage is unavailable."));
      return;
    }
    const request = indexedDB.open(DATABASE_NAME, 1);
    request.onupgradeneeded = () => {
      request.result.createObjectStore(STORE_NAME);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("Could not open browser storage."));
  });
}

function readValue<T>(key: string): Promise<T | null> {
  return openDatabase().then((db) => new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readonly");
    const request = transaction.objectStore(STORE_NAME).get(key);
    request.onsuccess = () => resolve((request.result as T | undefined) ?? null);
    request.onerror = () => reject(request.error ?? new Error("Could not read browser storage."));
    transaction.oncomplete = () => db.close();
    transaction.onerror = () => db.close();
  }));
}

function writeValue<T>(key: string, value: T): Promise<void> {
  return openDatabase().then((db) => new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    transaction.objectStore(STORE_NAME).put(value, key);
    transaction.oncomplete = () => { db.close(); resolve(); };
    transaction.onerror = () => { db.close(); reject(transaction.error ?? new Error("Could not save browser data.")); };
    transaction.onabort = () => { db.close(); reject(transaction.error ?? new Error("Browser storage is full.")); };
  }));
}

export function saveTryOnRecord(record: TryOnRecord) {
  return writeValue(RESULT_KEY, record);
}

export function readTryOnRecord() {
  return readValue<TryOnRecord>(RESULT_KEY);
}

export function saveTryOnDraft(draft: Pick<TryOnRecord, "person" | "outfit">) {
  return writeValue(DRAFT_KEY, draft);
}

export function readTryOnDraft() {
  return readValue<Pick<TryOnRecord, "person" | "outfit">>(DRAFT_KEY);
}