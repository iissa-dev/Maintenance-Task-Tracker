using Core.Entities;
using Core.Interfaces.Repository;
using Repositories.Data;

namespace Repositories
{
	public class PersonRepository(AppDbContext context) : Repository<Person>(context), IPersonRepository
	{
	}
}
