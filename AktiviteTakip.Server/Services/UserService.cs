using AktiviteTakip.Server.Common;
using AktiviteTakip.Server.DTOs;
using AktiviteTakip.Server.Entities;
using AktiviteTakip.Server.Enums;
using AktiviteTakip.Server.Models;
using AktiviteTakip.Server.Services.Interfaces;
using AktiviteTakip.Server.UnitOfWork.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using System.Data;

public class UserService : IUserService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ICacheService _cacheService;
    private readonly IEmailService _emailService;
    private readonly AppSettings _appSettings;
    private readonly IUserContextService _userContextService;

    private const string UsersCacheKey = "usersCacheKey";

    public UserService(IUnitOfWork unitOfWork, ICacheService cacheService, IEmailService emailService,
        IOptions<AppSettings> appSettings, IUserContextService userContextService)
    {
        _unitOfWork = unitOfWork;
        _cacheService = cacheService;
        _emailService = emailService;
        _appSettings = appSettings.Value;
        _userContextService = userContextService;
    }

    public async Task<Result<IEnumerable<UserDto>>> GetUsersWithRolesAsync(bool onlyActive = false)
    {
        try
        {
            var cachedUsers = _cacheService.Get<IEnumerable<UserDto>>(UsersCacheKey);

            if (cachedUsers == null)
            {
                var users = _unitOfWork.UserManager.Users.ToList();

                var userDtos = new List<UserDto>();

                foreach (var user in users)
                {
                    var roles = await _unitOfWork.UserManager.GetRolesAsync(user);
                    var roleString = roles.FirstOrDefault();
                    var role = Enum.TryParse<Roles>(roleString, out var parsedRole) ? parsedRole : Roles.User;

                    GroupDto? groupDto = null;
                    if (user.GroupId.HasValue)
                    {
                        var group = await _unitOfWork.Groups.GetByIdAsync(user.GroupId.Value);
                        if (group != null)
                        {
                            groupDto = new GroupDto
                            {
                                Id = group.Id,
                                Name = group.Name
                            };
                        }
                    }

                    userDtos.Add(new UserDto
                    {
                        Id = user.Id,
                        Username = user.UserName,
                        Email = user.Email,
                        Role = role.ToString(),
                        IsActive = user.IsActive,
                        Group = groupDto,
                        Color = user.Color
                    });
                }

                _cacheService.Set(UsersCacheKey, userDtos);

                cachedUsers = userDtos;
            }

            if (onlyActive)
            {
                cachedUsers = cachedUsers.Where(u => u.IsActive).ToList();
            }

            return Result<IEnumerable<UserDto>>.SuccessResult(cachedUsers);
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

    public async Task<Result<UserDto>> CreateUserAsync(CreateUserDto dto)
    {
        try
        {
            var existingUser = await _unitOfWork.UserManager.FindByEmailAsync(dto.Email);
            if (existingUser != null)
                return Result<UserDto>.Failure("Bu e-posta adresiyle kayıtlı bir kullanıcı zaten var.");

            var user = new ApplicationUser
            {
                UserName = dto.Username,
                Email = dto.Email,
                IsActive = true,
                Color = dto.Color,
                GroupId = dto.GroupId.HasValue ? dto.GroupId : null,
                CreatedAt = DateTime.Now,
                CreatedBy = _userContextService.GetUserId() ?? Guid.Empty
            };

            IdentityResult createResult;

            if (!string.IsNullOrWhiteSpace(dto.Password))
            {
                // Yönetici şifre belirleyecek
                createResult = await _unitOfWork.UserManager.CreateAsync(user, dto.Password);
            }
            else
            {
                // Kullanıcı şifre belirleyecek
                createResult = await _unitOfWork.UserManager.CreateAsync(user);
            }

            if (!createResult.Succeeded)
            {
                var errors = string.Join(", ", createResult.Errors.Select(e => e.Description));
                return Result<UserDto>.Failure($"Kullanıcı oluşturulamadı: {errors}");
            }

            var roleName = Enum.GetName(typeof(Roles), dto.Role);
            if (string.IsNullOrEmpty(roleName))
                return Result<UserDto>.Failure("Geçersiz rol.");

            // Role ata

            var role = await _unitOfWork.RoleManager.FindByNameAsync(roleName);
            if (role == null)
                return Result<UserDto>.Failure("Belirtilen rol bulunamadı.");

            await _unitOfWork.UserManager.AddToRoleAsync(user, roleName);

            // Eğer şifre boş bırakıldıysa (kullanıcı kendi şifresini belirleyecekse)
            if (string.IsNullOrWhiteSpace(dto.Password))
            {
                var token = await _unitOfWork.UserManager.GeneratePasswordResetTokenAsync(user);
                var encodedToken = System.Web.HttpUtility.UrlEncode(token);
                var resetLink = $"{_appSettings.ClientUrl}/reset-password?userId={user.Id}&token={encodedToken}";

                await _emailService.SendPasswordSetupLinkAsync(user.Email, resetLink);
            }

            // Cache güncelle
            var cachedUsers = _cacheService.Get<List<UserDto>>(UsersCacheKey) ?? new List<UserDto>();

            GroupDto? groupDto = null;
            if (user.GroupId.HasValue)
            {
                var group = await _unitOfWork.Groups.GetByIdAsync(user.GroupId.Value);
                if (group != null)
                {
                    groupDto = new GroupDto
                    {
                        Id = group.Id,
                        Name = group.Name
                    };
                }
            }

            var userDto = new UserDto
            {
                Id = user.Id,
                Username = user.UserName,
                Email = user.Email,
                IsActive = user.IsActive,
                Role = roleName,
                Group = groupDto,
                Color = user.Color
            };

            cachedUsers.Add(userDto);

            _cacheService.Set(UsersCacheKey, cachedUsers);

            return Result<UserDto>.SuccessResult(userDto, "Kullanıcı başarıyla oluşturuldu.");
        }
        catch (Exception ex)
        {
            return Result<UserDto>.Failure($"Kullanıcı oluşturulurken hata oluştu: {ex.Message}");
        }
    }

    public async Task<Result<UserDto>> UpdateUserAsync(UpdateUserDto dto)
    {
        try
        {
            var user = await _unitOfWork.UserManager.FindByIdAsync(dto.Id.ToString());
            if (user == null)
                return Result<UserDto>.Failure("Kullanıcı bulunamadı.");

            user.UserName = dto.Username;
            user.Email = dto.Email;
            user.Color = dto.Color;
            user.GroupId = dto.GroupId;
            user.UpdatedAt = DateTime.Now;
            user.UpdatedBy = _userContextService.GetUserId() ?? Guid.Empty;

            if (dto.IsPasswordChangeRequested)
            {
              
                    // Şifre kutusu boş bırakıldı, kullanıcı kendi şifresini belirleyecekse:
                    // Şifre reset linki gönder
                    var token = await _unitOfWork.UserManager.GeneratePasswordResetTokenAsync(user);
                    var encodedToken = System.Web.HttpUtility.UrlEncode(token);
                    var resetLink = $"{_appSettings.ClientUrl}/reset-password?userId={user.Id}&token={encodedToken}";

                    await _emailService.SendPasswordSetupLinkAsync(user.Email, resetLink);
            }
            else if (!string.IsNullOrWhiteSpace(dto.Password))
                {
                    // Yönetici şifreyi belirledi, direkt güncelle
                    var token = await _unitOfWork.UserManager.GeneratePasswordResetTokenAsync(user);
                    var passwordResult = await _unitOfWork.UserManager.ResetPasswordAsync(user, token, dto.Password);

                    if (!passwordResult.Succeeded)
                    {
                        var errors = string.Join(", ", passwordResult.Errors.Select(e => e.Description));
                        return Result<UserDto>.Failure($"Şifre güncellenemedi: {errors}");
                    }
                }
            

            // Rol güncellemesi
            var currentRoles = await _unitOfWork.UserManager.GetRolesAsync(user);
            var newRoleName = Enum.GetName(typeof(Roles), dto.Role);
            if (string.IsNullOrEmpty(newRoleName))
                return Result<UserDto>.Failure("Geçersiz rol.");

            if (!currentRoles.Contains(newRoleName))
            {
                await _unitOfWork.UserManager.RemoveFromRolesAsync(user, currentRoles);
                await _unitOfWork.UserManager.AddToRoleAsync(user, newRoleName);
            }

            var updateResult = await _unitOfWork.UserManager.UpdateAsync(user);
            if (!updateResult.Succeeded)
            {
                var errors = string.Join(", ", updateResult.Errors.Select(e => e.Description));
                return Result<UserDto>.Failure($"Kullanıcı güncellenemedi: {errors}");
            }

            var cachedUsers = _cacheService.Get<List<UserDto>>(UsersCacheKey);
            if (cachedUsers != null)
            {
                var cachedUser = cachedUsers.FirstOrDefault(u => u.Id == user.Id);
                if (cachedUser != null)
                {
                    cachedUser.Username = user.UserName;
                    cachedUser.Email = user.Email;
                    cachedUser.Color = user.Color;
                    cachedUser.Role = newRoleName;

                    if (dto.GroupId.HasValue)
                    {
                        var group = await _unitOfWork.Groups.GetByIdAsync(dto.GroupId.Value);
                        if (group != null)
                            cachedUser.Group = new GroupDto { Id = group.Id, Name = group.Name };
                    }
                    else
                    {
                        cachedUser.Group = null;
                    }

                    _cacheService.Set(UsersCacheKey, cachedUsers);
                }
            }

            var resultDto = new UserDto
            {
                Id = user.Id,
                Username = user.UserName,
                Email = user.Email,
                Role = newRoleName,
                IsActive = user.IsActive,
                Color = user.Color,
                Group = dto.GroupId.HasValue
                    ? new GroupDto
                    {
                        Id = dto.GroupId.Value,
                        Name = (await _unitOfWork.Groups.GetByIdAsync(dto.GroupId.Value))?.Name ?? ""
                    }
                    : null
            };

            return Result<UserDto>.SuccessResult(resultDto, "Kullanıcı başarıyla güncellendi.");
        }
        catch (Exception ex)
        {
            return Result<UserDto>.Failure($"Kullanıcı güncellenirken hata oluştu: {ex.Message}");
        }
    }

    public async Task<Result<bool>> DeleteUserAsync(Guid userId)
    {
        try
        {
            var user = await _unitOfWork.UserManager.FindByIdAsync(userId.ToString());
            if (user == null)
                return Result<bool>.Failure("Kullanıcı bulunamadı.");

            //event işlemlerine geçildiğinde bakılacak
            // Kullanıcının eventleri var mı kontrol et
            //var userEvents = await _unitOfWork.Events.GetEventsByUserIdAsync(userId);
            //if (userEvents != null && userEvents.Any())
            //    return Result<bool>.Failure("Kullanıcıya ait aktiviteler bulunduğu için silme işlemi yapılamaz.");

            var deleteResult = await _unitOfWork.UserManager.DeleteAsync(user);
            if (!deleteResult.Succeeded)
            {
                var errors = string.Join(", ", deleteResult.Errors.Select(e => e.Description));
                return Result<bool>.Failure($"Kullanıcı silinemedi: {errors}");
            }

            // Cache'den sil
            var cachedUsers = _cacheService.Get<List<UserDto>>(UsersCacheKey);
            if (cachedUsers != null)
            {
                var cachedUser = cachedUsers.FirstOrDefault(u => u.Id == user.Id);
                if (cachedUser != null)
                {
                    cachedUsers.Remove(cachedUser);
                    _cacheService.Set(UsersCacheKey, cachedUsers);
                }
            }

            return Result<bool>.SuccessResult(true, "Kullanıcı başarıyla silindi.");
        }
        catch (Exception ex)
        {
            return Result<bool>.Failure($"Kullanıcı silinirken hata oluştu: {ex.Message}");
        }
    }
}
