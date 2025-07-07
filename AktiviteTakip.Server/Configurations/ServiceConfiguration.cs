using AktiviteTakip.Server.Repositories.Interfaces;
using AktiviteTakip.Server.Repositories;
using AktiviteTakip.Server.Services.Interfaces;
using AktiviteTakip.Server.Services;
using AktiviteTakip.Server.UnitOfWork.Interfaces;

namespace AktiviteTakip.Server.Configurations
{
    public static class ServiceConfiguration
    {
        public static void AddApplicationServices(this IServiceCollection services)
        {
            services.AddScoped<ICacheService, CacheService>();
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<ITokenService, TokenService>();
            services.AddScoped<IFirmService, FirmService>();
            services.AddScoped<ICategoryService, CategoryService>();
            services.AddScoped<IEnumService, EnumService>();
            services.AddScoped<IEventService, EventService>();
            services.AddScoped<IUserService, UserService>();
            services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
            services.AddScoped<IUnitOfWork, UnitOfWork.Concrete.UnitOfWork>();
        }
    }
}
