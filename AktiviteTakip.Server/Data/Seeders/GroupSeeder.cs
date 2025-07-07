using AktiviteTakip.Server.Entities;
using Microsoft.EntityFrameworkCore;

namespace AktiviteTakip.Server.Data.Seeders
{
    public class GroupSeeder
    {
        public static async Task SeedAsync(ApplicationDbContext context)
        {
            if (!await context.Groups.AnyAsync())
            {
                var now = DateTime.UtcNow;
                var systemUserId = Guid.Empty;

                var groups = new List<Group>
                {
                    new Group { Id = Guid.NewGuid(), Name = "IT",   },
                    new Group { Id = Guid.NewGuid(), Name = "Destek",   },
                    new Group { Id = Guid.NewGuid(), Name = "IK",   },
                    new Group { Id = Guid.NewGuid(), Name = "Pazarlama",   },
                    new Group { Id = Guid.NewGuid(), Name = "Muhasebe",   },
                };

                await context.Groups.AddRangeAsync(groups);
                await context.SaveChangesAsync();
            }
        }
    }
}
