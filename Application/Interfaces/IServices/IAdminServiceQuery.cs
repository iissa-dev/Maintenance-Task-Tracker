using Application.DTOs.Page;
using Application.DTOs.UserDto;
using Application.Results;
using Domain.Enums;

namespace Application.Interfaces.IServices
{
	public interface IAdminServiceQuery
	{
		Task<Result<ResultPage<UserResponseDto>>> GetAllUsersByRoleAsync(
		RoleName roleName,
		int pageNumber = 1,
		int pageSize = 10,
		string? searchByUserName = null);
	}
}
