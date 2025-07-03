using AktiviteTakip.Server.Entities;

namespace AktiviteTakip.Server.Services.Interfaces
{
    public interface ITokenService
    {
        Task<string> GenerateToken(ApplicationUser user);
    }
}
