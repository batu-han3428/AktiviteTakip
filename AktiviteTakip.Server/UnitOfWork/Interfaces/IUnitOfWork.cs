using AktiviteTakip.Server.Entities;
using AktiviteTakip.Server.Repositories.Interfaces;
using Microsoft.AspNetCore.Identity;

namespace AktiviteTakip.Server.UnitOfWork.Interfaces
{
    public interface IUnitOfWork : IDisposable
    {
        IRepository<T> Repository<T>() where T : BaseEntity;
        Task<int> CommitAsync();
        UserManager<ApplicationUser> UserManager { get; }
        RoleManager<ApplicationRole> RoleManager { get; }
        Task BeginTransactionAsync();
        IFirmRepository Firms { get; }
        IProjectRepository Projects { get; }
        ICategoryRepository Categories { get; }
        IEventRepository Events { get; }
        IUserRepository Users { get; }
        IGroupRepository Groups { get; }
    }
}
