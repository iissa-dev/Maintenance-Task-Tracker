using Domain.Entities;
using Domain.Enums;
using Application.Interfaces.IRepository;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
	public class RequestRepository(AppDbContext context) : GenericRepository<MaintenanceRequest>(context), IRequestRepository
	{

		public async Task UpdateStatusAsync(int id, RequestStatus status)
			=> await DbSet.Where(r => r.Id == id)
					 .ExecuteUpdateAsync(s => s.SetProperty(r => r.Status, status));

	}
}
