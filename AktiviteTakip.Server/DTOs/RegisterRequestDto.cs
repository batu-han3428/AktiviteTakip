using System.ComponentModel.DataAnnotations;

namespace AktiviteTakip.Server.DTOs
{
    public class RegisterRequestDto
    {
        [Required(ErrorMessage = "UserName zorunludur")]
        public string UserName { get; set; } = null!;

        [Required(ErrorMessage = "Email zorunludur")]
        public string Email { get; set; } = null!;

        [Required(ErrorMessage = "Password zorunludur")]
        public string Password { get; set; } = null!;
    }
}
