using AktiviteTakip.Server.Common;
using AktiviteTakip.Server.DTOs;

namespace AktiviteTakip.Server.Services.Interfaces
{
    public interface ICategoryService
    {
        Task<Result<List<CategoryDto>>> GetAllCategoriesAsync();
    }
}
