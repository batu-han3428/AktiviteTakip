namespace AktiviteTakip.Server.Configurations
{
    public static class SwaggerConfiguration
    {
        public static IServiceCollection AddSwaggerConfiguration(this IServiceCollection services)
        {
            services.AddOpenApi();

            return services;
        }
    }
}
