using AktiviteTakip.Server.Services.Interfaces;
using System.Security.Claims;

namespace AktiviteTakip.Server.Services
{
    public class UserContextService : IUserContextService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public UserContextService(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public Guid? GetUserId()
        {
            var userIdString = _httpContextAccessor.HttpContext?.User?.FindFirstValue("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier")
            ?? _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? _httpContextAccessor.HttpContext?.User?.FindFirstValue("sub");

            if (Guid.TryParse(userIdString, out var userId))
            {
                return userId;
            }

            return null;
        }
    }
}
