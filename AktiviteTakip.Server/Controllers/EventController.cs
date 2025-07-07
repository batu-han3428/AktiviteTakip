using AktiviteTakip.Server.DTOs;
using AktiviteTakip.Server.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AktiviteTakip.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class EventController : ControllerBase
    {
        private readonly IEventService _eventService;

        public EventController(IEventService eventService)
        {
            _eventService = eventService;
        }


        /// <summary>
        /// Aktivite oluşturur
        /// </summary>
        /// <param name="newEventDto">Aktivite bilgileri</param>
        /// <returns></returns>
        [HttpPost("createevent")]
        public async Task<IActionResult> CreateEvent(CreateEventDto newEventDto)
        {
            if (!ModelState.IsValid)
                return BadRequest("Geçersiz veri.");

            var result = await _eventService.CreateEventAsync(newEventDto);

            if (result.Success)
                return Ok(result);

            return BadRequest(result);
        }


        /// <summary>
        /// Aktiviteleri listeler
        /// </summary>
        /// <param name="username">Kullanıcı id</param>
        /// <returns></returns>

        [HttpGet("getevents")]
        public async Task<IActionResult> GetEvents(string? username = null)
        {
            var result = await _eventService.GetEventsAsync(username);

            if (result.Success)
                return Ok(result);

            return BadRequest(result);
        }


        /// <summary>
        /// Aktivite günceller
        /// </summary>
        /// <param name="id">Aktivite id</param>
        /// <param name="updatedEventDto">Aktivite bilgileri</param>
        /// <returns></returns>

        [HttpPut("updateevent/{id:guid}")]
        public async Task<IActionResult> UpdateEvent(Guid id, CreateEventDto updatedEventDto)
        {
            if (!ModelState.IsValid)
                return BadRequest("Geçersiz veri.");

            var result = await _eventService.UpdateEventAsync(id, updatedEventDto);

            if (result.Success)
                return Ok(result);

            return BadRequest(result);
        }
    }
}
