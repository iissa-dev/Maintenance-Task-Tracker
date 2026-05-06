using Domain.Entities;

namespace Application.Interfaces.IRepository
{
	public interface IPersonRepository : IGenericRepository<Person>
	{
		Task<Person?> GetByUserIdAsync(int userId);
	}
}
