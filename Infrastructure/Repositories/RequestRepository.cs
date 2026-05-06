using Application.Interfaces.IRepository;
using Domain.Entities;
using Infrastructure.Data;

namespace Infrastructure.Repositories
{
	public class RequestRepository(AppDbContext context) : GenericRepository<MaintenanceRequest>(context), IRequestRepository
	{
	}
}
