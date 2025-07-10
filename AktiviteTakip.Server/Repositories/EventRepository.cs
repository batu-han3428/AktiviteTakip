using AktiviteTakip.Server.Data;
using AktiviteTakip.Server.Entities;
using AktiviteTakip.Server.Repositories.Interfaces;

namespace AktiviteTakip.Server.Repositories
{
    public class EventRepository : Repository<Event>, IEventRepository
    {
        public EventRepository(ApplicationDbContext context) : base(context) { }

        public async Task<IEnumerable<Event>> GetEventsByUserIdAsync(Guid userId)
        {
            //return await _context.Event
            //                     .Where(e => e. == userId)
            //                     .ToListAsync();
            return null;
        }
    }
}
