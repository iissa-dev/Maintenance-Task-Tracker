using Core.Entities;
using Core.Interfaces.Repository;
using Microsoft.EntityFrameworkCore;
using Repositories.Data;

namespace Repositories
{
	public class RefreshTokenRepository(AppDbContext context) : Repository<UserRefreshToken>(context), IRefreshTokenRepository
	{
		public async Task<UserRefreshToken?> GetByTokenAsync(string refreshToken)
		{
			return await _dbSet.FirstOrDefaultAsync(rt => rt.RefreshToken == refreshToken);
		}
		public async Task<UserRefreshToken?> GetByTokenWithUserAsync(string refreshToken)
		{
			return await _dbSet.Include(rt => rt.User)
							   .FirstOrDefaultAsync(rt => rt.RefreshToken == refreshToken);
		}
	}
}