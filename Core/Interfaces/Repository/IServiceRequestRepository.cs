using Core.Entities;

namespace Core.Interfaces.Repository
{
	public interface IServiceRequestRepository : IRepository<ServiceRequest>
	{
		IQueryable<ServiceRequest> GetAllWithIncludesAsync();

	}
}