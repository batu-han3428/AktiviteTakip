using AktiviteTakip.Server.Entities;
using System.Linq.Expressions;

namespace AktiviteTakip.Server.Repositories.Interfaces
{
    public interface IRepository<T> where T : BaseEntity
    {
        Task AddAsync(T entity);
        Task<IEnumerable<T>> GetAllAsync();
        Task<T?> GetByIdAsync(Guid id);
        Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate);
        Task SoftDeleteAsync(T entity);
        void Update(T entity);
        void Remove(T entity);
    }
}
