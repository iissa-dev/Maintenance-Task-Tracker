using AutoMapper;
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
		private readonly IMapper _mapper;
		public CategoryServcie(IRepository<Category> repository, IMapper mapper, ICategoryRepository categoryRepository)
		{
			_repository = repository;
			_mapper = mapper;
			_categoryRepository = categoryRepository;
		}

		public async Task<Result> AddAsync(CategoryDto category)
		{
			if(await _repository.ExistsAsync(c => c.Name == category.Name))
			{
				return Result.Failure("Category already exists.", AppError.Conflict);
			}

			await _repository.AddAsync(_mapper.Map<Category>(category));
			await _repository.SaveChangesAsync();
			return Result.Success("Category added successfully.");
		}

		public async Task<Result> DeleteAsync(int id)
		{
			if(await _repository.ExistsAsync(c => c.Id == id))
			{
				return Result.Failure("Category not found.", AppError.NotFound);
			}

			await _repository.Delete(id);
			await _repository.SaveChangesAsync();
			return Result.Success("Category deleted successfully.");
		}

		public async Task<Result> UpdateAsync(CategoryDto category)
		{
			var existingCategory = await _repository.GetByIdAsync(category.Id);

			if(existingCategory == null)
			{
				return Result.Failure("Category not found.", AppError.NotFound);
			}

			var entity = _mapper.Map(category, existingCategory);

			_repository.Update(entity);
			await _repository.SaveChangesAsync();
			return Result.Success("Category updated successfully.");
		}
		

		public async Task<Result<IEnumerable<CategoryDto>>> GetAllAsync()
		{
			var categories = await _repository.GetAllAsync();

			var dto = _mapper.Map<IEnumerable<CategoryDto>>(categories);

			return Result<IEnumerable<CategoryDto>>.Success(dto);
		}

		public async Task<Result<CategoryDto>> GetByIdAsync(int id)
		{
			var category = await _repository.GetByIdAsync(id);

			if(category == null)
			{
				return Result<CategoryDto>.Failure("Category not found.", AppError.NotFound);
			}

			var dto = _mapper.Map<CategoryDto>(category);

			return Result<CategoryDto>.Success(dto);
		}

		public async Task<Result<IEnumerable<CategoryWithRequestCountDto>>> GetTopThreeCategory()
		{
			var categories = await _categoryRepository.GetTopThreeCategory()
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
