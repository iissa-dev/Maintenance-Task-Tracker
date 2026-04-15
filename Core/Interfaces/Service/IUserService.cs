using Core.DTOs.AuthDtos;
using Core.Entities;
using Core.Enums;

namespace Core.Interfaces.Service
{
	public interface IUserService
	{
		Task<Result<ApplicationUser>> CreateUserAsync(RegisterDto dto);
		Task<Result> AddToRoleAsync(ApplicationUser user, RoleName role);
		Task<Result> DeleteUserAsync(ApplicationUser user);
	}

}
