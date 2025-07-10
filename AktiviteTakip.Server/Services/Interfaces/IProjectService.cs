using AktiviteTakip.Server.Common;
using AktiviteTakip.Server.DTOs;

namespace AktiviteTakip.Server.Services.Interfaces
{
    public interface IProjectService
    {
        Task<Result<List<ProjectDto>>> GetAllProjectsAsync();
        Task<Result<ProjectDto>> AddProjectAsync(AddProjectDto dto);
        Task<Result<ProjectDto>> UpdateProjectAsync(UpdateProjectDto dto);
        Task<Result<bool>> DeleteProjectAsync(Guid id);
    }
}
