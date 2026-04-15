using Core.DTOs.AuthDtos;
using Core.Entities;
using Core.Enums;
using Core.Interfaces.Service;
using Microsoft.AspNetCore.Identity;

namespace Services
{
	public class UserService : IUserService
	{
		private readonly UserManager<ApplicationUser> _userManager;

		public UserService(UserManager<ApplicationUser> userManager)
		{
			_userManager = userManager;
		}

		public async Task<Result<ApplicationUser>> CreateUserAsync(RegisterDto dto)
		{
			var user = new ApplicationUser
			{
				UserName = dto.UserName,
				Email = dto.Email,
				PhoneNumber = dto.PhoneNumber ?? ""
			};

			var result = await _userManager.CreateAsync(user, dto.Password);

			if (!result.Succeeded)
				return Result<ApplicationUser>.Failure(
					string.Join(", ", result.Errors.Select(e => e.Description)),
					AppError.BadRequest);

			return Result<ApplicationUser>.Success(user);
		}

		public async Task<Result> AddToRoleAsync(ApplicationUser user, RoleName role)
		{
			var result = await _userManager.AddToRoleAsync(user, role.ToString());

			if (!result.Succeeded)
				return Result.Failure(
					string.Join(", ", result.Errors.Select(e => e.Description)),
					AppError.BadRequest);

			return Result.Success();
		}

		public async Task<Result> DeleteUserAsync(ApplicationUser user)
		{
			var result = await _userManager.DeleteAsync(user);

			if (!result.Succeeded)
				return Result.Failure(
					string.Join(", ", result.Errors.Select(e => e.Description)),
					AppError.InternalServerError);

			return Result.Success();
		}
	}
}