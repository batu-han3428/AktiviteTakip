using AktiviteTakip.Server.Common;
using AktiviteTakip.Server.DTOs;

namespace AktiviteTakip.Server.Services.Interfaces
{
    public interface IFirmService
    {
        Task<Result<List<FirmDto>>> GetAllFirmsAsync();
        Task<Result<List<FirmDto>>> GetAllFirmsWithProjectsAsync();
    }
}
