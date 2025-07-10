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
    public class FirmController : ControllerBase
    {
        private readonly IFirmService _firmService;

        public FirmController(IFirmService firmService)
        {
            _firmService = firmService;
        }


        /// <summary>
        /// Firmaları listeler
        /// </summary>
        /// <returns></returns>
        [HttpGet("getfirms")]
        public async Task<IActionResult> GetFirms()
        {
            var result = await _firmService.GetAllFirmsAsync();

            if (!result.Success)
                return BadRequest(result);

            return Ok(result);
        }


        /// <summary>
        /// Firmaları ve projelerini listeler
        /// </summary>
        /// <returns></returns>

        [HttpGet("getfirmsprojects")]
        public async Task<IActionResult> GetFirmsProjects()
        {
            var result = await _firmService.GetAllFirmsWithProjectsAsync();

            if (!result.Success)
                return BadRequest(result);

            return Ok(result);
        }


        /// <summary>
        /// Firma ekler
        /// </summary>
        /// <param name="dto">Firma bilgileri</param>
        /// <returns></returns>
        [HttpPost("addfirm")]
        [Authorize(Roles = nameof(Roles.Admin))]
        public async Task<IActionResult> AddFirm(AddFirmDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest("Firma bilgileri eksik veya geçersiz.");

            var result = await _firmService.AddFirmAsync(dto);

            if (!result.Success)
                return BadRequest(result.Message);

            return Ok(result);
        }


        /// <summary>
        /// Firmayı günceller
        /// </summary>
        /// <param name="dto">Firma bilgileri</param>
        /// <returns></returns>
        [HttpPut("updatefirm")]
        [Authorize(Roles = nameof(Roles.Admin))]
        public async Task<IActionResult> UpdateFirm(FirmDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest("Geçersiz firma bilgisi.");

            var result = await _firmService.UpdateFirmAsync(dto);

            if (!result.Success)
                return BadRequest(result.Message);

            return Ok(result);
        }


        /// <summary>
        /// Firmayı siler
        /// </summary>
        /// <param name="id">Firma id</param>
        /// <returns></returns>
        [HttpDelete("deletefirm")]
        [Authorize(Roles = nameof(Roles.Admin))]
        public async Task<IActionResult> DeleteFirm(Guid id)
        {
            if (id == Guid.Empty)
                return BadRequest("Geçersiz firma ID.");

            var result = await _firmService.DeleteFirmAsync(id);

            if (!result.Success)
                return BadRequest(result.Message);

            return Ok(result);
        }
    }
}
