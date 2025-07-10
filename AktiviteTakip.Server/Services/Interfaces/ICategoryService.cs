using AktiviteTakip.Server.Common;
using AktiviteTakip.Server.DTOs;

namespace AktiviteTakip.Server.Services.Interfaces
{
    public interface ICategoryService
    {
        Task<Result<List<CategoryDto>>> GetAllCategoriesAsync();
        Task<Result<CategoryDto>> AddCategoryAsync(AddCategoryDto dto);
        Task<Result<CategoryDto>> UpdateCategoryAsync(CategoryDto dto);
        Task<Result<bool>> DeleteCategoryAsync(Guid id);
    }
}
