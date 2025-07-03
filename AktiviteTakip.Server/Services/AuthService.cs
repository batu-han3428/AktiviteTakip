using AktiviteTakip.Server.DTOs;
using AktiviteTakip.Server.Entities;
using AktiviteTakip.Server.Enums;
using AktiviteTakip.Server.Models;
using AktiviteTakip.Server.Services.Interfaces;
using AktiviteTakip.Server.UnitOfWork.Interfaces;
using Microsoft.AspNetCore.Identity;

namespace AktiviteTakip.Server.Services
{
    public class AuthService : IAuthService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ITokenService _tokenService;
        private readonly IUnitOfWork _unitOfWork;

        public AuthService(UserManager<ApplicationUser> userManager, ITokenService tokenService, IUnitOfWork unitOfWork)
        {
            _userManager = userManager;
            _tokenService = tokenService;
            _unitOfWork = unitOfWork;
        }

        public async Task<RegisterResult> RegisterAsync(RegisterRequestDto registerRequest)
        {
            var user = new ApplicationUser
            {
                UserName = registerRequest.UserName,
                Email = registerRequest.Email,
                CreatedBy = "system",
                CreatedAt = DateTime.UtcNow,
                IsActive = true
            };

            var result = await _userManager.CreateAsync(user, registerRequest.Password);

            if (!result.Succeeded)
            {
                return new RegisterResult
                {
                    Success = false,
                    ErrorMessage = string.Join(", ", result.Errors.Select(e => e.Description))
                };
            }

            var roleResult = await _userManager.AddToRoleAsync(user, Roles.User.ToString());

            if (!roleResult.Succeeded)
            {
                await _userManager.DeleteAsync(user);
                return new RegisterResult
                {
                    Success = false,
                    ErrorMessage = "Rol ataması başarısız: " + string.Join(", ", roleResult.Errors.Select(e => e.Description))
                };
            }

            return new RegisterResult { Success = true };
        }


        public async Task<string?> LoginAsync(LoginRequestDto loginRequest)
        {
            var user = await _userManager.FindByEmailAsync(loginRequest.Email);
            if (user == null) return null;

            var passwordValid = await _userManager.CheckPasswordAsync(user, loginRequest.Password);
            if (!passwordValid) return null;

            return await _tokenService.GenerateToken(user);
        }
    }
}
