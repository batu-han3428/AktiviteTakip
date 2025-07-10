using System.ComponentModel.DataAnnotations;

namespace AktiviteTakip.Server.DTOs
{
    public class GroupCreateDto
    {
        [Required]
        public string Name { get; set; } = default!;
    }
}
