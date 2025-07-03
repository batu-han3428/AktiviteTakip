namespace AktiviteTakip.Server.Entities
{
    public class Group : BaseEntity
    {
        public string Name { get; set; } = null!;
        public ICollection<ApplicationUser> Users { get; set; } = new List<ApplicationUser>();
    }
}
