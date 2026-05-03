using Domain.Entities;
using Application.Interfaces.IRepository;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
	public class PersonRepository(AppDbContext context) : GenericRepository<Person>(context), IPersonRepository
	{
		public async Task<Person?> GetByUserIdAsync(int userId)
		{
			var user = await Context.Users
				.Include(u => u.Person)
				.FirstOrDefaultAsync(u => u.Id == userId);

			return user?.Person;
		}
	}
}
