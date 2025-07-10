using System.ComponentModel.DataAnnotations;

namespace AktiviteTakip.Server.DTOs
{
    public class GroupUpdateDto
    {
        [Required]
        public Guid Id { get; set; }

        [Required]
        public string Name { get; set; } = default!;
    }
}
