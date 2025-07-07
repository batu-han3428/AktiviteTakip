using System.ComponentModel.DataAnnotations;

namespace AktiviteTakip.Server.DTOs
{
    public sealed class LoginRequestDto
    {
        [Required(ErrorMessage = "Email zorunludur")]
        public string Email { get; set; } = null!;

        [Required(ErrorMessage = "Şifre zorunludur")]
        public string Password { get; set; } = null!;
    }
}
