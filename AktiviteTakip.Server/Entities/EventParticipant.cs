namespace AktiviteTakip.Server.Entities
{
    public class EventParticipant
    {
        public Guid EventId { get; set; }
        public Guid UserId { get; set; }
        public Event Event { get; set; } = null!;
    }
}
