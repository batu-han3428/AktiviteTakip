using AktiviteTakip.Server.Common;
using AktiviteTakip.Server.DTOs;

namespace AktiviteTakip.Server.Services.Interfaces
{
    public interface IUserService
    {
        Task<Result<IEnumerable<UserDto>>> GetUsersWithRolesAsync(bool onlyActive = false);
        Task<Result<bool>> UpdateUserActiveStatusAsync(Guid userId);
        Task<Result<UserDto>> CreateUserAsync(CreateUserDto dto);
        Task<Result<UserDto>> UpdateUserAsync(UpdateUserDto dto);
        Task<Result<bool>> DeleteUserAsync(Guid userId);
    }
}
