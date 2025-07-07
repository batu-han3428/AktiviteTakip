using AktiviteTakip.Server.Common;
using AktiviteTakip.Server.DTOs;
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
    }
}
