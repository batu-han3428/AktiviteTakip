using System.ComponentModel.DataAnnotations;

namespace AktiviteTakip.Server.Models
{
    public class ResetPasswordRequest
    {
        [Required]
        public string UserId { get; set; }

        [Required]
        public string Token { get; set; }

        [Required]
        public string NewPassword { get; set; }
    }
}
