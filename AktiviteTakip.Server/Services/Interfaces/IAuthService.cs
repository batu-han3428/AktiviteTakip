using AktiviteTakip.Server.Common;
using AktiviteTakip.Server.DTOs;

namespace AktiviteTakip.Server.Services.Interfaces
{
    public interface IAuthService
    {
       Task<Result<bool>> RegisterAsync(RegisterRequestDto registerRequest);
       Task<Result<string>> LoginAsync(LoginRequestDto loginRequest);
       Task<bool> VerifyResetTokenAsync(string userId, string token);
       Task<Result<bool>> ResetPasswordAsync(string userId, string token, string newPassword);
       Task<Result<bool>> SendPasswordResetEmailAsync(string email);
    }
}
