using Core.Entities;

namespace Core.Interfaces.Repository
{
	public interface IRefreshTokenRepository: IRepository<UserRefreshToken>
	{
		Task<UserRefreshToken?> GetByTokenWithUserAsync(string refreshToken);
		Task<UserRefreshToken?> GetByTokenAsync(string refreshToken);
	}
}
