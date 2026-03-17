using Core.DTOs;
using Core.Entities;
using Core.Enums;
using Core.Interfaces.Repository;
using Core.Interfaces.Service;
using Microsoft.EntityFrameworkCore;

namespace Services
{
	public class CategoryServcie : ICategoryService
	{
		private readonly IRepository<Category> _repository;
		private readonly ICategoryRepository _categoryRepository;
		public CategoryServcie(IRepository<Category> repository, ICategoryRepository categoryRepository)
		{
			_repository = repository;
			_categoryRepository = categoryRepository;
		}

		public async Task<Result> AddAsync(CategoryDto category)
		{
			if (await _repository.ExistsAsync(c => c.Name == category.Name))
			{
				return Result.Failure("Category already exists.", AppError.Conflict);
			}
			

			await _repository.AddAsync(new Category { Name = category.Name });
			await _repository.SaveChangesAsync();
			return Result.Success("Category added successfully.");

		}

		public async Task<Result> DeleteAsync(int id)
		{
			if (await _repository.ExistsAsync(c => c.Id == id))
			{
				return Result.Failure("Category not found.", AppError.NotFound);
			}

			await _repository.DeleteAsync(id);
			await _repository.SaveChangesAsync();
			return Result.Success("Category deleted successfully.");
		}

		public async Task<Result> UpdateAsync(CategoryDto category)
		{
			var existingCategory = await _repository.GetByIdAsync(category.Id);

			if (existingCategory == null)
			{
				return Result.Failure("Category not found.", AppError.NotFound);
			}

			existingCategory.Name = category.Name;

			_repository.Update(existingCategory);
			await _repository.SaveChangesAsync();
			return Result.Success("Category updated successfully.");
		}


		public async Task<Result<IEnumerable<CategoryDto>>> GetAllAsync()
		{
			var categories = _repository.GetAllAsync();

			var dto = await categories.Select(c => new CategoryDto { Id = c.Id, Name = c.Name }).ToListAsync();

			return Result<IEnumerable<CategoryDto>>.Success(dto);
		}

		public async Task<Result<CategoryDto>> GetByIdAsync(int id)
		{
			var category = await _repository.GetByIdAsync(id);

			if (category == null)
			{
				return Result<CategoryDto>.Failure("Category not found.", AppError.NotFound);
			}

			var dto = new CategoryDto { Name = category.Name, Id = category.Id };

			return Result<CategoryDto>.Success(dto);
		}

		public async Task<Result<IEnumerable<CategoryWithRequestCountDto>>> GetTopThreeCategory()
		{
			var categories = await _categoryRepository.GetCategoriesWithRequests()
				.OrderByDescending(c => c.MaintenanceRequests.Count)
				.Take(3)
				.ToListAsync();

			var top3 = categories.Select(c => new CategoryWithRequestCountDto
			{
				Id = c.Id,
				Name = c.Name,
				RequestCount = c.MaintenanceRequests.Count
			});

			return Result<IEnumerable<CategoryWithRequestCountDto>>.Success(top3);
		}
	}
}
