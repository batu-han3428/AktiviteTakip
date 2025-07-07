using AktiviteTakip.Server.Common;
using AktiviteTakip.Server.DTOs;
using AktiviteTakip.Server.Services.Interfaces;
using AktiviteTakip.Server.UnitOfWork.Interfaces;

public class UserService : IUserService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ICacheService _cacheService;

    private const string UsersCacheKey = "usersCacheKey";

    public UserService(IUnitOfWork unitOfWork, ICacheService cacheService)
    {
        _unitOfWork = unitOfWork;
        _cacheService = cacheService;
    }

    public async Task<Result<IEnumerable<UserDto>>> GetUsersWithRolesAsync()
    {
        try
        {
            var cachedUsers = _cacheService.Get<IEnumerable<UserDto>>(UsersCacheKey);
            if (cachedUsers != null)
                return Result<IEnumerable<UserDto>>.SuccessResult(cachedUsers);

            var users = _unitOfWork.UserManager.Users.ToList();

            var userDtos = new List<UserDto>();

            foreach (var user in users)
            {
                var roles = await _unitOfWork.UserManager.GetRolesAsync(user);
                var role = roles.FirstOrDefault() ?? "user";

                userDtos.Add(new UserDto
                {
                    Id = user.Id,
                    Username = user.UserName,
                    Email = user.Email,
                    Role = role,
                    IsActive = user.IsActive,
                    Group = user.Group?.Name,
                    Color = user.Color
                });
            }

            _cacheService.Set(UsersCacheKey, userDtos, TimeSpan.FromMinutes(5));

            return Result<IEnumerable<UserDto>>.SuccessResult(userDtos);
        }
        catch (Exception ex)
        {
            return Result<IEnumerable<UserDto>>.Failure($"Kullanıcılar alınırken hata oluştu: {ex.Message}");
        }
    }

    public async Task<Result<bool>> UpdateUserActiveStatusAsync(Guid userId)
    {
        try
        {
            var user = await _unitOfWork.UserManager.FindByIdAsync(userId.ToString());
            if (user == null)
                return Result<bool>.Failure("Kullanıcı bulunamadı.");

            user.IsActive = !user.IsActive;

            var updateResult = await _unitOfWork.UserManager.UpdateAsync(user);
            if (!updateResult.Succeeded)
            {
                var errors = string.Join(", ", updateResult.Errors.Select(e => e.Description));
                return Result<bool>.Failure($"Güncelleme başarısız: {errors}");
            }

            var cachedUsers = _cacheService.Get<List<UserDto>>(UsersCacheKey);
            if (cachedUsers != null)
            {
                var cachedUser = cachedUsers.FirstOrDefault(u => u.Id == user.Id);
                if (cachedUser != null)
                {
                    cachedUser.IsActive = user.IsActive;
                }
                _cacheService.Set(UsersCacheKey, cachedUsers);
            }

            return Result<bool>.SuccessResult(true, "Kullanıcı durumu başarıyla güncellendi.");
        }
        catch (Exception ex)
        {
            return Result<bool>.Failure($"Beklenmeyen hata oluştu: {ex.Message}");
        }
    }
}
