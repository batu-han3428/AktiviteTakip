namespace AktiviteTakip.Server.Services.Interfaces
{
    public interface ICacheService
    {
        T? Get<T>(string key);
        void Set<T>(string key, T item, TimeSpan? absoluteExpirationRelativeToNow = null);
        void Remove(string key);
    }
}
