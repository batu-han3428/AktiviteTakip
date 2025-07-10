using AktiviteTakip.Server.DTOs;
using AktiviteTakip.Server.Models;
using AktiviteTakip.Server.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace AktiviteTakip.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        /// <summary>
        /// Kullanıcının sisteme giriş yapmasını sağlar.
        /// </summary>
        /// <param name="request">Kullanıcı bilgileri</param>
        /// <returns></returns>

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginRequestDto request)
        {
            if (!ModelState.IsValid)
                return BadRequest("Geçersiz veri.");

            var result = await _authService.LoginAsync(request);

            if (!result.Success)
                return Unauthorized(new { message = result.Message ?? "Authentication failed" });

            return Ok(new { Token = result.Data, Message = result.Message });
        }


        /// <summary>
        /// Kullanıcının sisteme kayıt olmasını sağlar.
        /// </summary>
        /// <param name="request">Kullanıcı bilgileri</param>
        /// <returns></returns>
        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterRequestDto request)
        {
            if (!ModelState.IsValid)
                return BadRequest("Geçersiz veri.");

            var result = await _authService.RegisterAsync(request);

            if (!result.Success)
                return BadRequest(new { message = result.Message ?? "Registration failed" });

            return Ok(result);
        }


        /// <summary>
        /// Kullanıcının şifresini sıfırlamak için mail gönderir
        /// </summary>
        /// <param name="request">Kullanıcı bilgileri</param>
        /// <returns></returns>
        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequestDto request)
        {
            if (!ModelState.IsValid)
                return BadRequest("E-posta adresi boş olamaz.");

            var result = await _authService.SendPasswordResetEmailAsync(request.Email);

            if (!result.Success)
                return BadRequest(result.Message);

            return Ok(new { message = result.Message });
        }

        /// <summary>
        /// Kullanıcı reset tokenı doğrular
        /// </summary>
        /// <param name="userId">Kullanıcı id</param>
        /// <param name="token">Token</param>
        /// <returns></returns>
        [HttpGet("verify-reset-token")]
        public async Task<IActionResult> VerifyResetToken([FromQuery] string userId, [FromQuery] string token)
        {
            var isValid = await _authService.VerifyResetTokenAsync(userId, token);
            if (!isValid)
                return BadRequest(new { message = "Token geçersiz veya süresi dolmuş." });

            return Ok(new { message = "Token geçerli." });
        }


        /// <summary>
        /// Kullanının şifre oluşturmasını sağlar
        /// </summary>
        /// <param name="model">Şifre bilgileri</param>
        /// <returns></returns>
        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest model)
        {
            var result = await _authService.ResetPasswordAsync(model.UserId, model.Token, model.NewPassword);

            if (!result.Success)
                return BadRequest(new { message = result.Message });

            return Ok(new { message = result.Message });
        }
    }
}
