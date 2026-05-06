using Application.DTOs.AuthDtos;
using Application.DTOs.UserDto;
using Application.Results;

namespace Application.Interfaces.IServices
{
	public interface IAdminServiceCommand
	{
		/// <summary>Creates a new employee account.</summary>
		Task<Result> CreateEmployeeAsync(RegisterDto registerDto);

		/// <summary>Assigns an employee to a maintenance request.</summary>
		Task<Result> AssignEmployee(int requestId, int employeeId);

		Task<Result> DeleteUserAsync(int userId);

		Task<Result> UpdateUserAsync(int userId, UpdateUserDto updateUserDto);

	}
}
