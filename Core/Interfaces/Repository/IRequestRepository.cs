using Core.Entities;
using Core.Enums;

namespace Core.Interfaces.Repository
{
	public interface IRequestRepository : IRepository<MaintenanceRequest>
	{
		IQueryable<MaintenanceRequest> GetAllWithIncludes();
		Task<MaintenanceRequest?> GetByIdWithIncludesAsync(int id);
		Task UpdateStatusAsync(int id, RequestStatus status);
	}
}