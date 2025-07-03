namespace AktiviteTakip.Server.Entities
{
    public class Project: BaseEntity
    {
        public string Name { get; set; } = null!;
        public Guid FirmId { get; set; }
        public Firm Firm { get; set; } = null!;
        public ICollection<Event> Events { get; set; } = new List<Event>();
    }
}
