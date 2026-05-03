using Domain.Entities;

namespace Application.Interfaces.IRepository
{
	public interface IServiceRequestRepository : IGenericRepository<ServiceRequest>
	{
		IQueryable<ServiceRequest> GetAllWithIncludesAsync();

	}
}
