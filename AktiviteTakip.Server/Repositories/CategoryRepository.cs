using AktiviteTakip.Server.Data;
using AktiviteTakip.Server.Entities;
using AktiviteTakip.Server.Repositories.Interfaces;

namespace AktiviteTakip.Server.Repositories
{
    public class CategoryRepository : Repository<Category>, ICategoryRepository
    {
        public CategoryRepository(ApplicationDbContext context) : base(context) { }
    }
}
