using AktiviteTakip.Server.DTOs;
using AktiviteTakip.Server.Enums;
using AktiviteTakip.Server.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AktiviteTakip.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }


        /// <summary>
        /// Kullanıcı listesini gösterir.
        /// </summary>
        /// <returns></returns>
        [HttpGet("getusers")]
        [Authorize(Roles = nameof(Roles.Admin))]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetUsers()
        {
            var result = await _userService.GetUsersWithRolesAsync();
            if (result.Success)
                return Ok(result.Data);
            else
                return BadRequest(result.Message);
        }


        /// <summary>
        /// Kullanıcının aktif/pasif durumunu günceller
        /// </summary>
        /// <param name="id">Kullanıcı id</param>
        /// <returns></returns>
        [HttpPut("setactivestatus")]
        public async Task<IActionResult> UpdateActiveStatus(Guid id)
        {
            if (id == Guid.Empty)
                return BadRequest("Geçersiz kullanıcı ID'si.");

            var result = await _userService.UpdateUserActiveStatusAsync(id);

            if (!result.Success)
                return BadRequest(result.Message);

            return Ok(new { message = result.Message, success = true });
        }
    }
}
