using System.ComponentModel.DataAnnotations;

namespace AktiviteTakip.Server.DTOs
{
    public class UpdateProjectDto
    {
        [Required(ErrorMessage = "Proje ID gereklidir.")]
        public Guid Id { get; set; }

        [Required(ErrorMessage = "Proje adı gereklidir.")]
        public string Name { get; set; } = default!;
    }
}
