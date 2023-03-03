"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearCacheIndexedDB = exports.cacheWithDuration = void 0;
const cacheWithDuration = async (cacheKey, cacheTime, fn, log = false) => {
    console.log('teste');
    const dbName = 'cacheDB';
    const storeName = 'cacheStore';
    let db = null;
    const openDB = () => {
        return new Promise((resolve, reject) => {
            const request = window.indexedDB.open(dbName, 1);
            request.onerror = (event) => reject(event.target.error);
            request.onsuccess = (event) => resolve(event.target.result);
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                db.createObjectStore(storeName, { keyPath: 'key' });
            };
        });
    };
    const getData = async (key) => {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.get(key);
            request.onerror = (event) => reject(event.target.error);
            request.onsuccess = (event) => resolve(event.target.result);
        });
    };
    const setData = async (key, value) => {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.put(Object.assign({ key }, value));
            request.onerror = (event) => reject(event.target.error);
            request.onsuccess = (event) => resolve();
        });
    };
    if (!db) {
        db = await openDB();
    }
    let now = Date.now();
    let cachedData = await getData(cacheKey);
    if (cachedData && now - cachedData.timestamp < cacheTime) {
        log && console.info('returned from cache', cacheKey);
        return cachedData.value;
    }
    log && console.info('returned from API', cacheKey);
    let data = await fn();
    await setData(cacheKey, { value: data, timestamp: now });
    return data;
};
exports.cacheWithDuration = cacheWithDuration;
const clearCacheIndexedDB = () => {
    return new Promise((resolve, reject) => {
        const request = window.indexedDB.open('cacheDB', 1);
        request.onerror = (event) => reject(event.target.error);
        request.onsuccess = (event) => {
            const db = event.target.result;
            const transaction = db.transaction(['cacheStore'], 'readwrite');
            const store = transaction.objectStore('cacheStore');
            const request = store.clear();
            request.onerror = (event) => reject(event.target.error);
            request.onsuccess = () => resolve();
        };
    });
};
exports.clearCacheIndexedDB = clearCacheIndexedDB;
