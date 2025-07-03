using AktiviteTakip.Server.Enums;

namespace AktiviteTakip.Server.Entities
{
    public class Event: BaseEntity
    {
        public string Title { get; set; } = null!;
        public string? Description { get; set; }
        public string? Note { get; set; }
        public string? Color { get; set; }
        public DateTime StartAt { get; set; }
        public DateTime EndAt { get; set; }
        public Guid CategoryId { get; set; }
        public Guid LocationId { get; set; }
        public Guid? ProjectId { get; set; }
        public Guid? FirmId { get; set; }
        public Category Category { get; set; } = null!;
        public LocationType Location { get; set; }
        public Project? Project { get; set; }
        public Firm? Firm { get; set; }
        public ICollection<EventParticipant> Participants { get; set; } = new List<EventParticipant>();
    }
}
