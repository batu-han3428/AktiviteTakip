using AktiviteTakip.Server.DTOs;
using AktiviteTakip.Server.Enums;
using AktiviteTakip.Server.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AktiviteTakip.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ProjectController : ControllerBase
    {
        private readonly IProjectService _projectService;

        public ProjectController(IProjectService projectService)
        {
            _projectService = projectService;
        }


        /// <summary>
        /// Projeleri listeler
        /// </summary>
        /// <returns></returns>
        [HttpGet("getprojects")]
        public async Task<IActionResult> GetProjects()
        {
            var result = await _projectService.GetAllProjectsAsync();

            if (!result.Success)
                return BadRequest(result);

            return Ok(result);
        }


        /// <summary>
        /// Proje ekler
        /// </summary>
        /// <param name="dto">Proje bilgileri</param>
        /// <returns></returns>
        [HttpPost("addproject")]
        [Authorize(Roles = nameof(Roles.Admin))]
        public async Task<IActionResult> AddProject(AddProjectDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest("Geçersiz proje verisi.");

            var result = await _projectService.AddProjectAsync(dto);

            if (!result.Success)
                return BadRequest(result.Message);

            return Ok(result);
        }


        /// <summary>
        /// Seçili projeyi günceller
        /// </summary>
        /// <param name="dto">Proje bilgileri</param>
        /// <returns></returns>
        [HttpPut("updateproject")]
        [Authorize(Roles = nameof(Roles.Admin))]
        public async Task<IActionResult> UpdateProject(UpdateProjectDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest("Geçersiz proje bilgisi.");

            var result = await _projectService.UpdateProjectAsync(dto);

            if (!result.Success)
                return BadRequest(result.Message);

            return Ok(result);
        }


        /// <summary>
        /// Seçili projeyi siler
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpDelete("deleteproject")]
        [Authorize(Roles = nameof(Roles.Admin))]
        public async Task<IActionResult> DeleteProject(Guid id)
        {
            if (id == Guid.Empty)
                return BadRequest("Geçersiz proje ID.");

            var result = await _projectService.DeleteProjectAsync(id);

            if (!result.Success)
                return BadRequest(result.Message);

            return Ok(result);
        }
    }
}
