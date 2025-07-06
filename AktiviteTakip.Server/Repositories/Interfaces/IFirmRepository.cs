using AktiviteTakip.Server.Entities;

namespace AktiviteTakip.Server.Repositories.Interfaces
{
    public interface IFirmRepository : IRepository<Firm>
    {
        Task<List<Firm>> GetAllWithProjectsAsync();
    }
}
