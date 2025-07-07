using AktiviteTakip.Server.DTOs;
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
    }
}
