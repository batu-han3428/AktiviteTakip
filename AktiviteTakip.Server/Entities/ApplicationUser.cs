using AktiviteTakip.Server.Entities.Interfaces;
using Microsoft.AspNetCore.Identity;

namespace AktiviteTakip.Server.Entities
{
    public class ApplicationUser : IdentityUser, IBaseEntity
    {
        public Guid Id { get; set; }
        public Guid? GroupId { get; set; }
        public Group? Group { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
        public bool IsActive { get; set; } = true;
        public string CreatedBy { get; set; }
        public string? UpdatedBy { get; set; }
    }
}
