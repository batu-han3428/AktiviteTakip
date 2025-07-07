using AktiviteTakip.Server.Services.Interfaces;
using Microsoft.Extensions.Caching.Memory;

namespace AktiviteTakip.Server.Services
{
    public class CacheService : ICacheService
    {
        private readonly IMemoryCache _memoryCache;
        private readonly object _cacheLock = new();

        public CacheService(IMemoryCache memoryCache)
        {
            _memoryCache = memoryCache;
        }

        public T? Get<T>(string key)
        {
            lock (_cacheLock)
            {
                _memoryCache.TryGetValue(key, out T item);
                return item;
            }
        }

        public void Set<T>(string key, T item, TimeSpan? absoluteExpirationRelativeToNow = null)
        {
            lock (_cacheLock)
            {
                var options = new MemoryCacheEntryOptions();
                if (absoluteExpirationRelativeToNow.HasValue)
                    options.SetAbsoluteExpiration(absoluteExpirationRelativeToNow.Value);

                _memoryCache.Set(key, item, options);
            }
        }

        public void Remove(string key)
        {
            lock (_cacheLock)
            {
                _memoryCache.Remove(key);
            }
        }
    }

}
