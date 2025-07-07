using AktiviteTakip.Server.Entities;
using AktiviteTakip.Server.Enums;
using Microsoft.AspNetCore.Identity;

namespace AktiviteTakip.Server.Data.Seeders
{
    public static  class UserSeeder
    {
        public static async Task SeedAsync(IServiceProvider serviceProvider)
        {
            var userManager = serviceProvider.GetRequiredService<UserManager<ApplicationUser>>();
            var roleManager = serviceProvider.GetRequiredService<RoleManager<ApplicationRole>>();

            string adminRoleName = Roles.Admin.ToString();
            string adminUserName = "admin";
            string adminEmail = "admin";
            string adminPassword = "Admin123!";

            if (!await roleManager.RoleExistsAsync(adminRoleName))
            {
                await roleManager.CreateAsync(new ApplicationRole(adminRoleName));
            }

            var adminUser = await userManager.FindByNameAsync(adminUserName);
            if (adminUser == null)
            {
                adminUser = new ApplicationUser
                {
                    Id = Guid.NewGuid(),
                    UserName = adminUserName,
                    NormalizedUserName = adminUserName.ToUpper(),
                    Email = adminEmail,
                    NormalizedEmail = adminEmail.ToUpper(),
                    EmailConfirmed = true,
                    SecurityStamp = Guid.NewGuid().ToString("D"),
                };

                var result = await userManager.CreateAsync(adminUser, adminPassword);
                if (!result.Succeeded)
                {
                    throw new Exception($"Admin kullanıcısı oluşturulamadı: {string.Join(", ", result.Errors)}");
                }
            }

            if (!await userManager.IsInRoleAsync(adminUser, adminRoleName))
            {
                await userManager.AddToRoleAsync(adminUser, adminRoleName);
            }
        }
    }
}
