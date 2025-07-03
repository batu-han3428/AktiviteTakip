using AktiviteTakip.Server.Entities;
using AktiviteTakip.Server.Repositories.Interfaces;

namespace AktiviteTakip.Server.UnitOfWork.Interfaces
{
    public interface IUnitOfWork : IDisposable
    {
        IRepository<T> Repository<T>() where T : BaseEntity;
        Task<int> CommitAsync();
    }
}
