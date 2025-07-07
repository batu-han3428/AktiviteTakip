using AktiviteTakip.Server.Common;
using AktiviteTakip.Server.DTOs;
using AktiviteTakip.Server.Entities;

namespace AktiviteTakip.Server.Services.Interfaces
{
    public interface IEventService
    {
        Task<Result<Event>> CreateEventAsync(CreateEventDto dto);
        Task<Result<List<GetEventDto>>> GetEventsAsync(string? username = null);
        Task<Result<Event>> UpdateEventAsync(Guid eventId, CreateEventDto dto);
    }
}
