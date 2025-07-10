using System.ComponentModel.DataAnnotations;

namespace AktiviteTakip.Server.DTOs
{
    public class ForgotPasswordRequestDto
    {
        [Required]
        public string Email { get; set; }
    }
}
