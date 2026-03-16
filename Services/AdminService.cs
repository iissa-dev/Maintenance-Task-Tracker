using AutoMapper;
using Core.DTOs.AuthDtos;
using Core.DTOs.Page;
using Core.DTOs.UserDtos;
using Core.Entities;
using Core.Enums;
using Core.Interfaces.Service;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Repositories.Data;

namespace Services
{
	public class AdminService : IAdminService
	{
		private readonly AppDbContext _context;
		private readonly IAccountService _accountService;
		private readonly IMapper _mapper;
		private readonly UserManager<ApplicationUser> _userManager;
		public AdminService(AppDbContext context, IAccountService accountService, IMapper mapper, UserManager<ApplicationUser> userManager)
		{
			_context = context;
			_accountService = accountService;
			_mapper = mapper;
			_userManager = userManager;
		}

		public async Task<Result> AssignEmployee(int requestId, int	employeeId)
		{

			var request = await _context.MaintenanceRequest
				.FirstOrDefaultAsync(r => r.Id == requestId);

			if (request is null)
				return Result.Failure("Request not found.", AppError.NotFound);

			var isEmployee = await _context.UserRoles
				.AnyAsync(ur => ur.UserId == employeeId && ur.RoleId == (int) RoleName.Employee);

			if (!isEmployee)
				return Result.Failure("Employee not found", AppError.NotFound);

			request.AssignedToUserId = employeeId;
			request.Status = RequestStatus.InProgress;
			await _context.SaveChangesAsync();

			return Result.Success("Employee assigned successfully");
		}

		public async Task<Result> CreateEmployeeAsync(RegisterDto registerDto)
		{
			return await _accountService.CreateUserAsync(registerDto, RoleName.Employee);
		}

		public async Task<Result<ResultPage<UserReponseDto>>> GetAllUsersByRoleAsync(RoleName roleName, int pageNumber = 1, int pageSize = 10, string? searchByUserName = null)
		{
			var query =  _context.Users
			.Where(u => _context.UserRoles
			.Any(ur => ur.UserId == u.Id && ur.RoleId == (int) roleName));
			
			if(!string.IsNullOrEmpty(searchByUserName)) 
				query = query.Where(u => u.UserName!.Contains(searchByUserName));

			var totalItems = await query.CountAsync();

			var items = await query
			.OrderBy(u => u.Id)
			.Skip((pageNumber - 1) * pageSize)
			.Take(pageSize)
			.Select(u => new UserReponseDto {
				Id = u.Id,
				UserName = u.UserName!,
				Email = u.Email!,
				FullName = u.Person.FirstName + " " + u.Person.LastName,
				PhoneNumber = u.Person.PhoneNumber,
				Role = roleName.ToString()
			})
			.ToListAsync();

			var pageResult = new ResultPage<UserReponseDto>
			{
				Items = items,
				TotalItems = totalItems,
				PageNumber = pageNumber,
				PageCount = pageSize,
				TotalPages = (int)Math.Ceiling(totalItems / (double)pageSize)
			};

			return Result<ResultPage<UserReponseDto>>.Success(pageResult, "Success");
		}

		public async Task<Result> DeleteUserAsync(int userId) {
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
			var strategy = _context.Database.CreateExecutionStrategy();

			return await strategy.ExecuteAsync(async () =>
			{
				await using var transaction = await _context.Database.BeginTransactionAsync();
				try
				{
					var user = await _userManager.FindByIdAsync(id.ToString());
					if (user is null)
						return Result.Failure("User not found.", AppError.NotFound);

					var person = await _context.People.FindAsync(user.PersonId);
					if (person is null)
						return Result.Failure("Person not found.", AppError.NotFound);

					person.FirstName = dto.FirstName;
					person.LastName = dto.LastName;
					await _context.SaveChangesAsync();

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

					await transaction.CommitAsync();
					return Result.Success("User updated successfully.");
				}
				catch (Exception)
				{
					await transaction.RollbackAsync();
					throw;
				}
			});
		}
	}
}
