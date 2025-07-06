using AktiviteTakip.Server.Data;
using AktiviteTakip.Server.Entities;
using AktiviteTakip.Server.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace AktiviteTakip.Server.Repositories
{
    public class ProjectRepository : Repository<Project>, IProjectRepository
    {
        public ProjectRepository(ApplicationDbContext context) : base(context) { }

        public async Task<IEnumerable<Project>> GetProjectsByFirmIdAsync(int firmId)
        {
            return await _context.Project
                .Include(f => f.FirmId)
                .Where(f => f.IsActive)
                .AsNoTracking()
                .ToListAsync();
        }
    }
}
