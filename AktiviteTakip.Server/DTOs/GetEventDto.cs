using AktiviteTakip.Server.Enums;

namespace AktiviteTakip.Server.DTOs
{
    public sealed class GetEventDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string? Description { get; set; }
        public string? Note { get; set; }
        public DateTime StartAt { get; set; }
        public DateTime EndAt { get; set; }
        public Guid CategoryId { get; set; }
        public LocationType LocationId { get; set; }
        public Guid? ProjectId { get; set; }
        public Guid? FirmId { get; set; }
    }
}
