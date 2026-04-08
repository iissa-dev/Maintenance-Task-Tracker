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

		public AccountService(
			UserManager<ApplicationUser> userManager,
			ITokenService tokenService,
			IPersonRepository personRepository)
		{
			_userManager = userManager;
			_tokenService = tokenService;
			_personRepository = personRepository;
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

					var user = new ApplicationUser
					{
						Person = person,
						UserName = registerDto.UserName,
						Email = registerDto.Email,
						PhoneNumber = registerDto.PhoneNumber ?? ""
					};

					var createResult = await _userManager.CreateAsync(user, registerDto.Password);
					if (!createResult.Succeeded)
					{
						return Result.Failure(
							string.Join(", ", createResult.Errors.Select(e => e.Description)),
							AppError.BadRequest);
					}

					var roleResult = await _userManager.AddToRoleAsync(user, roleName.ToString());
					if (!roleResult.Succeeded)
					{
						return Result.Failure(
							string.Join(", ", roleResult.Errors.Select(e => e.Description)),
							AppError.BadRequest);
					}

					await transaction.CommitAsync();
					return Result.Success($"{roleName} Created Successfully");
				}
				catch (Exception)
				{
					return Result.Failure("An unexpected error occurred during user creation.", AppError.InternalServerError);
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