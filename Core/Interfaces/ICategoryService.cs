using Core.DTOs;
using Core.Entities;

namespace Core.Interfaces
{
	public interface ICategoryService
	{

		Task<IEnumerable<Category>> GetAllAsync();
		Task<Category> GetByIdAsync(int id);
		Task AddAsync(CategoryDto category);
		Task UpdateAsync(CategoryDto category);
		Task DeleteAsync(int id);
	}
}
