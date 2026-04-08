using Core.DTOs.AuthDtos;
using Core.DTOs.Page;
using Core.DTOs.UserDtos;
using Core.Entities;
using Core.Enums;
using Core.Extensions;
using Core.Interfaces.Repository;
using Core.Interfaces.Service;
using Microsoft.AspNetCore.Identity;
using Services.Mappers;

namespace Services
{
	public class AdminService : IAdminService
	{
		private readonly IRequestRepository _requestRepository;
		private readonly IUserRepository _userRepository;
		private readonly IPersonRepository _personRepository;
		private readonly IAccountService _accountService;
		private readonly UserManager<ApplicationUser> _userManager;

		public AdminService(
			IRequestRepository requestRepository,
			IUserRepository userRepository,
			IPersonRepository personRepository,
			IAccountService accountService,
			UserManager<ApplicationUser> userManager)
		{
			_requestRepository = requestRepository;
			_userRepository = userRepository;
			_personRepository = personRepository;
			_accountService = accountService;
			_userManager = userManager;
		}


		public async Task<Result> AssignEmployee(int requestId, int employeeId)
		{

			var request = await _requestRepository.GetByIdAsync(requestId);

			if (request is null)
				return Result.Failure("Request not found.", AppError.NotFound);

			var isEmployee = await _userRepository.IsEmployeeAsync(employeeId);

			if (!isEmployee)
				return Result.Failure("Employee not found", AppError.NotFound);

			request.AssignedToUserId = employeeId;
			request.Status = RequestStatus.InProgress;
			_requestRepository.Update(request);
			await _requestRepository.SaveChangesAsync();

			return Result.Success("Employee assigned successfully");
		}

		public async Task<Result> CreateEmployeeAsync(RegisterDto registerDto)
			=> await _accountService.CreateUserAsync(registerDto, RoleName.Employee);


		public async Task<Result<ResultPage<UserReponseDto>>> GetAllUsersByRoleAsync(
		RoleName roleName,
		int pageNumber = 1,
		int pageSize = 10,
		string? searchByUserName = null)
		{
			var query = _userRepository.GetUsersByRole(roleName);


			if (!string.IsNullOrEmpty(searchByUserName))
				query = query.Where(u => u.UserName!.Contains(searchByUserName));

			var data = await query
				.OrderBy(u => u.Id)
				.Select(u => u.ToDto(roleName))
				.ToPagedResultAsync(pageNumber, pageSize);

			return Result<ResultPage<UserReponseDto>>.Success(data);
		}

		public async Task<Result> DeleteUserAsync(int userId)
		{
			var user = await _userManager.FindByIdAsync(userId.ToString());
			if (user is null)
				return Result.Failure("User not found.", AppError.NotFound);

			var result = await _userManager.DeleteAsync(user);
			if (!result.Succeeded)
				return Result.Failure(
					string.Join(", ", result.Errors.Select(e => e.Description)),
					AppError.BadRequest);

			return Result.Success("User deleted successfully.");
		}

		public async Task<Result> UpdateUserAsync(int id, UpdateUserDto dto)
		{
			await using var transaction = await _personRepository.BeginTransactAsync();

			try
			{
				var user = await _userManager.FindByIdAsync(id.ToString());
				if (user is null)
					return Result.Failure("User not found.", AppError.NotFound);

				var person = await _personRepository.GetByIdAsync(user.PersonId);
				if (person is null)
					return Result.Failure("Person not found.", AppError.NotFound);

				user.Email = dto.Email;
				user.UserName = dto.UserName;
				var result = await _userManager.UpdateAsync(user);

				if (!result.Succeeded)
				{
					await transaction.RollbackAsync();
					return Result.Failure(
						string.Join(", ", result.Errors.Select(e => e.Description)),
						AppError.BadRequest);
				}

				person.FirstName = dto.FirstName;
				person.LastName = dto.LastName;
				_personRepository.Update(person);
				await _personRepository.SaveChangesAsync();


				await transaction.CommitAsync();
				return Result.Success("User updated successfully.");
			}
			catch (Exception)
			{
				await transaction.RollbackAsync();
				throw;
			}
		}
	}
}
