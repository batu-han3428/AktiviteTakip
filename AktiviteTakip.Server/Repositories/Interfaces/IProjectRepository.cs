using AktiviteTakip.Server.Entities;

namespace AktiviteTakip.Server.Repositories.Interfaces
{
    public interface IProjectRepository : IRepository<Project>
    {
        Task<IEnumerable<Project>> GetProjectsByFirmIdAsync(int firmId);
    }
}
