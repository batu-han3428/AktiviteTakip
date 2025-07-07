using AktiviteTakip.Server.Data;
using AktiviteTakip.Server.Entities;

namespace AktiviteTakip.Server.Repositories.Interfaces
{
    public class UserRepository : Repository<ApplicationUser>, IUserRepository
    {
        public UserRepository(ApplicationDbContext context) : base(context) { }

    }
}
