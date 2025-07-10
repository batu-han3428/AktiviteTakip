using AktiviteTakip.Server.DTOs;
using AktiviteTakip.Server.Enums;
using AktiviteTakip.Server.Models;
using AktiviteTakip.Server.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
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
        public async Task<ActionResult<IEnumerable<UserDto>>> GetUsers([FromQuery] bool onlyActive)
        {
            var result = await _userService.GetUsersWithRolesAsync(onlyActive);
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


        /// <summary>
        /// Kullanıcı oluşturur
        /// </summary>
        /// <param name="dto">Kullanıcı bilgileri</param>
        /// <returns></returns>
        [HttpPost("createuser")]
        [Authorize(Roles = nameof(Roles.Admin))]
        public async Task<IActionResult> CreateUser(CreateUserDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _userService.CreateUserAsync(dto);

            if (result.Success)
                return Ok(result.Data);
            else
                return BadRequest(new { message = result.Message, success = false });
        }


        /// <summary>
        /// Kullanıcının bilgilerini günceller
        /// </summary>
        /// <param name="id">Kullanıcı id</param>
        /// <param name="dto">Kullanıcı bilgileri</param>
        /// <returns></returns>
        [HttpPut("updateuser")]
        [Authorize(Roles = nameof(Roles.Admin))]
        public async Task<IActionResult> UpdateUser(Guid id, [FromBody] UpdateUserDto dto)
        {
            if (id != dto.Id)
                return BadRequest("Id uyuşmuyor.");

            var result = await _userService.UpdateUserAsync(dto);

            if (!result.Success)
                return BadRequest(result.Message);

            return Ok(result);
        }


        /// <summary>
        /// Kullanıcı siler
        /// </summary>
        /// <param name="userId">Kullanıcı id</param>
        /// <returns></returns>
        [HttpDelete("deleteuser")]
        public async Task<IActionResult> DeleteUser(Guid userId)
        {
            var result = await _userService.DeleteUserAsync(userId);

            if (!result.Success)
                return BadRequest(new { message = result.Message });

            return Ok(new { message = result.Message });
        }
    }
}
