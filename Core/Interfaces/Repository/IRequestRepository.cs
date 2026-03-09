using Core.Entities;
using Core.Enums;

namespace Core.Interfaces.Repository
{
	public interface IRequestRepository
	{
		IQueryable<MaintenanceRequest> GetAllAsync();
		Task<MaintenanceRequest?> GetByIdAsync(int id);

		Task UpdateStatusAsync(int id, RequestStatus status);
	}
}
