using System.ComponentModel.DataAnnotations;

namespace AktiviteTakip.Server.DTOs
{
    public class FirmDto
    {
        [Required]
        public Guid Id { get; set; }

        [Required(ErrorMessage = "Name zorunludur")]
        public string Name { get; set; } = null!;
        public List<ProjectDto> Projects { get; set; }
    }
}
