using AktiviteTakip.Server.Common;
using AktiviteTakip.Server.DTOs;
using AktiviteTakip.Server.Entities;
using AktiviteTakip.Server.Services.Interfaces;
using AktiviteTakip.Server.UnitOfWork.Interfaces;
using Microsoft.Extensions.Caching.Memory;

namespace AktiviteTakip.Server.Services
{
    public class EventService: IEventService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMemoryCache _cache;
        private static readonly string EventsCacheKey = "eventsCacheKey";

        public EventService(IUnitOfWork unitOfWork, IMemoryCache cache)
        {
            _unitOfWork = unitOfWork;
            _cache = cache;
        }

        public async Task<Result<Event>> CreateEventAsync(CreateEventDto dto)
        {
            try
            {
                var newEvent = new Event
                {
                    Title = dto.Title,
                    Description = dto.Description,
                    Note = dto.Note,
                    StartAt = dto.StartAt,
                    EndAt = dto.EndAt,
                    CategoryId = dto.CategoryId,
                    LocationId = dto.LocationId,
                    ProjectId = dto.ProjectId,
                    FirmId = dto.FirmId
                };

                foreach (var username in dto.Participants)
                {
                    var user = await _unitOfWork.UserManager.FindByNameAsync(username);
                    if (user != null)
                    {
                        newEvent.Participants.Add(new EventParticipant
                        {
                            UserId = user.Id,
                            Event = newEvent
                        });
                    }
                }

                await _unitOfWork.Events.AddAsync(newEvent);
                var changes = await _unitOfWork.CommitAsync();

                if (changes > 0)
                {
                    if (_cache.TryGetValue<List<Event>>(EventsCacheKey, out var cachedEvents))
                    {
                        cachedEvents.Add(newEvent);
                    }
                    else
                    {
                        _cache.Set(EventsCacheKey, new List<Event> { newEvent });
                    }

                    return Result<Event>.SuccessResult(newEvent, "Etkinlik başarıyla oluşturuldu.");
                }

                return Result<Event>.Failure("Etkinlik kaydedilemedi.");
            }
            catch (Exception ex)
            {
                return Result<Event>.Failure($"Beklenmeyen hata: {ex.Message}");
            }
        }
    }
}
