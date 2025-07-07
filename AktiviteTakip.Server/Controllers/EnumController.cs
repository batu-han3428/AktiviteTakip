using AktiviteTakip.Server.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace AktiviteTakip.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EnumController : ControllerBase
    {
        private readonly IEnumService _enumService;

        public EnumController(IEnumService enumService)
        {
            _enumService = enumService;
        }


        /// <summary>
        /// Konum seçeneklerini listeler
        /// </summary>
        /// <returns></returns>
        [HttpGet("locations")]
        public IActionResult GetLocations()
        {
            var locations = _enumService.GetLocations();
            return Ok(locations);
        }


        /// <summary>
        /// Rolleri listeler
        /// </summary>
        /// <returns></returns>
        [HttpGet("roles")]
        public IActionResult GetRoles()
        {
            var locations = _enumService.GetRoles();
            return Ok(locations);
        }
    }
}
