using System.ComponentModel.DataAnnotations;

namespace AktiviteTakip.Server.DTOs
{
    public class AddFirmDto
    {
        [Required]
        public string Name { get; set; }
    }
}
