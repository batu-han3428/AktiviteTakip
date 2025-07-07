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
    }
}
