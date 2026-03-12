using Core.DTOs.AuthDtos;
using Core.DTOs.Page;
using Core.DTOs.UserDtos;
using Core.Enums;
using Core.Interfaces.Service;
using Microsoft.EntityFrameworkCore;
using Repositories.Data;

namespace Services
{
	public class AdminService : IAdminService
	{
		private readonly AppDbContext _context;
		private readonly IAccountService _accountService;
		public AdminService(AppDbContext context, IAccountService accountService)
		{
			_context = context;
			_accountService = accountService;
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

		public async Task<Result<ResultPage<UserReponseDto>>> GetAllUsersByRoleAsync(RoleName roleName, int pageNumber = 1, int pageSize = 10)
		{
			var query =  _context.Users
			.Where(u => _context.UserRoles
			.Any(ur => ur.UserId == u.Id && ur.RoleId == (int) roleName));
			
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

	}
}
