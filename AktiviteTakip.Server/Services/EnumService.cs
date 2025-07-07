using AktiviteTakip.Server.DTOs;
using AktiviteTakip.Server.Enums;
using AktiviteTakip.Server.Services.Interfaces;

namespace AktiviteTakip.Server.Services
{
    public class EnumService : IEnumService
    {
        public IEnumerable<EnumDto> GetLocations()
        {
            return Enum.GetValues(typeof(LocationType))
                       .Cast<LocationType>()
                       .Select(e => new EnumDto { Id = (int)e, Label = e.ToString() })
                       .ToList();
        }

        public IEnumerable<EnumDto> GetRoles()
        {
            return Enum.GetValues(typeof(Roles))
                       .Cast<Roles>()
                       .Select(e => new EnumDto { Id = (int)e, Label = e.ToString() })
                       .ToList();
        }
    }
}
