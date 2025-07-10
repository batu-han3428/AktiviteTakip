using AktiviteTakip.Server.Common;
using AktiviteTakip.Server.DTOs;

namespace AktiviteTakip.Server.Services.Interfaces
{
    public interface IFirmService
    {
        Task<Result<List<FirmDto>>> GetAllFirmsAsync();
        Task<Result<List<FirmDto>>> GetAllFirmsWithProjectsAsync();
        Task<Result<FirmDto>> AddFirmAsync(AddFirmDto dto);
        Task<Result<FirmDto>> UpdateFirmAsync(FirmDto dto);
        Task<Result<bool>> DeleteFirmAsync(Guid id);
    }
}
