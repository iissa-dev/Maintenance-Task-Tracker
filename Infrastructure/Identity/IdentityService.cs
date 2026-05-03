using Application.DTOs.AuthDtos;
using Application.Interfaces.Common;
using Application.Interfaces.IRepository;
using Application.Interfaces.IServices;
using Application.Results;
using Domain.Entities;
using Domain.Enums;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Infrastructure.Identity
{
	public class IdentityService : IIdentityService
	{
		private readonly UserManager<ApplicationUser> _userManager;
		private readonly IRefreshTokenRepository _refreshTokenRepository;
		private readonly IConfiguration _configuration;
		private readonly IAppDbContext _context;


		public IdentityService(
		UserManager<ApplicationUser> userManager,
		IRefreshTokenRepository refreshTokenRepository,
		IConfiguration configuration,
		IAppDbContext context)
		{
			_userManager = userManager;
			_refreshTokenRepository = refreshTokenRepository;
			_configuration = configuration;
			_context = context;
		}

		public async Task<Result<int>> CreateUserAsync(RegisterDto dto, int personId)
		{
			
			var user = new ApplicationUser
			{
				UserName = dto.UserName,
				Email = dto.Email,
				PhoneNumber = dto.PhoneNumber ?? "",
				PersonId =  personId
			};

			var result = await _userManager.CreateAsync(user, dto.Password);

			if (!result.Succeeded)
				return Result<int>.Failure(
					string.Join(", ", result.Errors.Select(e => e.Description)),
					AppError.BadRequest);

			return Result<int>.Success(user.Id);
		}

		public async Task<Result> AddToRoleAsync(int userId, RoleName role)
		{
			var user = await _userManager.FindByIdAsync(userId.ToString());
			if (user == null) return Result.Failure("User no found", AppError.NotFound);

			var result = await _userManager.AddToRoleAsync(user, role.ToString());

			if (!result.Succeeded)
				return Result.Failure(
					string.Join(", ", result.Errors.Select(e => e.Description)),
					AppError.BadRequest);

			return Result.Success();
		}

		public async Task<Result> DeleteUserAsync(int userId)
		{
			var user = await _userManager.FindByIdAsync(userId.ToString());
			if (user is null)
				return Result.Failure("User not found", AppError.NotFound);

			var result = await _userManager.DeleteAsync(user);

			if (!result.Succeeded)
				return Result.Failure(
					string.Join(", ", result.Errors.Select(e => e.Description)),
					AppError.InternalServerError);

			return Result.Success();
		}

		public async Task<Result<TokenResult>> LoginAsync(LoginDto dto)
		{
			var user = await _userManager.FindByNameAsync(dto.UserName);
			if(user is null || !await _userManager.CheckPasswordAsync(user, dto.Password))
				return Result< TokenResult>.Failure("Invalid username or password", AppError.Unauthorized);

			return await GenerateFullTokenResult(user);
		}

		public async Task<Result> RegisterAsync(RegisterDto registerDto, RoleName role = RoleName.Client)
		{
			await using var transaction = await _context.BeginTransactionAsync();

			try 
			{
				var person = new Person
				{
					FirstName = registerDto.FirstName,
					LastName = registerDto.LastName,
					PhoneNumber = registerDto.PhoneNumber ?? "",
					BirthDate = registerDto.DateOfBirth.HasValue ? Convert.ToDateTime(registerDto.DateOfBirth.Value) : null
				};

				_context.People.Add(person);
				await _context.SaveChangesAsync();

				var userResult = await CreateUserAsync(registerDto, person.Id);
				if(!userResult.IsSuccess)
				{
					await transaction.RollbackAsync();
					return Result.Failure("Failed to create user", AppError.InternalServerError);
				}

				var roleResult = await AddToRoleAsync(userResult.Data, role);
				if(!roleResult.IsSuccess)
				{
					await transaction.RollbackAsync();
					return Result.Failure("Failed to create role", AppError.InternalServerError);
				}
				await transaction.CommitAsync();
				return Result.Success("User registered successfully");
			}
			catch (Exception ex) 
			{
				await transaction.RollbackAsync();
				return Result.Failure($"Error: {ex.Message}", AppError.InternalServerError);
			}
		}

		public async Task<Result> LogoutAsync(string refreshToken)
			=> await RevokeTokenAsync(refreshToken);

		private string GenerateJwtToken(ApplicationUser user, string role)
		{

			var claims = new List<Claim>
			{
				new (ClaimTypes.NameIdentifier, user.Id.ToString()),
				new (ClaimTypes.Name, user.UserName!),
				new(ClaimTypes.Role, role)
			};

			var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:SecretKey"]!));

			var token = new JwtSecurityToken(
				issuer: _configuration["Jwt:Issuer"],
				audience: _configuration["Jwt:Audience"],
				claims: claims,
				expires: DateTime.UtcNow.AddMinutes(double.Parse(_configuration["Jwt:ExpiryMinutes"]!)),
				signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256)
			);

			return new JwtSecurityTokenHandler().WriteToken(token);
		}

		private async Task<Result<TokenResult>> GenerateFullTokenResult(ApplicationUser user)
		{
			var roles = await _userManager.GetRolesAsync(user);

			var accessToken = GenerateJwtToken(user, roles.FirstOrDefault() ?? "Client");


			var refreshToken = new UserRefreshToken
			{
				RefreshToken = Guid.NewGuid().ToString(),
				UserId = user.Id,
				ExpiryDate = DateTime.UtcNow.AddDays(7)
			};

			_refreshTokenRepository.Add(refreshToken);

			await _context.SaveChangesAsync();

			return Result<TokenResult>.Success(new TokenResult
			{
				AccessToken = accessToken,
				RefreshToken = refreshToken.RefreshToken,
				UserName = user.UserName!,
				Role = roles.FirstOrDefault() ?? "Client"
			});
		}

		public async Task<Result> RevokeTokenAsync(string refreshToken)
		{
			var token = await _refreshTokenRepository.GetByTokenAsync(refreshToken);

			if (token is null)
				return Result.Failure("Invalid refresh token", AppError.Unauthorized);

			if (token.IsRevoked)
				return Result.Success("Token is already revoked");

			token.IsRevoked = true;
			_refreshTokenRepository.Update(token);

			await _context.SaveChangesAsync();

			return Result.Success("Token revoked successfully");
		}

		public async Task<Result<TokenResult>> RefreshTokenAsync(string refreshToken)
		{
			var token = await _refreshTokenRepository.GetByTokenWithUserAsync(refreshToken);

			if(token is null)
				return Result<TokenResult>.Failure("Refresh toke not found", AppError.NotFound);

			if (token.IsRevoked || token.ExpiryDate < DateTime.UtcNow)
				return Result<TokenResult>.Failure("Invalid or expired token", AppError.Unauthorized);

			token.IsRevoked = true;
			_refreshTokenRepository.Update(token);

			return await GenerateFullTokenResult(token.User); // Save all Update here
		}

		public async Task<Result> UpdateAccountAsync(int id, string email, string userName)
		{
			var user = await _userManager.FindByIdAsync(id.ToString());

			if(user is null)
				return Result.Failure("User not found",AppError.NotFound);

			user.Email = email;
			user.UserName = userName;

			var updatedResult = await _userManager.UpdateAsync(user);
			return !updatedResult.Succeeded 
				? Result.Failure("Failed to update user info", AppError.BadRequest) 
				: Result.Success();
		}
		public async Task<bool> IsInRoleAsync(int userId, RoleName role)
		{
			return await _context.UserRoles
				.AnyAsync(ur => ur.UserId == userId &&
					_context.Roles.Any(r => r.Id == ur.RoleId && r.Name == role.ToString()));
		}
	}
}