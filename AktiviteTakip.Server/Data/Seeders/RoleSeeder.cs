using AktiviteTakip.Server.Entities;
using AktiviteTakip.Server.Enums;
using Microsoft.AspNetCore.Identity;

namespace AktiviteTakip.Server.Data.Seeders
{
    public static class RoleSeeder
    {
        public static async Task SeedRolesAsync(RoleManager<ApplicationRole> roleManager)
        {
            foreach (var roleName in Enum.GetNames(typeof(Roles)))
            {
                var exists = await roleManager.RoleExistsAsync(roleName);
                if (!exists)
                {
                    await roleManager.CreateAsync(new ApplicationRole(roleName));
                }
            }
        }
    }
}
