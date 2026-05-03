using Domain.Entities;
using Domain.Enums;

namespace Application.Interfaces.IRepository
{
	public interface IRequestRepository : IGenericRepository<MaintenanceRequest>
	{
		Task UpdateStatusAsync(int id, RequestStatus status);
	}
}
