using AktiviteTakip.Server.Entities;
using Microsoft.EntityFrameworkCore;

namespace AktiviteTakip.Server.Data.Seeders
{
    public class CategorySeeder
    {
        public static async Task SeedAsync(ApplicationDbContext context)
        {
            if (!await context.Category.AnyAsync())
            {
                var now = DateTime.UtcNow;
                var systemUserId = Guid.Empty;

                var categories = new List<Category>
            {
                new Category { Id = Guid.NewGuid(), Name = "Analiz",   },
                new Category { Id = Guid.NewGuid(), Name = "Geliştirme",   },
                new Category { Id = Guid.NewGuid(), Name = "Destek",   },
                new Category { Id = Guid.NewGuid(), Name = "Toplantı",   },
                new Category { Id = Guid.NewGuid(), Name = "Test",   },
                new Category { Id = Guid.NewGuid(), Name = "Eğitim",   },
                new Category { Id = Guid.NewGuid(), Name = "Fuar/Seminer/Konferans",   },
                new Category { Id = Guid.NewGuid(), Name = "Bekleme",   },
                new Category { Id = Guid.NewGuid(), Name = "Diğer",   },
            };

                await context.Category.AddRangeAsync(categories);
                await context.SaveChangesAsync();
            }
        }
    }
}
