using Core.Entities;
using Core.Enums;

namespace Core.Interfaces.Repository
{
	public interface IUserRepository
	{
		IQueryable<ApplicationUser> GetUsersByRole(RoleName roleName);
		Task<bool> IsEmployeeAsync(int userId);
	}
}