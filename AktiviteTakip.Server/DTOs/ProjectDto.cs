using System.ComponentModel.DataAnnotations;

namespace AktiviteTakip.Server.DTOs
{
    public sealed class ProjectDto
    {
        public Guid Id { get; set; }

        [Required(ErrorMessage = "Name zorunludur")]
        public string Name { get; set; }
    }
}
