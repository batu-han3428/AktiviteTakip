using AktiviteTakip.Server.Common;
using AktiviteTakip.Server.DTOs;
using AktiviteTakip.Server.Entities;
using AktiviteTakip.Server.Services.Interfaces;
using AktiviteTakip.Server.UnitOfWork.Interfaces;

namespace AktiviteTakip.Server.Services
{
    public class EventService : IEventService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICacheService _cacheService;
        private static readonly string EventsCacheKey = "eventsCacheKey";

        public EventService(IUnitOfWork unitOfWork, ICacheService cacheService)
        {
            _unitOfWork = unitOfWork;
            _cacheService = cacheService;
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
                    var cachedEvents = _cacheService.Get<List<Event>>(EventsCacheKey);

                    if (cachedEvents != null)
                    {
                        cachedEvents.Add(newEvent);
                    }
                    else
                    {
                        _cacheService.Set(EventsCacheKey, new List<Event> { newEvent });
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

        public async Task<Result<List<GetEventDto>>> GetEventsAsync(string? username = null)
        {
            try
            {
                List<Event> events;

                var cachedEvents = _cacheService.Get<List<Event>>(EventsCacheKey);

                if (cachedEvents != null)
                {
                    events = cachedEvents.Where(e => e.IsActive).ToList();
                }
                else
                {
                    var eventsFromDb = await _unitOfWork.Events.GetAllAsync();
                    events = eventsFromDb.ToList();

                    _cacheService.Set(EventsCacheKey, events);
                }

                if (!string.IsNullOrEmpty(username))
                {
                    //events = events.Where(e => e.Participants.Any(p => p.UserId == username)).ToList();
                }

                var dtoList = events.Select(ev => new GetEventDto
                {
                    Id = ev.Id,
                    Title = ev.Title,
                    Description = ev.Description,
                    StartAt = ev.StartAt,
                    EndAt = ev.EndAt,
                    CategoryId = ev.CategoryId,
                    LocationId = ev.LocationId,
                    ProjectId = ev.ProjectId,
                    FirmId = ev.FirmId,
                    Note = ev.Note
                }).ToList();

                return Result<List<GetEventDto>>.SuccessResult(dtoList);
            }
            catch (Exception ex)
            {
                return Result<List<GetEventDto>>.Failure($"Beklenmeyen hata: {ex.Message}");
            }
        }

        public async Task<Result<Event>> UpdateEventAsync(Guid eventId, CreateEventDto dto)
        {
            try
            {
                var existingEvent = await _unitOfWork.Events.GetByIdAsync(eventId);

                if (existingEvent == null || !existingEvent.IsActive)
                    return Result<Event>.Failure("Etkinlik bulunamadı.");

                existingEvent.Title = dto.Title;
                existingEvent.Description = dto.Description;
                existingEvent.Note = dto.Note;
                existingEvent.StartAt = dto.StartAt;
                existingEvent.EndAt = dto.EndAt;
                existingEvent.CategoryId = dto.CategoryId;
                existingEvent.LocationId = dto.LocationId;
                existingEvent.ProjectId = dto.ProjectId;
                existingEvent.FirmId = dto.FirmId;

                existingEvent.Participants.Clear();

                foreach (var username in dto.Participants)
                {
                    var user = await _unitOfWork.UserManager.FindByNameAsync(username);
                    if (user != null)
                    {
                        existingEvent.Participants.Add(new EventParticipant
                        {
                            UserId = user.Id,
                            EventId = eventId
                        });
                    }
                }

                _unitOfWork.Events.Update(existingEvent);
                var changes = await _unitOfWork.CommitAsync();

                var cachedEvents = _cacheService.Get<List<Event>>(EventsCacheKey);
                if (cachedEvents != null)
                {
                    var index = cachedEvents.FindIndex(e => e.Id == eventId);
                    if (index != -1)
                    {
                        cachedEvents[index] = existingEvent;
                        _cacheService.Set(EventsCacheKey, cachedEvents);
                    }
                }

                if (changes > 0)
                    return Result<Event>.SuccessResult(existingEvent, "Etkinlik başarıyla güncellendi.");

                return Result<Event>.Failure("Etkinlik güncellenemedi.");
            }
            catch (Exception ex)
            {
                return Result<Event>.Failure($"Beklenmeyen hata: {ex.Message}");
            }
        }
    }
}
