using Core.DTOs.AuthDtos;
using Core.DTOs.Page;
using Core.DTOs.UserDtos;
using Core.Enums;

namespace Core.Interfaces.Service
{
	public interface IAdminService
	{
		/// <summary>Creates a new employee account.</summary>
		Task<Result> CreateEmployeeAsync(RegisterDto registerDto);

		/// <summary>Retrieves a paginated list of users filtered by role.</summary>
		Task<Result<ResultPage<UserReponseDto>>> GetAllUsersByRoleAsync(
			RoleName roleName, int pageNumber, int pageSize, string? searchByUserName);
			
		/// <summary>Assigns an employee to a maintenance request.</summary>
		Task<Result> AssignEmployee(int requestId, int employeeId);

		Task<Result> DeleteUserAsync(int userId);

		Task<Result> UpdateUserAsync(int userId, UpdateUserDto updateUserDto);
	}
}
