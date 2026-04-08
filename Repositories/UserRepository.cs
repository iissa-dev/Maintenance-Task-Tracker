using Core.Entities;
using Core.Enums;
using Core.Interfaces.Repository;
using Microsoft.EntityFrameworkCore;
using Repositories.Data;

namespace Repositories
{
	public class UserRepository(AppDbContext context) : IUserRepository
	{
		private readonly AppDbContext _context = context;

		public IQueryable<ApplicationUser> GetUsersByRole(RoleName roleName)
			=> _context.Users
				.Include(p => p.Person)
				.Where(u => _context.UserRoles.Any(ur => ur.UserId == u.Id && ur.RoleId == (int)roleName));

		public async Task<bool> IsEmployeeAsync(int userId)
			=> await _context.UserRoles
				.AnyAsync(ur => ur.UserId == userId && ur.RoleId == (int)RoleName.Employee);

	}
}