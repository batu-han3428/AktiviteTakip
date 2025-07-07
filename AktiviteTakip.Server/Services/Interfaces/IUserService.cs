using AktiviteTakip.Server.Common;
using AktiviteTakip.Server.DTOs;

namespace AktiviteTakip.Server.Services.Interfaces
{
    public interface IUserService
    {
        Task<Result<IEnumerable<UserDto>>> GetUsersWithRolesAsync();
        Task<Result<bool>> UpdateUserActiveStatusAsync(Guid userId);
    }
}
