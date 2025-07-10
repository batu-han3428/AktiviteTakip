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
    public class GroupController : ControllerBase
    {
        private readonly IGroupService _groupService;

        public GroupController(IGroupService groupService)
        {
            _groupService = groupService;
        }


        /// <summary>
        /// Grupları listeler
        /// </summary>
        /// <returns></returns>
        [HttpGet("getgroups")]
        public async Task<IActionResult> GetGroups()
        {
            var result = await _groupService.GetAllGroupsAsync();

            if (!result.Success)
                return BadRequest(result);

            return Ok(result);
        }


        /// <summary>
        /// Grup oluşturur
        /// </summary>
        /// <param name="dto">Grup bilgileri</param>
        /// <returns></returns>
        [HttpPost("creategroup")]
        [Authorize(Roles = nameof(Roles.Admin))]
        public async Task<IActionResult> Create([FromBody] GroupCreateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _groupService.CreateGroupAsync(dto);
            if (!result.Success)
                return BadRequest(result.Message);

            return Ok(result.Data);
        }


        /// <summary>
        /// Seçili grubu günceller
        /// </summary>
        /// <param name="dto">Grup bilgileri</param>
        /// <returns></returns>
        [HttpPut("updategroup")]
        [Authorize(Roles = nameof(Roles.Admin))]
        public async Task<IActionResult> Update(GroupUpdateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _groupService.UpdateGroupAsync(dto);
            if (!result.Success)
                return BadRequest(result.Message);

            return Ok(result.Data);
        }


        /// <summary>
        /// Seçili grubu siler
        /// </summary>
        /// <param name="id">Grup id</param>
        /// <returns></returns>
        [HttpDelete("deletegroup/{id:guid}")]
        [Authorize(Roles = nameof(Roles.Admin))]
        public async Task<IActionResult> Delete(Guid id)
        {
            var result = await _groupService.DeleteGroupAsync(id);
            if (!result.Success)
                return BadRequest(result.Message);

            return Ok(new { success = true, message = result.Message });
        }
    }
}
