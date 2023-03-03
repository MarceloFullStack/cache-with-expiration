// @ts-ignore
const cache: { [key: string]: { data: any; timestamp: number } } = {};

async function cacheWithDuration(key: string, duration: number, fn: () => Promise<any>) {
  if (cache[key] && cache[key].timestamp + duration > Date.now()) {
    return 'data from cache';
  }
  const data = await fn();
  cache[key] = { data, timestamp: Date.now() };
  return data;
}
describe('cacheWithDuration', () => {
    it('calls the provided function if the cache is expired', async () => {
      const mockFn = jest.fn().mockResolvedValue('data from API');
      const cacheKey = 'cacheKey';
      const cacheTime = 1000;
    
      const result = await cacheWithDuration(cacheKey, cacheTime, mockFn);

      const result2 = await cacheWithDuration(cacheKey, cacheTime, mockFn);
    
      expect(mockFn).toHaveBeenCalled();
      expect(result).toEqual('data from API');
        expect(result2).toEqual('data from cache');
    });
});