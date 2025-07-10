using AktiviteTakip.Server.Common;
using AktiviteTakip.Server.DTOs;
using AktiviteTakip.Server.Entities;
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

        public async Task<Result<FirmDto>> AddFirmAsync(AddFirmDto dto)
        {
            try
            {
                var existingFirms = await _unitOfWork.Firms.GetAllAsync();
                if (existingFirms.Any(f => f.Name.Trim().ToLower() == dto.Name.Trim().ToLower()))
                {
                    return Result<FirmDto>.Failure("Bu isimde bir firma zaten mevcut.");
                }

                var firm = new Firm
                {
                    Name = dto.Name
                };

                await _unitOfWork.Firms.AddAsync(firm);
                await _unitOfWork.CommitAsync();

                var newFirmDto = new FirmDto
                {
                    Id = firm.Id,
                    Name = firm.Name
                };

                var cachedFirms = _cacheService.Get<List<FirmDto>>(FirmsCacheKey) ?? new List<FirmDto>();
                cachedFirms.Add(newFirmDto);
                _cacheService.Set(FirmsCacheKey, cachedFirms);

                return Result<FirmDto>.SuccessResult(newFirmDto, "Firma başarıyla eklendi.");
            }
            catch (Exception ex)
            {
                return Result<FirmDto>.Failure("Firma eklenirken hata oluştu: " + ex.Message);
            }
        }

        public async Task<Result<FirmDto>> UpdateFirmAsync(FirmDto dto)
        {
            try
            {
                var existingFirm = await _unitOfWork.Firms.GetByIdAsync(dto.Id);
                if (existingFirm == null)
                    return Result<FirmDto>.Failure("Firma bulunamadı.");

                var allFirms = await _unitOfWork.Firms.GetAllAsync();
                if (allFirms.Any(f => f.Name.Trim().ToLower() == dto.Name.Trim().ToLower() && f.Id != dto.Id))
                {
                    return Result<FirmDto>.Failure("Bu isimde başka bir firma zaten mevcut.");
                }

                existingFirm.Name = dto.Name;

                _unitOfWork.Firms.Update(existingFirm);
                await _unitOfWork.CommitAsync();

                var updatedFirmDto = new FirmDto
                {
                    Id = existingFirm.Id,
                    Name = existingFirm.Name
                };

                var cachedFirms = _cacheService.Get<List<FirmDto>>(FirmsCacheKey) ?? new List<FirmDto>();

                cachedFirms.RemoveAll(f => f.Id == updatedFirmDto.Id);

                cachedFirms.Add(updatedFirmDto);

                _cacheService.Set(FirmsCacheKey, cachedFirms);

                return Result<FirmDto>.SuccessResult(updatedFirmDto, "Firma başarıyla güncellendi.");
            }
            catch (Exception ex)
            {
                return Result<FirmDto>.Failure("Firma güncellenirken hata oluştu: " + ex.Message);
            }
        }

        public async Task<Result<bool>> DeleteFirmAsync(Guid id)
        {
            try
            {
                var firm = await _unitOfWork.Firms.GetByIdAsync(id);
                if (firm == null)
                    return Result<bool>.Failure("Firma bulunamadı.");

                var projects = await _unitOfWork.Projects.FindAsync(p => p.FirmId == id);
                if (projects != null && projects.Any())
                    return Result<bool>.Failure("Bu firmaya bağlı projeler bulunduğu için firma silinemez.");

                await _unitOfWork.Firms.SoftDeleteAsync(firm);
                await _unitOfWork.CommitAsync();

                var cachedFirms = _cacheService.Get<List<FirmDto>>(FirmsCacheKey) ?? new List<FirmDto>();
                cachedFirms.RemoveAll(f => f.Id == id);
                _cacheService.Set(FirmsCacheKey, cachedFirms);

                return Result<bool>.SuccessResult(true, "Firma başarıyla silindi.");
            }
            catch (Exception ex)
            {
                return Result<bool>.Failure("Firma silinirken hata oluştu: " + ex.Message);
            }
        }
    }
}
