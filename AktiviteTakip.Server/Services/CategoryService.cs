using AktiviteTakip.Server.Common;
using AktiviteTakip.Server.DTOs;
using AktiviteTakip.Server.Entities;
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

        public async Task<Result<CategoryDto>> AddCategoryAsync(AddCategoryDto dto)
        {
            try
            {
                var existingCategories = await _unitOfWork.Categories.GetAllAsync();
                if (existingCategories.Any(c => c.Name.Trim().ToLower() == dto.Name.Trim().ToLower()))
                {
                    return Result<CategoryDto>.Failure("Bu isimde bir kategori zaten mevcut.");
                }

                var category = new Category
                {
                    Name = dto.Name
                };

                await _unitOfWork.Categories.AddAsync(category);
                await _unitOfWork.CommitAsync();

                var newCategoryDto = new CategoryDto
                {
                    Id = category.Id,
                    Name = category.Name
                };

                var cachedCategories = _cacheService.Get<List<CategoryDto>>(CategoriesCacheKey) ?? new List<CategoryDto>();
                cachedCategories.Add(newCategoryDto);
                _cacheService.Set(CategoriesCacheKey, cachedCategories);

                return Result<CategoryDto>.SuccessResult(newCategoryDto, "Kategori başarıyla eklendi.");
            }
            catch (Exception ex)
            {
                return Result<CategoryDto>.Failure("Kategori eklenirken hata oluştu: " + ex.Message);
            }
        }

        public async Task<Result<CategoryDto>> UpdateCategoryAsync(CategoryDto dto)
        {
            try
            {
                var category = await _unitOfWork.Categories.GetByIdAsync(dto.Id);
                if (category == null)
                    return Result<CategoryDto>.Failure("Kategori bulunamadı.");

                var existingCategories = await _unitOfWork.Categories.GetAllAsync();
                if (existingCategories.Any(c => c.Name.Trim().ToLower() == dto.Name.Trim().ToLower() && c.Id != dto.Id))
                {
                    return Result<CategoryDto>.Failure("Bu isimde başka bir kategori zaten mevcut.");
                }

                category.Name = dto.Name;

                _unitOfWork.Categories.Update(category);
                await _unitOfWork.CommitAsync();

                var updatedCategoryDto = new CategoryDto
                {
                    Id = category.Id,
                    Name = category.Name
                };

                var cachedCategories = _cacheService.Get<List<CategoryDto>>(CategoriesCacheKey) ?? new List<CategoryDto>();
                var cachedCategory = cachedCategories.FirstOrDefault(c => c.Id == dto.Id);
                if (cachedCategory != null)
                {
                    cachedCategory.Name = updatedCategoryDto.Name;
                }
                _cacheService.Set(CategoriesCacheKey, cachedCategories);

                return Result<CategoryDto>.SuccessResult(updatedCategoryDto, "Kategori başarıyla güncellendi.");
            }
            catch (Exception ex)
            {
                return Result<CategoryDto>.Failure("Kategori güncellenirken hata oluştu: " + ex.Message);
            }
        }

        public async Task<Result<bool>> DeleteCategoryAsync(Guid id)
        {
            try
            {
                if (id == Guid.Empty)
                    return Result<bool>.Failure("Geçersiz kategori ID.");

                var category = await _unitOfWork.Categories.GetByIdAsync(id);
                if (category == null)
                    return Result<bool>.Failure("Kategori bulunamadı.");

                await _unitOfWork.Categories.SoftDeleteAsync(category);
                await _unitOfWork.CommitAsync();

                var cachedCategories = _cacheService.Get<List<CategoryDto>>(CategoriesCacheKey) ?? new List<CategoryDto>();
                var cachedCategory = cachedCategories.FirstOrDefault(c => c.Id == id);
                if (cachedCategory != null)
                {
                    cachedCategories.Remove(cachedCategory);
                    _cacheService.Set(CategoriesCacheKey, cachedCategories);
                }

                return Result<bool>.SuccessResult(true, "Kategori başarıyla silindi.");
            }
            catch (Exception ex)
            {
                return Result<bool>.Failure("Kategori silinirken hata oluştu: " + ex.Message);
            }
        }
    }
}
