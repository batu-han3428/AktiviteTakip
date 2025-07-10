using AktiviteTakip.Server.Common;
using AktiviteTakip.Server.DTOs;
using AktiviteTakip.Server.Entities;
using AktiviteTakip.Server.Services.Interfaces;
using AktiviteTakip.Server.UnitOfWork.Interfaces;

namespace AktiviteTakip.Server.Services
{
    public class GroupService: IGroupService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICacheService _cacheService;
        private static readonly string GroupsCacheKey = "groupsCacheKey";

        public GroupService(IUnitOfWork unitOfWork, ICacheService cacheService)
        {
            _unitOfWork = unitOfWork;
            _cacheService = cacheService;
        }

        public async Task<Result<List<GroupDto>>> GetAllGroupsAsync()
        {
            try
            {
                var cachedGroups = _cacheService.Get<List<GroupDto>>(GroupsCacheKey);
                if (cachedGroups != null)
                {
                    return Result<List<GroupDto>>.SuccessResult(cachedGroups);
                }

                var groups = await _unitOfWork.Groups.GetAllAsync();

                if (groups == null || !groups.Any())
                    return Result<List<GroupDto>>.Failure("Hiç bir grup bulunamadı.");

                var groupDtos = groups.Select(g => new GroupDto
                {
                    Id = g.Id,
                    Name = g.Name
                }).ToList();

                _cacheService.Set(GroupsCacheKey, groupDtos);

                return Result<List<GroupDto>>.SuccessResult(groupDtos);
            }
            catch (Exception ex)
            {
                return Result<List<GroupDto>>.Failure("Failed to get groups: " + ex.Message);
            }
        }

        public async Task<Result<GroupDto>> CreateGroupAsync(GroupCreateDto dto)
        {
            try
            {
                var existing = await _unitOfWork.Groups.FindAsync(g => g.Name == dto.Name);
                if (existing.Any())
                    return Result<GroupDto>.Failure("Aynı isimde bir grup zaten mevcut.");

                var newGroup = new Group
                {
                    Id = Guid.NewGuid(),
                    Name = dto.Name
                };

                await _unitOfWork.Groups.AddAsync(newGroup);
                await _unitOfWork.CommitAsync();

                _cacheService.Remove(GroupsCacheKey);

                var resultDto = new GroupDto
                {
                    Id = newGroup.Id,
                    Name = newGroup.Name
                };

                return Result<GroupDto>.SuccessResult(resultDto, "Grup başarıyla oluşturuldu.");
            }
            catch (Exception ex)
            {
                return Result<GroupDto>.Failure("Grup oluşturulamadı: " + ex.Message);
            }
        }

        public async Task<Result<GroupDto>> UpdateGroupAsync(GroupUpdateDto dto)
        {
            try
            {
                var group = await _unitOfWork.Groups.GetByIdAsync(dto.Id);
                if (group == null)
                    return Result<GroupDto>.Failure("Grup bulunamadı.");

                if (group.Name != dto.Name)
                {
                    var existing = await _unitOfWork.Groups.FindAsync(g => g.Name == dto.Name && g.Id != dto.Id);
                    if (existing.Any())
                        return Result<GroupDto>.Failure("Aynı isimde başka bir grup zaten mevcut.");
                }

                group.Name = dto.Name;

                _unitOfWork.Groups.Update(group);
                await _unitOfWork.CommitAsync();

                _cacheService.Remove(GroupsCacheKey);

                var resultDto = new GroupDto
                {
                    Id = group.Id,
                    Name = group.Name
                };

                return Result<GroupDto>.SuccessResult(resultDto, "Grup başarıyla güncellendi.");
            }
            catch (Exception ex)
            {
                return Result<GroupDto>.Failure("Grup güncellenemedi: " + ex.Message);
            }
        }

        public async Task<Result<bool>> DeleteGroupAsync(Guid id)
        {
            try
            {
                var group = await _unitOfWork.Groups.GetByIdAsync(id);
                if (group == null)
                    return Result<bool>.Failure("Grup bulunamadı.");

                var hasUsers = await _unitOfWork.Users.FindAsync(u => u.GroupId == id);
                if (hasUsers.Any())
                    return Result<bool>.Failure("Bu grup kullanıcılar tarafından kullanıldığı için silinemez.");

                await _unitOfWork.Groups.SoftDeleteAsync(group);
                await _unitOfWork.CommitAsync();

                _cacheService.Remove(GroupsCacheKey);

                return Result<bool>.SuccessResult(true, "Grup başarıyla silindi.");
            }
            catch (Exception ex)
            {
                return Result<bool>.Failure("Grup silinemedi: " + ex.Message);
            }
        }
    }
}
