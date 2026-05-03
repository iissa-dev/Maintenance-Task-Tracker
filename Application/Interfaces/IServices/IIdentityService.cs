using Application.DTOs.AuthDtos;
using Application.Results;
using Domain.Entities;
using Domain.Enums;

namespace Application.Interfaces.IServices
{
	public interface IIdentityService
	{
		Task<Result<int>> CreateUserAsync(RegisterDto dto, int personId);
		Task<Result> AddToRoleAsync(int userId, RoleName role);
		Task<Result> DeleteUserAsync(int userId);

		Task<Result<TokenResult>> LoginAsync(LoginDto dto);
		Task<Result> RegisterAsync(RegisterDto registerDto, RoleName role = RoleName.Client);

		Task<Result> LogoutAsync(string refreshToken);

		Task<Result> RevokeTokenAsync(string refreshToken);
		Task<Result<TokenResult>> RefreshTokenAsync(string refreshToken);

		Task<Result> UpdateAccountAsync(int id, string email, string userName);
		Task<bool> IsInRoleAsync(int userId, RoleName role);
	}

}
