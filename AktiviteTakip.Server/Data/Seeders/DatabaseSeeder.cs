using AktiviteTakip.Server.Entities;
using Microsoft.AspNetCore.Identity;

namespace AktiviteTakip.Server.Data.Seeders
{
    public static class DatabaseSeeder
    {
        public static async Task SeedAsync(IServiceProvider services)
        {
            using var scope = services.CreateScope();

            var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<ApplicationRole>>();

            await RoleSeeder.SeedRolesAsync(roleManager);
            await CategorySeeder.SeedAsync(dbContext);
            await FirmSeeder.SeedAsync(dbContext);
            await ProjectSeeder.SeedAsync(dbContext);
            await UserSeeder.SeedAsync(scope.ServiceProvider);
        }
    }
}
