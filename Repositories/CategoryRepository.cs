using Core.Entities;
using Core.Interfaces.Repository;
using Microsoft.EntityFrameworkCore;
using Repositories.Data;

namespace Repositories
{
	public class CategoryRepository : ICategoryRepository
	{
		private readonly AppDbContext _context;
		public CategoryRepository(AppDbContext context)
		{
			_context = context;
		}
		public IQueryable<Category> GetTopThreeCategory()
		{
			return _context.Category.Include(c => c.MaintenanceRequests);
		}
	}
}
