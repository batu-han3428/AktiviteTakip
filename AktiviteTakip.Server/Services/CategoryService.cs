using AktiviteTakip.Server.Common;
using AktiviteTakip.Server.DTOs;
using AktiviteTakip.Server.Services.Interfaces;
using AktiviteTakip.Server.UnitOfWork.Interfaces;

namespace AktiviteTakip.Server.Services
{
    public class CategoryService: ICategoryService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICacheService _cacheService;
        private static readonly string CategoriesCacheKey = "categoriesCacheKey";

        public CategoryService(IUnitOfWork unitOfWork, ICacheService cacheService)
        {
            _unitOfWork = unitOfWork;
            _cacheService = cacheService;
        }

        public async Task<Result<List<CategoryDto>>> GetAllCategoriesAsync()
        {
            var cachedCategories = _cacheService.Get<List<CategoryDto>>(CategoriesCacheKey);
            if (cachedCategories != null)
            {
                return Result<List<CategoryDto>>.SuccessResult(cachedCategories);
            }

            try
            {
                var categories = await _unitOfWork.Categories.GetAllAsync();

                if (categories == null || !categories.Any())
                    return Result<List<CategoryDto>>.Failure("Kategori bulunamadı.");

                var categoryDtos = categories.Select(f => new CategoryDto
                {
                    Id = f.Id,
                    Name = f.Name
                }).ToList();

                _cacheService.Set(CategoriesCacheKey, categoryDtos);

                return Result<List<CategoryDto>>.SuccessResult(categoryDtos);
            }
            catch (Exception ex)
            {
                return Result<List<CategoryDto>>.Failure("Failed to get firms with projects: " + ex.Message);
            }
        }
    }
}
