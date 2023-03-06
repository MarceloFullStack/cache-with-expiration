export declare const cacheWithDurationIndexedDB: <T>(cacheKey: string, cacheTime: number, fn: () => Promise<T>, log?: boolean) => Promise<T>;
export declare const clearCacheIndexedDB: () => Promise<void>;
