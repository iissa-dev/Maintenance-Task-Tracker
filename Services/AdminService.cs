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

		private readonly UserManager<ApplicationUser> _userManager;
		private readonly AppDbContext _context;
		private readonly IRequestService _requestService;
		public AdminService(UserManager<ApplicationUser> userManager, AppDbContext context, IRequestService requestService)
		{
			_userManager = userManager;
			_context = context;
			_requestService = requestService;
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
			var person = new Person
			{
				FirstName = registerDto.FirstName,
				LastName = registerDto.LastName,
				PhoneNumber = registerDto.PhoneNumber ?? "",
				BirthDate = registerDto.DateOfBirth.HasValue
				? registerDto.DateOfBirth.Value.ToDateTime(TimeOnly.MinValue)
				: null
			};

			await _context.People.AddAsync(person);
			await _context.SaveChangesAsync();

			var user = new ApplicationUser
			{
				PersonId = person.Id,
				UserName = registerDto.UserName,
				Email = registerDto.Email,
				PhoneNumber = registerDto.PhoneNumber ?? "",
			};

			var result = await _userManager.CreateAsync(user, registerDto.Password);

			if (!result.Succeeded)
			{
				_context.People.Remove(person);
				await _context.SaveChangesAsync();

				return Result.Failure(
						string.Join(", ", result.Errors.Select(e => e.Description)),
						AppError.BadRequest);
			}

			await _userManager.AddToRoleAsync(user, RoleName.Employee.ToString());

			return Result.Success("Create Employee Success");
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
