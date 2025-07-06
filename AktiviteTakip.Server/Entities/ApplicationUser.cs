using AktiviteTakip.Server.Entities.Interfaces;
using Microsoft.AspNetCore.Identity;

namespace AktiviteTakip.Server.Entities
{
    public class ApplicationUser : IdentityUser<Guid>, IBaseEntity<Guid>
    {
        //public Guid Id { get; set; }
        public Guid? GroupId { get; set; }
        public Group? Group { get; set; }
        public string? Color { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
        public bool IsActive { get; set; } = true;
        public Guid CreatedBy { get; set; }
        public Guid? UpdatedBy { get; set; }
    }
}
