using System.ComponentModel.DataAnnotations;

namespace AktiviteTakip.Server.DTOs
{
    public class EnumDto
    {
        [Required]
        public int Id { get; set; }

        [Required(ErrorMessage = "Label zorunludur")]
        public string Label { get; set; }
    }
}
