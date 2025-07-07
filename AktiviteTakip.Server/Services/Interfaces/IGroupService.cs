using AktiviteTakip.Server.Common;
using AktiviteTakip.Server.DTOs;

namespace AktiviteTakip.Server.Services.Interfaces
{
    public interface IGroupService
    {
        Task<Result<List<GroupDto>>> GetAllGroupsAsync();
    }
}
