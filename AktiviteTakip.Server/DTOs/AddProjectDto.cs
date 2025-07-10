using System.ComponentModel.DataAnnotations;

namespace AktiviteTakip.Server.DTOs
{
    public class AddProjectDto
    {
        [Required]
        public string Name { get; set; }

        [Required]
        public Guid FirmId { get; set; }
    }
}
