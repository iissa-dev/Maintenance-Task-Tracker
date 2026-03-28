using Core.Entities;
using Core.Enums;
using Core.Interfaces.Repository;
using Microsoft.EntityFrameworkCore;
using Repositories.Data;

namespace Repositories
{
	public class RequestRepository(AppDbContext context) : Repository<MaintenanceRequest>(context), IRequestRepository
	{
		public IQueryable<MaintenanceRequest> GetAllWithIncludes()
			=> _dbSet
			.AsNoTracking()
			.Include(r => r.Category);
					
		public async Task<MaintenanceRequest?> GetByIdWithIncludesAsync(int id)
			=> await _dbSet
			.Include(r => r.Category)
			.FirstOrDefaultAsync(r => r.Id == id);

		public async Task UpdateStatusAsync(int id, RequestStatus status)
			=> await _dbSet.Where(r => r.Id == id)
					 .ExecuteUpdateAsync(s => s.SetProperty(r => r.Status, status));

	}
}