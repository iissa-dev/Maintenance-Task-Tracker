using Core.DTOs;
using Core.Entities;
using Core.Interfaces;

namespace Services
{
	public class CategoryServcie : ICategoryService
	{
		private readonly IRepository<Category> _repository;
		public CategoryServcie(IRepository<Category> repository)
		{
			_repository = repository;
		}

		public Task AddAsync(CategoryDto category)
		{
			throw new NotImplementedException();
		}

		public Task DeleteAsync(int id)
		{
			throw new NotImplementedException();
		}

		public Task<IEnumerable<Category>> GetAllAsync()
		{
			throw new NotImplementedException();
		}

		public Task<Category> GetByIdAsync(int id)
		{
			throw new NotImplementedException();
		}

		public Task UpdateAsync(CategoryDto category)
		{
			throw new NotImplementedException();
		}
	}
}
