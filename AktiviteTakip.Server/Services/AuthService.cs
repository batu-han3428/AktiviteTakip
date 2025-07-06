using AktiviteTakip.Server.Common;
using AktiviteTakip.Server.DTOs;
using AktiviteTakip.Server.Entities;
using AktiviteTakip.Server.Enums;
using AktiviteTakip.Server.Services.Interfaces;
using AktiviteTakip.Server.UnitOfWork.Interfaces;

namespace AktiviteTakip.Server.Services
{
    public class AuthService : IAuthService
    {
        private readonly ITokenService _tokenService;
        private readonly IUnitOfWork _unitOfWork;

        public AuthService(ITokenService tokenService, IUnitOfWork unitOfWork)
        {
            _tokenService = tokenService;
            _unitOfWork = unitOfWork;
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
    }
}
