using AktiviteTakip.Server.Entities.Interfaces;

namespace AktiviteTakip.Server.Entities
{
    public abstract class BaseEntity : IBaseEntity
    {
        public Guid Id { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
        public bool IsActive { get; set; } = true;
        public string CreatedBy { get; set; }
        public string? UpdatedBy { get; set; }
    }
}
