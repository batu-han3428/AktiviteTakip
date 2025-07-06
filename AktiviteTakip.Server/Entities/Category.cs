namespace AktiviteTakip.Server.Entities
{
    public class Category: BaseEntity
    {
        public string Name { get; set; } = null!;
        public ICollection<Event> Events { get; set; } = new List<Event>();
    }
}
