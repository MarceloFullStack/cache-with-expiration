export * from './cache-with-duration-indexed-db';
export declare const cacheWithDurationIndexedDB: <T>(cacheKey: string, cacheTime: number, fn: () => Promise<T>, log?: boolean) => Promise<T>;
export declare const clearCacheIndexedDB: () => Promise<void>;

declare const cache: {
    [key: string]: {
        data: any;
        timestamp: number;
    };
};
declare function cacheWithDuration(key: string, duration: number, fn: () => Promise<any>): Promise<any>;
