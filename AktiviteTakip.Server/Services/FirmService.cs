using AktiviteTakip.Server.Common;
using AktiviteTakip.Server.DTOs;
using AktiviteTakip.Server.Services.Interfaces;
using AktiviteTakip.Server.UnitOfWork.Interfaces;

namespace AktiviteTakip.Server.Services
{
    public class FirmService : IFirmService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICacheService _cacheService;
        private static readonly string FirmsCacheKey = "firmsCacheKey";
        private static readonly string FirmsProjectsCacheKey = "firmsProjectsCacheKey";

        public FirmService(IUnitOfWork unitOfWork, ICacheService cacheService)
        {
            _unitOfWork = unitOfWork;
            _cacheService = cacheService;
        }

        public async Task<Result<List<FirmDto>>> GetAllFirmsAsync()
        {
            try { 
                var cachedFirms = _cacheService.Get<List<FirmDto>>(FirmsCacheKey);
                if (cachedFirms != null)
                {
                    return Result<List<FirmDto>>.SuccessResult(cachedFirms);
                }

                var firms = await _unitOfWork.Firms.GetAllAsync();

                if (firms == null || !firms.Any())
                    return Result<List<FirmDto>>.Failure("Hiç bir firma bulunamadı.");

                var firmDtos = firms.Select(f => new FirmDto
                {
                    Id = f.Id,
                    Name = f.Name
                }).ToList();

                _cacheService.Set(FirmsCacheKey, firmDtos);

                return Result<List<FirmDto>>.SuccessResult(firmDtos);
            }
            catch (Exception ex)
            {
                return Result<List<FirmDto>>.Failure("Failed to get firms with projects: " + ex.Message);
            }
}

        public async Task<Result<List<FirmDto>>> GetAllFirmsWithProjectsAsync()
        {
            var cachedFirms = _cacheService.Get<List<FirmDto>>(FirmsProjectsCacheKey);
            if (cachedFirms != null)
            {
                return Result<List<FirmDto>>.SuccessResult(cachedFirms);
            }

            try
            {
                var firms = await _unitOfWork.Firms.GetAllWithProjectsAsync();

                if (firms == null || !firms.Any())
                    return Result<List<FirmDto>>.Failure("No firms found.");

                var firmDtos = firms.Select(f => new FirmDto
                {
                    Id = f.Id,
                    Name = f.Name,
                    Projects = f.Projects.Select(p => new ProjectDto
                    {
                        Id = p.Id,
                        Name = p.Name,
                    }).ToList()
                }).ToList();

                _cacheService.Set(FirmsProjectsCacheKey, firmDtos);

                return Result<List<FirmDto>>.SuccessResult(firmDtos);
            }
            catch (Exception ex)
            {
                return Result<List<FirmDto>>.Failure("Failed to get firms with projects: " + ex.Message);
            }
        }
    }
}
