using AktiviteTakip.Server.Configurations;
using AktiviteTakip.Server.Data;
using AktiviteTakip.Server.Data.Seeders;
using AktiviteTakip.Server.Entities;
using AktiviteTakip.Server.Repositories;
using AktiviteTakip.Server.Repositories.Interfaces;
using AktiviteTakip.Server.Services;
using AktiviteTakip.Server.Services.Interfaces;
using AktiviteTakip.Server.UnitOfWork;
using AktiviteTakip.Server.UnitOfWork.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

//builder.Services.AddCors(options =>
//{
//    options.AddPolicy("AllowReactApp", policy =>
//    {
//        policy.WithOrigins("https://localhost:54615")
//              .AllowAnyHeader()
//              .AllowAnyMethod();
//    });
//});

builder.Services.AddCorsConfiguration();

// Add services to the container.

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("SqlExpressConnection")));

builder.Services.AddMemoryCache();

//builder.Services.AddIdentity<ApplicationUser, ApplicationRole>()
//    .AddEntityFrameworkStores<ApplicationDbContext>()
//    .AddDefaultTokenProviders();


builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<IUserContextService, UserContextService>();

builder.Services.AddApplicationServices();
builder.Services.AddIdentityConfiguration(builder.Configuration);


//builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
//builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();

//builder.Services.AddScoped<IAuthService, AuthService>();
//builder.Services.AddScoped<ITokenService, TokenService>();
//builder.Services.AddScoped<IFirmService, FirmService>();
//builder.Services.AddScoped<ICategoryService, CategoryService>();
//builder.Services.AddScoped<IEnumService, EnumService>();
//builder.Services.AddScoped<IEventService, EventService>();


//builder.Services.AddAuthentication(options =>
//{
//    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
//    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
//}).AddJwtBearer(options =>
//{
//    options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
//    {
//        ValidateIssuer = true,
//        ValidateAudience = true,
//        ValidateLifetime = true,
//        ValidateIssuerSigningKey = true,
//        ValidIssuer = builder.Configuration["Jwt:Issuer"],
//        ValidAudience = builder.Configuration["Jwt:Audience"],
//        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
//    };
//});

//builder.Services.AddAuthorization();

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
//builder.Services.AddOpenApi();
builder.Services.AddSwaggerConfiguration();

var app = builder.Build();

app.UseCors("AllowReactApp");

//using (var scope = app.Services.CreateScope())
//{
//    var services = scope.ServiceProvider;

//    var dbContext = services.GetRequiredService<ApplicationDbContext>();
//    var roleManager = services.GetRequiredService<RoleManager<ApplicationRole>>();

//    // Seeder'lar burada
//    await RoleSeeder.SeedRolesAsync(roleManager);
//    await CategorySeeder.SeedAsync(dbContext);
//    await FirmSeeder.SeedAsync(dbContext);
//    await ProjectSeeder.SeedAsync(dbContext);
//}

await DatabaseSeeder.SeedAsync(app.Services);

app.UseDefaultFiles();
app.MapStaticAssets();

// Configure the HTTP request pipeline.
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
