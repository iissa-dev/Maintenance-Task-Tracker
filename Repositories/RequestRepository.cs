using Core.Entities;
using Core.Enums;
using Core.Interfaces.Repository;
using Microsoft.EntityFrameworkCore;
using Repositories.Data;

namespace Repositories
{
	public class RequestRepository : IRequestRepository
	{
		private readonly AppDbContext _context;

		public RequestRepository(AppDbContext context)
		{
			_context = context;
		}

		public IQueryable<MaintenanceRequest> GetAllAsync()
		{
			return _context.MaintenanceRequest
				.Include(r => r.Category);
		}

		public async Task<MaintenanceRequest?> GetByIdAsync(int id)
		{
			return await _context.MaintenanceRequest
				.Include(r => r.Category)
				.FirstOrDefaultAsync(r => r.Id == id);
		}

		public async Task UpdateStatusAsync(int id, RequestStatus status)
		{
			await _context.MaintenanceRequest
				.Where(r => r.Id == id)
				.ExecuteUpdateAsync(r => r.SetProperty(req => req.Status, status));
		}
	}
}