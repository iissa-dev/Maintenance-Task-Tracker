using Domain.Entities;
using Application.Interfaces.IRepository;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
	public class ServiceRequestRepository(AppDbContext context) : GenericRepository<ServiceRequest>(context), IServiceRequestRepository
	{
		public IQueryable<ServiceRequest> GetAllWithIncludesAsync()
			=> DbSet.AsNoTracking()
			.Include(sr => sr.Category);
	}
}
