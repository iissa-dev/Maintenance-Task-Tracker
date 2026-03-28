using Core.Entities;
using Core.Interfaces.Repository;
using Microsoft.EntityFrameworkCore;
using Repositories.Data;

namespace Repositories
{
	public class CategoryRepository : Repository<Category>, ICategoryRepository
	{
		public CategoryRepository(AppDbContext context) : base(context) { }
		public IQueryable<Category> GetAllWithIncludesAsync()
		{
			return _dbSet.AsNoTracking().Include(c => c.MaintenanceRequests);
		}
	}
}
