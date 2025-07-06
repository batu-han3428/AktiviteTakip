using AktiviteTakip.Server.Common;
using AktiviteTakip.Server.DTOs;
using AktiviteTakip.Server.Services.Interfaces;
using AktiviteTakip.Server.UnitOfWork.Interfaces;
using Microsoft.Extensions.Caching.Memory;

namespace AktiviteTakip.Server.Services
{
    public class FirmService : IFirmService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMemoryCache _cache;
        private static readonly string FirmsCacheKey = "firmsCacheKey";
        private static readonly string FirmsProjectsCacheKey = "firmsProjectsCacheKey";

        public FirmService(IUnitOfWork unitOfWork, IMemoryCache cache)
        {
            _unitOfWork = unitOfWork;
            _cache = cache;
        }

        public async Task<Result<List<FirmDto>>> GetAllFirmsAsync()
        {
            var firms = await _unitOfWork.Firms.GetAllAsync();

            if (firms == null || !firms.Any())
                return Result<List<FirmDto>>.Failure("Hiç bir firma bulunamadı.");

            var firmDtos = firms.Select(f => new FirmDto
            {
                Id = f.Id,
                Name = f.Name
            }).ToList();

            return Result<List<FirmDto>>.SuccessResult(firmDtos);
        }

        public async Task<Result<List<FirmDto>>> GetAllFirmsWithProjectsAsync()
        {
            if (_cache.TryGetValue(FirmsProjectsCacheKey, out List<FirmDto> cachedFirms))
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

                _cache.Set(FirmsProjectsCacheKey, firmDtos);

                return Result<List<FirmDto>>.SuccessResult(firmDtos);
            }
            catch (Exception ex)
            {
                return Result<List<FirmDto>>.Failure("Failed to get firms with projects: " + ex.Message);
            }
        }
    }
}
