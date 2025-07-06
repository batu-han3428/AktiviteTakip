using AktiviteTakip.Server.Entities;
using Microsoft.EntityFrameworkCore;

namespace AktiviteTakip.Server.Data.Seeders
{
    public class FirmSeeder
    {
        public static async Task SeedAsync(ApplicationDbContext context)
        {
            if (!await context.Firm.AnyAsync())
            {
                var now = DateTime.UtcNow;

                var firms = new List<Firm>
                    {
                        new Firm
                        {
                            Id = Guid.Parse("c1a2f8f2-8d1a-4d59-9d2a-12e0f8e6d123"),
                            Name = "Acme Corp",
                        },
                        new Firm
                        {
                            Id = Guid.Parse("d2b3e9e3-9e2b-4e60-8c3b-23f1f9f7e234"),
                            Name = "Beta Industries",
                        },
                        new Firm
                        {
                            Id = Guid.Parse("e3c4fa04-af3c-4f71-9d4c-34a2a0a8f345"),
                            Name = "Gamma Solutions",
                        },
                        new Firm
                        {
                            Id = Guid.Parse("f4d5ab15-af4d-4f82-8e5d-45b3b1b9a456"),
                            Name = "Delta Services",
                        },
                        new Firm
                        {
                            Id = Guid.Parse("a5e6bc26-bf5e-4f93-9f6e-56c4c2c0b567"),
                            Name = "Epsilon Tech",
                        },
                    };


                await context.Firm.AddRangeAsync(firms);
                await context.SaveChangesAsync();
            }
        }
    }
}
