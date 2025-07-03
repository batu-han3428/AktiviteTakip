namespace AktiviteTakip.Server.Entities
{
    public class Firm: BaseEntity
    {
        public string Name { get; set; } = null!;
        public ICollection<Project> Projects { get; set; } = new List<Project>();
        public ICollection<Event> Events { get; set; } = new List<Event>();
    }
}
