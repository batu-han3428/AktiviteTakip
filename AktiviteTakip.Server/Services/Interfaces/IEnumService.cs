using AktiviteTakip.Server.DTOs;

namespace AktiviteTakip.Server.Services.Interfaces
{
    public interface IEnumService
    {
        IEnumerable<EnumDto> GetLocations();
    }
}
