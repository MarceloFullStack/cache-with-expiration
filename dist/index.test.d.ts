declare const cache: {
    [key: string]: {
        data: any;
        timestamp: number;
    };
};
declare function cacheWithDuration(key: string, duration: number, fn: () => Promise<any>): Promise<any>;
