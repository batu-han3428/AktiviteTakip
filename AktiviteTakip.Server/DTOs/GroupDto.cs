using System.ComponentModel.DataAnnotations;

namespace AktiviteTakip.Server.DTOs
{
    public sealed class GroupDto
    {
        public Guid Id { get; set; }

        [Required]
        public string Name { get; set; }
    }
}