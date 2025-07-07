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
    }
}
