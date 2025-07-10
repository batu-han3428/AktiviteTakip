using AktiviteTakip.Server.Common;
using AktiviteTakip.Server.DTOs;
using AktiviteTakip.Server.Entities;
using AktiviteTakip.Server.Enums;
using AktiviteTakip.Server.Models;
using AktiviteTakip.Server.Services.Interfaces;
using AktiviteTakip.Server.UnitOfWork.Interfaces;
using Microsoft.Extensions.Options;

namespace AktiviteTakip.Server.Services
{
    public class AuthService : IAuthService
    {
        private readonly ITokenService _tokenService;
        private readonly IUnitOfWork _unitOfWork;
        private readonly AppSettings _appSettings;
        private readonly IEmailService _emailService;

        public AuthService(ITokenService tokenService, IUnitOfWork unitOfWork, IOptions<AppSettings> appSettings, IEmailService emailService)
        {
            _tokenService = tokenService;
            _unitOfWork = unitOfWork;
            _appSettings = appSettings.Value;
            _emailService = emailService;
        }

        public async Task<Result<bool>> RegisterAsync(RegisterRequestDto registerRequest)
        {
            var user = new ApplicationUser
            {
                UserName = registerRequest.UserName,
                Email = registerRequest.Email,
                CreatedBy = Guid.Parse("00000000-0000-0000-0000-000000000000"),
                CreatedAt = DateTime.UtcNow,
                IsActive = true
            };

            var result = await _unitOfWork.UserManager.CreateAsync(user, registerRequest.Password);

            if (!result.Succeeded)
            {
                return Result<bool>.Failure(string.Join(", ", result.Errors.Select(e => e.Description)));
            }

            var roleResult = await _unitOfWork.UserManager.AddToRoleAsync(user, Roles.User.ToString());

            if (!roleResult.Succeeded)
            {
                await _unitOfWork.UserManager.DeleteAsync(user);
                return Result<bool>.Failure("Rol ataması başarısız: " + string.Join(", ", roleResult.Errors.Select(e => e.Description)));
            }

            return Result<bool>.SuccessResult(true);
        }


        public async Task<Result<string>> LoginAsync(LoginRequestDto loginRequest)
        {
            var user = await _unitOfWork.UserManager.FindByEmailAsync(loginRequest.Email);
            if (user == null)
                return Result<string>.Failure("Kullanıcı bulunamadı.");

            var passwordValid = await _unitOfWork.UserManager.CheckPasswordAsync(user, loginRequest.Password);
            if (!passwordValid)
                return Result<string>.Failure("Geçersiz parola.");

            var token = await _tokenService.GenerateToken(user);
            return Result<string>.SuccessResult(token);
        }

        public async Task<bool> VerifyResetTokenAsync(string userId, string token)
        {
            var user = await _unitOfWork.UserManager.FindByIdAsync(userId);
            if (user == null) return false;

            var isValid = await _unitOfWork.UserManager.VerifyUserTokenAsync(
                user,
                _unitOfWork.UserManager.Options.Tokens.PasswordResetTokenProvider,
                "ResetPassword",
                token);

            return isValid;
        }

        public async Task<Result<bool>> ResetPasswordAsync(string userId, string token, string newPassword)
        {
            var user = await _unitOfWork.UserManager.FindByIdAsync(userId);
            if (user == null)
                return Result<bool>.Failure("Kullanıcı bulunamadı.");

            var result = await _unitOfWork.UserManager.ResetPasswordAsync(user, token, newPassword);
            if (result.Succeeded)
                return Result<bool>.SuccessResult(true, "Şifre sıfırlandı.");

            var errors = string.Join(", ", result.Errors.Select(e => e.Description));
            return Result<bool>.Failure(errors);
        }

        public async Task<Result<bool>> SendPasswordResetEmailAsync(string email)
        {
            try
            {
                var user = await _unitOfWork.UserManager.FindByEmailAsync(email);
                if (user == null)
                    return Result<bool>.Failure("Bu e-posta adresine kayıtlı kullanıcı bulunamadı.");

                // Kullanıcı pasifse işlem yapmayabiliriz
                if (!user.IsActive)
                    return Result<bool>.Failure("Kullanıcı aktif değil.");

                // Şifre sıfırlama tokenı üret
                var resetToken = await _unitOfWork.UserManager.GeneratePasswordResetTokenAsync(user);
                if (string.IsNullOrEmpty(resetToken))
                    return Result<bool>.Failure("Şifre sıfırlama tokenı oluşturulamadı.");

                // Token URL encode edilerek güvenli hale getiriliyor
                var encodedToken = System.Web.HttpUtility.UrlEncode(resetToken);

                // Kullanıcıya gönderilecek şifre sıfırlama linki (frontend adresi)
                var resetLink = $"{_appSettings.ClientUrl}/reset-password?userId={user.Id}&token={encodedToken}";

                // Mail gönderme işlemi
               await _emailService.SendPasswordSetupLinkAsync(user.Email, resetLink);


                return Result<bool>.SuccessResult(true, "Şifre sıfırlama maili başarıyla gönderildi.");
            }
            catch (Exception ex)
            {
                return Result<bool>.Failure($"Kullanıcı oluşturulurken hata oluştu: {ex.Message}");
            }
        }
    }
}
