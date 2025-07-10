using AktiviteTakip.Server.Configurations;
using AktiviteTakip.Server.Data;
using AktiviteTakip.Server.Data.Seeders;
using AktiviteTakip.Server.Models;
using AktiviteTakip.Server.Services;
using AktiviteTakip.Server.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCorsConfiguration();

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("SqlExpressConnection")));

builder.Services.AddMemoryCache();

builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<IUserContextService, UserContextService>();

builder.Services.Configure<SmtpSettings>(builder.Configuration.GetSection("SmtpSettings"));
builder.Services.Configure<AppSettings>(builder.Configuration.GetSection("AppSettings"));

builder.Services.AddApplicationServices();
builder.Services.AddIdentityConfiguration(builder.Configuration);

builder.Services.AddControllers();

builder.Services.AddSwaggerConfiguration();

var app = builder.Build();

app.UseCors("AllowReactApp");

await DatabaseSeeder.SeedAsync(app.Services);

app.UseDefaultFiles();
app.MapStaticAssets();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();
