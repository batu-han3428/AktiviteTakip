using AktiviteTakip.Server.Enums;
using System.ComponentModel.DataAnnotations;

namespace AktiviteTakip.Server.DTOs
{
    public class CreateEventDto
    {
        [Required(ErrorMessage = "Başlık zorunludur")]
        public string Title { get; set; }
        public string? Description { get; set; }
        public string? Note { get; set; }
        [Required(ErrorMessage = "Başlangıç tarihi zorunludur")]
        public DateTime StartAt { get; set; }
        [Required(ErrorMessage = "Bitiş tarihi zorunludur")]
        public DateTime EndAt { get; set; }
        [Required(ErrorMessage = "Kategori zorunludur")]
        public Guid CategoryId { get; set; }
        [Required(ErrorMessage = "Konum zorunludur")]
        public LocationType LocationId { get; set; }
        public Guid? ProjectId { get; set; }
        public Guid? FirmId { get; set; }
        public List<string>? Participants { get; set; } = new();
    }

}
