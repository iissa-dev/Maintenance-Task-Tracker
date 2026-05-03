using Domain.Entities;

namespace Application.Interfaces.IRepository
{
	public interface IRefreshTokenRepository : IGenericRepository<UserRefreshToken>
	{
		Task<UserRefreshToken?> GetByTokenWithUserAsync(string refreshToken);
		Task<UserRefreshToken?> GetByTokenAsync(string refreshToken);
	}
}
