using AktiviteTakip.Server.Entities;
using Microsoft.EntityFrameworkCore;

namespace AktiviteTakip.Server.Data.Seeders
{
    public class ProjectSeeder
    {
        public static async Task SeedAsync(ApplicationDbContext context)
        {
            if (!await context.Project.AnyAsync())
            {
                var now = DateTime.UtcNow;
                var systemUserId = Guid.Empty;

                var projects = new List<Project>
                    {
                        new Project
                        {
                            Id = Guid.Parse("10000000-0000-0000-0000-000000000001"),
                            Name = "Project Alpha",
                            FirmId = Guid.Parse("c1a2f8f2-8d1a-4d59-9d2a-12e0f8e6d123"),
                        },
                        new Project
                        {
                            Id = Guid.Parse("10000000-0000-0000-0000-000000000002"),
                            Name = "Project Beta",
                            FirmId = Guid.Parse("c1a2f8f2-8d1a-4d59-9d2a-12e0f8e6d123"),
                        },
                        new Project
                        {
                            Id = Guid.Parse("10000000-0000-0000-0000-000000000003"),
                            Name = "Project Gamma",
                            FirmId = Guid.Parse("d2b3e9e3-9e2b-4e60-8c3b-23f1f9f7e234"),
                        },
                        new Project
                        {
                            Id = Guid.Parse("10000000-0000-0000-0000-000000000004"),
                            Name = "Project Delta",
                            FirmId = Guid.Parse("e3c4fa04-af3c-4f71-9d4c-34a2a0a8f345"),
                        },
                        new Project
                        {
                            Id = Guid.Parse("10000000-0000-0000-0000-000000000005"),
                            Name = "Project Epsilon",
                            FirmId = Guid.Parse("a5e6bc26-bf5e-4f93-9f6e-56c4c2c0b567"),
                        },
                    };


                await context.Project.AddRangeAsync(projects);
                await context.SaveChangesAsync();
            }
        }
    }
}
