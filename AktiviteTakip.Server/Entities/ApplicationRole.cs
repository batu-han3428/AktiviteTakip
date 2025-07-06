using Microsoft.AspNetCore.Identity;

namespace AktiviteTakip.Server.Entities
{
    public class ApplicationRole : IdentityRole<Guid>
    {
        public ApplicationRole() : base()
        {
            Id = Guid.NewGuid(); 
        }

        public ApplicationRole(string roleName) : base(roleName)
        {
            Id = Guid.NewGuid();  
        }
    }
}
