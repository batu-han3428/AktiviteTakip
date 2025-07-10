using AktiviteTakip.Server.Common;
using AktiviteTakip.Server.DTOs;
using AktiviteTakip.Server.Entities;
using AktiviteTakip.Server.Services.Interfaces;
using AktiviteTakip.Server.UnitOfWork.Interfaces;

namespace AktiviteTakip.Server.Services
{
    public class ProjectService: IProjectService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICacheService _cacheService;
        private static readonly string ProjectCacheKey = "projectCacheKey";

        public ProjectService(IUnitOfWork unitOfWork, ICacheService cacheService)
        {
            _unitOfWork = unitOfWork;
            _cacheService = cacheService;
        }

        public async Task<Result<List<ProjectDto>>> GetAllProjectsAsync()
        {
            try
            {
                var cachedProjects = _cacheService.Get<List<ProjectDto>>(ProjectCacheKey);
                if (cachedProjects != null)
                {
                    return Result<List<ProjectDto>>.SuccessResult(cachedProjects);
                }

                var projects = await _unitOfWork.Projects.GetAllAsync();

                if (projects == null || !projects.Any())
                    return Result<List<ProjectDto>>.Failure("Proje bulunamadı.");

                var projectDtos = projects.Select(f => new ProjectDto
                {
                    Id = f.Id,
                    Name = f.Name
                }).ToList();

                _cacheService.Set(ProjectCacheKey, projectDtos);

                return Result<List<ProjectDto>>.SuccessResult(projectDtos);
            }
            catch (Exception ex)
            {
                return Result<List<ProjectDto>>.Failure("Failed to get projects: " + ex.Message);
            }
        }

        public async Task<Result<ProjectDto>> AddProjectAsync(AddProjectDto dto)
        {
            try
            {
                // Aynı isimde proje var mı kontrol et
                var existingProjects = await _unitOfWork.Projects.GetAllAsync();
                if (existingProjects.Any(p => p.Name.Trim().ToLower() == dto.Name.Trim().ToLower()))
                {
                    return Result<ProjectDto>.Failure("Bu isimde bir proje zaten mevcut.");
                }

                var project = new Project
                {
                    Name = dto.Name,
                    FirmId = dto.FirmId
                };

                await _unitOfWork.Projects.AddAsync(project);
                await _unitOfWork.CommitAsync();

                // Yeni eklenen proje için DTO oluştur
                var newProjectDto = new ProjectDto
                {
                    Id = project.Id,
                    Name = project.Name
                };

                // Cache'ten mevcut projeleri al
                var cachedProjects = _cacheService.Get<List<ProjectDto>>(ProjectCacheKey) ?? new List<ProjectDto>();

                // Yeni projeyi cache'e ekle
                cachedProjects.Add(newProjectDto);

                // Güncellenmiş listeyle cache'i yeniden ayarla
                _cacheService.Set(ProjectCacheKey, cachedProjects);

                return Result<ProjectDto>.SuccessResult(newProjectDto, "Proje başarıyla eklendi.");
            }
            catch (Exception ex)
            {
                return Result<ProjectDto>.Failure("Proje eklenirken hata oluştu: " + ex.Message);
            }
        }

        public async Task<Result<ProjectDto>> UpdateProjectAsync(UpdateProjectDto dto)
        {
            try
            {
                if (dto == null || dto.Id == Guid.Empty || string.IsNullOrWhiteSpace(dto.Name))
                    return Result<ProjectDto>.Failure("Geçersiz proje bilgisi.");

                var project = await _unitOfWork.Projects.GetByIdAsync(dto.Id);
                if (project == null)
                    return Result<ProjectDto>.Failure("Güncellenmek istenen proje bulunamadı.");

                var existingProjects = await _unitOfWork.Projects.GetAllAsync();
                if (existingProjects.Any(p =>
                        p.Id != dto.Id &&
                        p.Name.Trim().ToLower() == dto.Name.Trim().ToLower()))
                {
                    return Result<ProjectDto>.Failure("Bu isimde başka bir proje zaten mevcut.");
                }

                project.Name = dto.Name;

                _unitOfWork.Projects.Update(project);
                await _unitOfWork.CommitAsync();

                var updatedProjectDto = new ProjectDto
                {
                    Id = project.Id,
                    Name = project.Name
                };

                var cachedProjects = _cacheService.Get<List<ProjectDto>>(ProjectCacheKey) ?? new List<ProjectDto>();

                var index = cachedProjects.FindIndex(p => p.Id == dto.Id);
                if (index != -1)
                {
                    cachedProjects[index] = updatedProjectDto;
                }
                else
                {
                    cachedProjects.Add(updatedProjectDto);
                }

                _cacheService.Set(ProjectCacheKey, cachedProjects);

                return Result<ProjectDto>.SuccessResult(updatedProjectDto, "Proje başarıyla güncellendi.");
            }
            catch (Exception ex)
            {
                return Result<ProjectDto>.Failure("Proje güncellenirken hata oluştu: " + ex.Message);
            }
        }

        public async Task<Result<bool>> DeleteProjectAsync(Guid id)
        {
            try
            {
                var project = await _unitOfWork.Projects.GetByIdAsync(id);
                if (project == null)
                    return Result<bool>.Failure("Silinmek istenen proje bulunamadı.");

                await _unitOfWork.Projects.SoftDeleteAsync(project);
                await _unitOfWork.CommitAsync();

                var cachedProjects = _cacheService.Get<List<ProjectDto>>(ProjectCacheKey);
                if (cachedProjects != null)
                {
                    var updatedProjects = cachedProjects.Where(p => p.Id != id).ToList();
                    _cacheService.Set(ProjectCacheKey, updatedProjects);
                }

                return Result<bool>.SuccessResult(true, "Proje başarıyla silindi.");
            }
            catch (Exception ex)
            {
                return Result<bool>.Failure("Proje silinirken hata oluştu: " + ex.Message);
            }
        }
    }
}
