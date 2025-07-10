using AktiviteTakip.Server.Enums;
using System.ComponentModel.DataAnnotations;

namespace AktiviteTakip.Server.DTOs
{
    public class CreateUserDto
    {
        [Required]
        public string Username { get; set; }

        [Required]
        public string Email { get; set; }
        public string Password { get; set; } = string.Empty;
        public Roles Role { get; set; } = Roles.User;
        public Guid? GroupId { get; set; }
        public string? Color { get; set; }
    }
}
