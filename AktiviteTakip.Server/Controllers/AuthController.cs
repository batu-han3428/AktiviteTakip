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

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginRequestDto request)
        {
            var token = await _authService.LoginAsync(request);
            if (token == null)
                return Unauthorized();

            return Ok(new { Token = token });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterRequestDto request)
        {
            var result = await _authService.RegisterAsync(request);
            if (!result.Success)
                return BadRequest(new { message = result.ErrorMessage ?? "Registration failed" });

            // Opsiyonel: register sonrası token oluşturma (login otomatik yapılabilir)
            // var token = await _authService.GenerateJwtTokenAsync(user);

            return Ok(new { message = "Registration successful" /*, token*/ });
        }
    }
}
