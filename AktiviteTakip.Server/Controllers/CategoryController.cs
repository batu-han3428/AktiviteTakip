﻿using AktiviteTakip.Server.DTOs;
using AktiviteTakip.Server.Enums;
using AktiviteTakip.Server.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AktiviteTakip.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryService _categoryService;

        public CategoryController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }


        /// <summary>
        /// Kategorileri listeler
        /// </summary>
        /// <returns></returns>
        [HttpGet("getcategories")]      
        public async Task<IActionResult> GetCategories()
        {
            var result = await _categoryService.GetAllCategoriesAsync();

            if (!result.Success)
                return BadRequest(result);

            return Ok(result);
        }


        /// <summary>
        /// Kategori ekler
        /// </summary>
        /// <param name="dto">Kategori bilgileri</param>
        /// <returns></returns>
        [HttpPost("addcategory")]
        [Authorize(Roles = nameof(Roles.Admin))]
        public async Task<IActionResult> AddCategory(AddCategoryDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest("Kategori bilgileri eksik veya geçersiz.");

            var result = await _categoryService.AddCategoryAsync(dto);

            if (!result.Success)
                return BadRequest(result.Message);

            return Ok(result);
        }


        /// <summary>
        /// Kategori günceller
        /// </summary>
        /// <param name="dto">Kategori bilgileri</param>
        /// <returns></returns>
        [HttpPut("updatecategory")]
        [Authorize(Roles = nameof(Roles.Admin))]
        public async Task<IActionResult> UpdateCategory(CategoryDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest("Geçersiz kategori bilgisi.");

            var result = await _categoryService.UpdateCategoryAsync(dto);

            if (!result.Success)
                return BadRequest(result.Message);

            return Ok(result);
        }


        /// <summary>
        /// Kategoriyi siler
        /// </summary>
        /// <param name="id">Kategori id</param>
        /// <returns></returns>
        [HttpDelete("deletecategory")]
        [Authorize(Roles = nameof(Roles.Admin))]
        public async Task<IActionResult> DeleteCategory(Guid id)
        {
            if (id == Guid.Empty)
                return BadRequest("Geçersiz firma ID.");

            var result = await _categoryService.DeleteCategoryAsync(id);

            if (!result.Success)
                return BadRequest(result.Message);

            return Ok(result);
        }
    }
}
