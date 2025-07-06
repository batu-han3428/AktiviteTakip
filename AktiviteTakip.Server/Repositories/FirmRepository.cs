using AktiviteTakip.Server.Data;
using AktiviteTakip.Server.Entities;
using AktiviteTakip.Server.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace AktiviteTakip.Server.Repositories
{
    public class FirmRepository : Repository<Firm>, IFirmRepository
    {
        public FirmRepository(ApplicationDbContext context) : base(context) { }

        public async Task<List<Firm>> GetAllWithProjectsAsync()
        {
            return await _context.Firm
                .Include(f => f.Projects)
                .Where(f => f.IsActive)
                .AsNoTracking()
                .ToListAsync();
        }
    }
}
