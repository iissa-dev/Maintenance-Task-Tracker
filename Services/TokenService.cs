using Core.DTOs.AuthDtos;
using Core.Entities;
using Core.Enums;
using Core.Interfaces.Repository;
using Core.Interfaces.Service;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Repositories.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Services
{
	public class TokenService : ITokenService
	{
		private readonly UserManager<ApplicationUser> _userManager;
		private readonly IConfiguration _configuration;
		private readonly IRefreshTokenRepository _refreshTokenRepository;

		public TokenService(UserManager<ApplicationUser> userManager, IConfiguration configuration, IRefreshTokenRepository refreshTokenRepository)
		{
			_userManager = userManager;
			_configuration = configuration;
			_refreshTokenRepository = refreshTokenRepository;
		}
		public async Task<string> GenerateAccessTokenAsync(ApplicationUser user)
		{
			var roles = await _userManager.GetRolesAsync(user);
			var role = roles.FirstOrDefault() ?? "Client";

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
		public async Task<UserRefreshToken> GenerateRefreshTokenAsync(int userId)
		{
			var refreshToken = new UserRefreshToken
			{
				RefreshToken = Guid.NewGuid().ToString(),
				UserId = userId,
				DateAdded = DateTime.UtcNow,
				ExpiryDate = DateTime.UtcNow.AddDays(7),
				IsRevoked = false
			};

			await _refreshTokenRepository.AddAsync(refreshToken);
			await _refreshTokenRepository.SaveChangesAsync();

			return refreshToken;
		}
		public async Task<Result<TokenResult>> RefreshTokenAsync(string refreshToken)
		{
			var token = await _refreshTokenRepository.GetByTokenAsync(refreshToken);

			if (token is null || token.User is null)
				return Result<TokenResult>.Failure("Invalid refresh token", AppError.Unauthorized);

			if (token.IsRevoked || token.ExpiryDate < DateTime.UtcNow)
				return Result<TokenResult>.Failure("Refresh token expired or revoked", AppError.Unauthorized);

			token.IsRevoked = true;
			_refreshTokenRepository.Update(token);
			await _refreshTokenRepository.SaveChangesAsync();

			var newAccessToken = await GenerateAccessTokenAsync(token.User);
			var newRefreshToken = await GenerateRefreshTokenAsync(token.User.Id);
			var roles = await _userManager.GetRolesAsync(token.User);

			return Result<TokenResult>.Success(new TokenResult
			{
				AccessToken = newAccessToken,
				RefreshToken = newRefreshToken.RefreshToken,
				UserName = token.User.UserName!,
				Role = roles.FirstOrDefault() ?? "Client"
			});
		}
		public async Task<Result> RevokeTokenAsync(string refreshToken)
		{
			var token = await _refreshTokenRepository.GetByTokenAsync(refreshToken);

			if (token is null)
				return Result.Failure("Invalid refresh token", AppError.Unauthorized);

			token.IsRevoked = true;
			_refreshTokenRepository.Update(token);
			await _refreshTokenRepository.SaveChangesAsync();

			return Result.Success("Token revoked successfully");
		}
	}
}