using AktiviteTakip.Server.Entities.Interfaces;

namespace AktiviteTakip.Server.Entities
{
    public abstract class BaseEntity : IBaseEntity<Guid>
    {
        public Guid Id { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
        public bool IsActive { get; set; } = true;
        public Guid CreatedBy { get; set; }
        public Guid? UpdatedBy { get; set; }
    }
}
