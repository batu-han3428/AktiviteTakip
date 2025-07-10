using AktiviteTakip.Server.Common;
using AktiviteTakip.Server.DTOs;

namespace AktiviteTakip.Server.Services.Interfaces
{
    public interface IGroupService
    {
        Task<Result<List<GroupDto>>> GetAllGroupsAsync();
        Task<Result<GroupDto>> CreateGroupAsync(GroupCreateDto dto);
        Task<Result<GroupDto>> UpdateGroupAsync(GroupUpdateDto dto);
        Task<Result<bool>> DeleteGroupAsync(Guid id);
    }
}
