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

        [HttpGet("getevents")]
        public async Task<IActionResult> GetEvents(string? username = null)
        {
            var result = await _eventService.GetEventsAsync(username);

            if (result.Success)
                return Ok(result);

            return BadRequest(result);
        }

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
