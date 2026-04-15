using Core.DTOs.AuthDtos;
using Core.Entities;
using Core.Enums;
using Core.Interfaces.Repository;
using Core.Interfaces.Service;
using Microsoft.AspNetCore.Identity;

namespace Services
{
	public class AccountService : IAccountService
	{
		private readonly ITokenService _tokenService;
		private readonly IPersonRepository _personRepository;
		private readonly UserManager<ApplicationUser> _userManager;
		private readonly IUserService _userService;

		public AccountService(
			UserManager<ApplicationUser> userManager,
			ITokenService tokenService,
			IPersonRepository personRepository,
			IUserService userService)
		{
			_userManager = userManager;
			_tokenService = tokenService;
			_personRepository = personRepository;
			_userService = userService;
		}

		public async Task<Result<TokenResult>> LoginAsync(LoginDto dto)
		{
			var user = await _userManager.FindByNameAsync(dto.UserName);
			if (user is null)
				return Result<TokenResult>.Failure("Invalid username or password", AppError.Unauthorized);

			var isValid = await _userManager.CheckPasswordAsync(user, dto.Password);
			if (!isValid)
				return Result<TokenResult>.Failure("Invalid username or password", AppError.Unauthorized);

			var accessToken = await _tokenService.GenerateAccessTokenAsync(user);
			var refreshToken = await _tokenService.GenerateRefreshTokenAsync(user.Id);
			var roles = await _userManager.GetRolesAsync(user);

			return Result<TokenResult>.Success(new TokenResult
			{
				AccessToken = accessToken,
				RefreshToken = refreshToken.RefreshToken,
				Role = roles.FirstOrDefault() ?? RoleName.Client.ToString(),
				UserName = user.UserName!
			});
		}

		public async Task<Result> CreateUserAsync(RegisterDto registerDto, RoleName roleName)
		{
			return await _personRepository.ExecuteWithStrategyAsync(async () =>
			{
				await using var transaction = await _personRepository.BeginTransactAsync();
				try
				{
					var person = new Person
					{
						FirstName = registerDto.FirstName,
						LastName = registerDto.LastName,
						BirthDate = registerDto.DateOfBirth?.ToDateTime(TimeOnly.MinValue),
						PhoneNumber = registerDto.PhoneNumber ?? ""
					};

					await _personRepository.AddAsync(person);
					await _personRepository.SaveChangesAsync();

					var userResult = await _userService.CreateUserAsync(registerDto);

					if (!userResult.IsSuccess)
					{
						await transaction.RollbackAsync();
						return Result.Failure(userResult.Message ?? "An error occurred while creating the user", AppError.BadRequest);
					}

					var user = userResult.Data!;

					var roleResult = await _userService.AddToRoleAsync(user, roleName);

					if (!roleResult.IsSuccess)
					{
						await _userService.DeleteUserAsync(user); // Log this later for debugging
						await transaction.RollbackAsync();

						return Result.Failure(roleResult.Message ?? "An error occurred while assigning the role", AppError.BadRequest);
					}

					await transaction.CommitAsync();
					return Result.Success($"{roleName} Created Successfully");
				}
				catch (Exception ex)
				{
					await transaction.RollbackAsync();
					return Result.Failure($"An unexpected error {ex.Message}", AppError.InternalServerError);
				}
			});
		}
		public async Task<Result> RegisterAsync(RegisterDto registerDto)
		{
			return await CreateUserAsync(registerDto, RoleName.Client);
		}

		public async Task<Result> Logout(string refreshToken) =>
			 await _tokenService.RevokeTokenAsync(refreshToken);

	}
}