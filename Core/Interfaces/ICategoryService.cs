using Core.DTOs;
using Core.Entities;

namespace Core.Interfaces
{
	public interface ICategoryService
	{

		Task<Result<IEnumerable<CategoryDto>>> GetAllAsync();
		Task<Result<CategoryDto>> GetByIdAsync(int id);
		Task<Result> AddAsync(CategoryDto category);
		Task<Result> UpdateAsync(CategoryDto category);
		Task<Result> DeleteAsync(int id);
	}
}
