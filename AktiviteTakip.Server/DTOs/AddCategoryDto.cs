using System.ComponentModel.DataAnnotations;

namespace AktiviteTakip.Server.DTOs
{
    public class AddCategoryDto
    {
        [Required]
        public string Name { get; set; }
    }
}
