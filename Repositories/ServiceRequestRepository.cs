using Core.Entities;
using Core.Interfaces.Repository;
using Microsoft.EntityFrameworkCore;
using Repositories.Data;

namespace Repositories
{
	public class ServiceRequestRepository(AppDbContext context) : Repository<ServiceRequest>(context), IServiceRequestRepository
	{
		public IQueryable<ServiceRequest> GetAllWithIncludesAsync()
			=> _dbSet.AsNoTracking()
			.Include(sr => sr.Category);
	}
}