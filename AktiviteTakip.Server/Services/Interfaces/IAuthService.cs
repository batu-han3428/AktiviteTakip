using AktiviteTakip.Server.DTOs;
using AktiviteTakip.Server.Models;

namespace AktiviteTakip.Server.Services.Interfaces
{
    public interface IAuthService
    {
        Task<string?> LoginAsync(LoginRequestDto loginRequest);
        Task<RegisterResult> RegisterAsync(RegisterRequestDto registerRequest);
    }
}
