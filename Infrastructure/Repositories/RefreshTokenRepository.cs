using Domain.Entities;
using Application.Interfaces.IRepository;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
	public class RefreshTokenRepository(AppDbContext context) : GenericRepository<UserRefreshToken>(context), IRefreshTokenRepository
	{
		public async Task<UserRefreshToken?> GetByTokenAsync(string refreshToken)
		{
			return await DbSet.Include(r => r.User).FirstOrDefaultAsync(rt => rt.RefreshToken == refreshToken);
		}
		public async Task<UserRefreshToken?> GetByTokenWithUserAsync(string refreshToken)
		{
			return await DbSet.Include(rt => rt.User)
							   .FirstOrDefaultAsync(rt => rt.RefreshToken == refreshToken);
		}
	}
}
